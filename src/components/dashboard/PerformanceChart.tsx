
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChartData {
  name: string;
  income: number;
  expenses: number;
}

const PerformanceChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);

      // Get the last 12 months from present to past
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          year: date.getFullYear(),
          month: date.getMonth() + 1
        });
      }

      // Fetch income data grouped by month
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('date, amount');

      if (incomeError) throw incomeError;

      // Fetch expenses data grouped by month
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('date, amount');

      if (expensesError) throw expensesError;

      // Process data by month
      const chartData: ChartData[] = months.map(month => {
        // Calculate income for this month
        const monthIncome = incomeData?.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() + 1 === month.month && recordDate.getFullYear() === month.year;
        }).reduce((sum, record) => sum + Number(record.amount), 0) || 0;

        // Calculate expenses for this month
        const monthExpenses = expensesData?.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() + 1 === month.month && recordDate.getFullYear() === month.year;
        }).reduce((sum, record) => sum + Number(record.amount), 0) || 0;

        return {
          name: month.name,
          income: monthIncome,
          expenses: monthExpenses
        };
      });

      setData(chartData);

    } catch (error: any) {
      console.error('Error fetching performance data:', error);
      toast({
        title: "Error",
        description: "Failed to load performance data.",
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
          <CardTitle className="text-lg">Financial Performance</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Loading performance data...</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Financial Performance</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Income vs Expenses trends</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f2" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
              <YAxis 
                tickFormatter={(value) => `R${value.toLocaleString()}`} 
                tick={{ fontSize: 12 }} 
                stroke="#888"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`R${Number(value).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, undefined]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                iconSize={8}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1" 
                stroke="#0077c8" 
                fill="#0077c8" 
                fillOpacity={0.2}
                strokeWidth={2}
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="1" 
                stroke="#ff6b6b" 
                fill="#ff6b6b" 
                fillOpacity={0.1}
                strokeWidth={2}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
