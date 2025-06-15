
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  dueDate: string;
  description: string;
  amount: string;
  status: 'upcoming' | 'overdue';
  daysRemaining: number;
}

const UpcomingPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingPayments();
  }, []);

  const fetchUpcomingPayments = async () => {
    try {
      setIsLoading(true);

      // Fetch unpaid supplier invoices
      const { data: supplierInvoices, error: supplierError } = await supabase
        .from('supplier_invoices')
        .select(`
          id,
          due_date,
          total_amount,
          suppliers(name)
        `)
        .neq('status', 'Paid')
        .order('due_date', { ascending: true })
        .limit(10);

      if (supplierError) throw supplierError;

      // Process and format the payments
      const today = new Date();
      const formattedPayments: Payment[] = supplierInvoices?.map(invoice => {
        const dueDate = new Date(invoice.due_date);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return {
          id: invoice.id,
          dueDate: invoice.due_date,
          description: `Payment to ${invoice.suppliers?.name || 'Unknown Supplier'}`,
          amount: `R${Number(invoice.total_amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
          status: daysDiff < 0 ? 'overdue' : 'upcoming',
          daysRemaining: daysDiff
        };
      }) || [];

      setPayments(formattedPayments);

    } catch (error: any) {
      console.error('Error fetching upcoming payments:', error);
      toast({
        title: "Error",
        description: "Failed to load upcoming payments.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Upcoming Payments</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Loading payments...</p>
        </CardHeader>
        <CardContent className="py-4">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div>
                  <div className="w-20 h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Upcoming Payments</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Bills and invoices due soon</p>
      </CardHeader>
      <CardContent className="py-4">
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No upcoming payments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div 
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-sage-lightGray transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-400"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-lightGray flex items-center justify-center">
                    <Calendar size={16} className="text-sage-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{payment.description}</p>
                    <p className="text-xs text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <div className="flex items-center mt-1 justify-end">
                    <Clock size={12} className={cn(
                      payment.status === 'overdue' ? "text-red-500" : "text-amber-500"
                    )} />
                    <span className={cn(
                      "text-xs ml-1",
                      payment.status === 'overdue' ? "text-red-500" : "text-amber-500"
                    )}>
                      {payment.status === 'overdue' 
                        ? `${Math.abs(payment.daysRemaining)} days overdue` 
                        : `${payment.daysRemaining} days left`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingPayments;
