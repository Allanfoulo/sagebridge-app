
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownUp, ChevronRight } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: string;
  type: 'income' | 'expense';
}

const RecentTransactions: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      date: '2023-06-01',
      description: 'Airbnb Design Services',
      category: 'Income',
      amount: '+R2,400.00',
      type: 'income'
    },
    {
      id: 'tx-2',
      date: '2023-05-30',
      description: 'Office Supplies',
      category: 'Expense',
      amount: '-R350.00',
      type: 'expense'
    },
    {
      id: 'tx-3',
      date: '2023-05-28',
      description: 'Server Hosting',
      category: 'Expense',
      amount: '-R120.00',
      type: 'expense'
    },
    {
      id: 'tx-4',
      date: '2023-05-25',
      description: 'Google Marketing Services',
      category: 'Income',
      amount: '+R1,800.00',
      type: 'income'
    },
    {
      id: 'tx-5',
      date: '2023-05-23',
      description: 'Business Travel',
      category: 'Expense',
      amount: '-R750.00',
      type: 'expense'
    }
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-0 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Latest financial activities</p>
        </div>
        <button className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors inline-flex items-center">
          View All <ChevronRight size={14} className="ml-1" />
        </button>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-sage-lightGray transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  transaction.type === 'income' ? "bg-green-100" : "bg-red-100"
                )}>
                  <ArrowDownUp 
                    size={16} 
                    className={transaction.type === 'income' ? "text-green-600" : "text-red-600"} 
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                </div>
              </div>
              <div className={cn(
                "font-medium",
                transaction.type === 'income' ? "text-green-600" : "text-red-600"
              )}>
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
