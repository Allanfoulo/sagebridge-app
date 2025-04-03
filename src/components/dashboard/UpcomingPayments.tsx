
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface Payment {
  id: string;
  dueDate: string;
  description: string;
  amount: string;
  status: 'upcoming' | 'overdue';
  daysRemaining: number;
}

const UpcomingPayments: React.FC = () => {
  const payments: Payment[] = [
    {
      id: 'pay-1',
      dueDate: '2023-06-10',
      description: 'Office Rent Payment',
      amount: 'R3,500.00',
      status: 'upcoming',
      daysRemaining: 5
    },
    {
      id: 'pay-2',
      dueDate: '2023-06-15',
      description: 'Software Subscription',
      amount: 'R120.00',
      status: 'upcoming',
      daysRemaining: 10
    },
    {
      id: 'pay-3',
      dueDate: '2023-06-01',
      description: 'Utility Bills',
      amount: 'R350.00',
      status: 'overdue',
      daysRemaining: -4
    },
    {
      id: 'pay-4',
      dueDate: '2023-06-20',
      description: 'Marketing Agency',
      amount: 'R1,200.00',
      status: 'upcoming',
      daysRemaining: 15
    }
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Upcoming Payments</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Bills and invoices due soon</p>
      </CardHeader>
      <CardContent className="py-4">
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
      </CardContent>
    </Card>
  );
};

export default UpcomingPayments;
