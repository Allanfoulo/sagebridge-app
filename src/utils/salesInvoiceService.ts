
import { supabase } from "@/integrations/supabase/client";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

interface Invoice {
  customer: string;
  invoiceDate: string;
  dueDate: string;
  invoiceNumber: string;
  paymentTerms: string;
  notes: string;
  items: InvoiceItem[];
  currency: string;
}

// Define types for database tables to satisfy TypeScript
type SalesInvoice = {
  id?: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  subtotal: number;
  tax_total: number;
  total: number;
  notes?: string;
  currency: string;
  status: string;
}

type SalesInvoiceItem = {
  id?: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_percent: number;
  line_total: number;
}

export const saveInvoice = async (invoice: Invoice) => {
  try {
    // Calculate totals
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.tax / 100), 0);
    const total = subtotal + taxTotal;

    // First insert the invoice header
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('sales_invoices')
      .insert({
        customer_id: invoice.customer,
        invoice_number: invoice.invoiceNumber,
        invoice_date: invoice.invoiceDate,
        due_date: invoice.dueDate,
        payment_terms: invoice.paymentTerms,
        subtotal,
        tax_total: taxTotal,
        total,
        notes: invoice.notes,
        currency: invoice.currency,
        status: 'Draft'
      } as SalesInvoice)
      .select('id')
      .single();

    if (invoiceError) throw invoiceError;

    const invoiceId = invoiceData.id;

    // Then insert all invoice items
    const invoiceItems = invoice.items.map(item => ({
      invoice_id: invoiceId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_percent: item.tax,
      line_total: item.quantity * item.unitPrice
    } as SalesInvoiceItem));

    const { error: itemsError } = await supabase
      .from('sales_invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    return { success: true, invoiceId };
  } catch (error) {
    console.error('Error saving invoice:', error);
    return { success: false, error };
  }
};

export const fetchInvoices = async () => {
  try {
    // Fetch invoices with customer details
    const { data: invoices, error } = await supabase
      .from('sales_invoices')
      .select(`
        id, 
        invoice_number, 
        invoice_date, 
        status, 
        total, 
        currency,
        customers(name)
      `)
      .order('invoice_date', { ascending: false });
    
    if (error) throw error;
    
    return { 
      success: true, 
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        customer: invoice.customers?.name || 'Unknown Customer',
        date: invoice.invoice_date,
        amount: `${getCurrencySymbol(invoice.currency)}${invoice.total.toFixed(2)}`,
        status: invoice.status
      }))
    };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return { success: false, error };
  }
};

export const fetchFilteredInvoices = async (status: string) => {
  try {
    // Fetch invoices with customer details filtered by status
    const { data: invoices, error } = await supabase
      .from('sales_invoices')
      .select(`
        id, 
        invoice_number, 
        invoice_date, 
        status, 
        total, 
        currency,
        customers(name)
      `)
      .eq('status', status)
      .order('invoice_date', { ascending: false });
    
    if (error) throw error;
    
    return { 
      success: true, 
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        customer: invoice.customers?.name || 'Unknown Customer',
        date: invoice.invoice_date,
        amount: `${getCurrencySymbol(invoice.currency)}${invoice.total.toFixed(2)}`,
        status: invoice.status
      }))
    };
  } catch (error) {
    console.error(`Error fetching ${status} invoices:`, error);
    return { success: false, error };
  }
};

export const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('sales_invoices')
      .update({ status: newStatus })
      .eq('id', invoiceId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return { success: false, error };
  }
};

export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'ZAR':
      return 'R';
    case 'USD':
      return '$';
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    default:
      return 'R';
  }
};

export const availableCurrencies = [
  { label: 'South African Rand (ZAR)', value: 'ZAR', symbol: 'R' },
  { label: 'US Dollar (USD)', value: 'USD', symbol: '$' },
  { label: 'British Pound (GBP)', value: 'GBP', symbol: '£' },
  { label: 'Euro (EUR)', value: 'EUR', symbol: '€' }
];
