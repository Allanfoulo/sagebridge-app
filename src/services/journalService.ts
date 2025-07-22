import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type JournalEntry = Database['public']['Tables']['journal_entries']['Insert'];
type JournalEntryLine = Database['public']['Tables']['journal_entry_lines']['Insert'];

export interface CreateJournalEntryData {
  date: Date;
  reference: string;
  description: string;
  lines: {
    account_id: string;
    description?: string;
    debit_amount?: number;
    credit_amount?: number;
  }[];
  status?: 'draft' | 'posted';
}

export interface CreateRecurringJournalData extends CreateJournalEntryData {
  recurring: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    start_date: Date;
    end_date?: Date;
    occurrences?: number;
  };
}

/**
 * Generate the next journal entry number
 */
export const generateJournalEntryNumber = async (): Promise<string> => {
  try {
    // Get the latest journal entry number
    const { data, error } = await supabase
      .from('journal_entries')
      .select('entry_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest journal entry:', error);
      // Fallback to JE-0001 if there's an error
      return 'JE-0001';
    }

    if (!data || data.length === 0) {
      return 'JE-0001';
    }

    // Extract number from the latest entry (e.g., "JE-0005" -> 5)
    const latestNumber = data[0].entry_number;
    const numberMatch = latestNumber?.match(/JE-(\d+)/);
    
    if (numberMatch) {
      const nextNumber = parseInt(numberMatch[1]) + 1;
      return `JE-${nextNumber.toString().padStart(4, '0')}`;
    }

    // Fallback if format doesn't match
    return 'JE-0001';
  } catch (error) {
    console.error('Error generating journal entry number:', error);
    return 'JE-0001';
  }
};

/**
 * Create a new journal entry with lines
 */
export const createJournalEntry = async (
  data: CreateJournalEntryData,
  userId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Validate that debits equal credits
    const totalDebits = data.lines.reduce((sum, line) => sum + (line.debit_amount || 0), 0);
    const totalCredits = data.lines.reduce((sum, line) => sum + (line.credit_amount || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return {
        success: false,
        error: 'Journal entry is not balanced. Total debits must equal total credits.'
      };
    }

    // Generate entry number
    const entryNumber = await generateJournalEntryNumber();

    // Prepare journal entry data
    const journalEntryData: JournalEntry = {
      date: data.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      reference: data.reference,
      description: data.description,
      status: data.status || 'draft',
      entry_number: entryNumber,
      created_by: userId,
    };

    // Insert journal entry
    const { data: journalEntry, error: journalError } = await supabase
      .from('journal_entries')
      .insert([journalEntryData])
      .select()
      .single();

    if (journalError) {
      console.error('Error creating journal entry:', journalError);
      return {
        success: false,
        error: journalError.message || 'Failed to create journal entry'
      };
    }

    // Prepare journal entry lines
    const journalLines: JournalEntryLine[] = data.lines.map(line => ({
      journal_entry_id: journalEntry.id,
      account_id: line.account_id,
      description: line.description || null,
      debit_amount: line.debit_amount || null,
      credit_amount: line.credit_amount || null,
    }));

    // Insert journal entry lines
    const { error: linesError } = await supabase
      .from('journal_entry_lines')
      .insert(journalLines);

    if (linesError) {
      console.error('Error creating journal entry lines:', linesError);
      // Try to clean up the journal entry if lines failed
      await supabase
        .from('journal_entries')
        .delete()
        .eq('id', journalEntry.id);
      
      return {
        success: false,
        error: linesError.message || 'Failed to create journal entry lines'
      };
    }

    return {
      success: true,
      data: {
        journalEntry,
        entryNumber
      }
    };
  } catch (error) {
    console.error('Unexpected error creating journal entry:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while creating the journal entry'
    };
  }
};

/**
 * Save journal entry as draft
 */
export const saveJournalAsDraft = async (
  data: CreateJournalEntryData,
  userId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  return createJournalEntry({ ...data, status: 'draft' }, userId);
};

/**
 * Get all accounts for journal entry creation
 */
export const getAccountsForJournal = async (): Promise<{
  success: boolean;
  data?: Array<{ id: string; account_number: string; name: string; type: string }>;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('chart_of_accounts')
      .select('id, account_number, name, type')
      .eq('is_active', true)
      .order('account_number');

    if (error) {
      console.error('Error fetching accounts:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch accounts'
      };
    }

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Unexpected error fetching accounts:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching accounts'
    };
  }
};

/**
 * Create recurring journal entries
 */
export const createRecurringJournalEntry = async (
  data: CreateRecurringJournalData,
  userId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // For now, just create the first entry
    // TODO: Implement full recurring logic with scheduling
    const result = await createJournalEntry(data, userId);
    
    if (result.success) {
      // TODO: Store recurring schedule in a separate table
      console.log('Recurring journal entry created. Schedule:', data.recurring);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating recurring journal entry:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while creating the recurring journal entry'
    };
  }
};