
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Supplier {
  id: string;
  name: string;
  currentBalance: number;
  overdue: number;
}

interface TopSupplierBalanceChartProps {
  suppliers: Supplier[];
}

const TopSupplierBalanceChart: React.FC<TopSupplierBalanceChartProps> = ({ suppliers }) => {
  const chartData = suppliers.map(supplier => ({
    name: supplier.name,
    balance: supplier.currentBalance,
    overdue: supplier.overdue,
    isOverdue: supplier.overdue > 0
  }));

  // Colors for the bars based on overdue status
  const getBarColor = (isOverdue: boolean) => isOverdue ? "#ef4444" : "#3b82f6";
  
  return (
    <ChartContainer 
      config={{
        balance: { label: 'Balance', theme: { light: '#3b82f6', dark: '#60a5fa' } },
        overdue: { label: 'Overdue', theme: { light: '#ef4444', dark: '#f87171' } }
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 15, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={150}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            content={(props) => {
              return (
                <ChartTooltipContent
                  {...props}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    name
                  ]}
                />
              );
            }}
          />
          <Bar dataKey="balance" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.isOverdue)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TopSupplierBalanceChart;
