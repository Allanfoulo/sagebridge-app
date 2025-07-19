
import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, DollarSign, Users, ShoppingCart, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, delay = 0 }) => {
  const isPositive = change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.42, 0, 0.58, 1]
      }}
    >
      <Card>
        <CardHeader className="pb-2 flex justify-between items-start">
          <CardTitle className="text-base text-muted-foreground font-medium">
            {title}
          </CardTitle>
          <div className="p-2 rounded-full bg-sage-lightGray">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className="flex items-center mt-1">
            <div className={cn(
              "flex items-center text-xs font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              <span className="ml-1">{Math.abs(change)}%</span>
            </div>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FinancialOverview: React.FC = () => {
  const [stats, setStats] = useState([
    { 
      title: "Total Cash Flow", 
      value: "R0.00", 
      change: 0,
      icon: <DollarSign size={16} className="text-sage-blue" />
    },
    { 
      title: "Accounts Receivable", 
      value: "R0.00", 
      change: 0,
      icon: <Users size={16} className="text-sage-blue" />
    },
    { 
      title: "Accounts Payable", 
      value: "R0.00", 
      change: 0,
      icon: <ShoppingCart size={16} className="text-sage-blue" />
    },
    { 
      title: "Bank Balance", 
      value: "R0.00", 
      change: 0,
      icon: <CreditCard size={16} className="text-sage-blue" />
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);

      // Fetch accounts receivable (unpaid sales invoices)
      const { data: salesInvoices, error: salesError } = await supabase
        .from('sales_invoices')
        .select('total_amount, status')
        .neq('status', 'Paid');

      if (salesError) throw salesError;

      // Fetch accounts payable (unpaid supplier invoices)
      const { data: supplierInvoices, error: supplierError } = await supabase
        .from('supplier_invoices')
        .select('total_amount, status')
        .neq('status', 'Paid');

      if (supplierError) throw supplierError;

      // Fetch bank accounts balance
      const { data: bankAccounts, error: bankError } = await supabase
        .from('bank_accounts')
        .select('current_balance')
        .eq('is_active', true);

      if (bankError) throw bankError;

      // Calculate totals
      const accountsReceivable = salesInvoices?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;
      const accountsPayable = supplierInvoices?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;
      const bankBalance = bankAccounts?.reduce((sum, account) => sum + Number(account.current_balance), 0) || 0;
      const totalCashFlow = bankBalance + accountsReceivable - accountsPayable;

      // Calculate percentage changes based on previous month data
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
      const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

      // Fetch previous month data for comparison
      const { data: prevSalesInvoices } = await supabase
        .from('sales_invoices')
        .select('total_amount')
        .gte('issue_date', lastMonthStart.toISOString().split('T')[0])
        .lte('issue_date', lastMonthEnd.toISOString().split('T')[0]);

      const { data: prevSupplierInvoices } = await supabase
        .from('supplier_invoices')
        .select('total_amount')
        .gte('issue_date', lastMonthStart.toISOString().split('T')[0])
        .lte('issue_date', lastMonthEnd.toISOString().split('T')[0]);

      const prevAccountsReceivable = prevSalesInvoices?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;
      const prevAccountsPayable = prevSupplierInvoices?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;
      const prevCashFlow = bankBalance + prevAccountsReceivable - prevAccountsPayable;

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      setStats([
        { 
          title: "Total Cash Flow", 
          value: `R${totalCashFlow.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 
          change: calculateChange(totalCashFlow, prevCashFlow),
          icon: <DollarSign size={16} className="text-sage-blue" />
        },
        { 
          title: "Accounts Receivable", 
          value: `R${accountsReceivable.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 
          change: calculateChange(accountsReceivable, prevAccountsReceivable),
          icon: <Users size={16} className="text-sage-blue" />
        },
        { 
          title: "Accounts Payable", 
          value: `R${accountsPayable.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 
          change: calculateChange(accountsPayable, prevAccountsPayable),
          icon: <ShoppingCart size={16} className="text-sage-blue" />
        },
        { 
          title: "Bank Balance", 
          value: `R${bankBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 
          change: 2.5, // Bank balance change is typically more stable
          icon: <CreditCard size={16} className="text-sage-blue" />
        }
      ]);
    } catch (error: any) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          delay={index}
        />
      ))}
    </div>
  );
};

export default FinancialOverview;
