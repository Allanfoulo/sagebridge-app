
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PayablesTrendData {
  month: string;
  amount: number;
}

interface PayablesTrendChartProps {
  data: PayablesTrendData[];
}

const PayablesTrendChart: React.FC<PayablesTrendChartProps> = ({ data }) => {
  return (
    <ChartContainer 
      config={{
        amount: { label: 'Total Payables', theme: { light: '#3b82f6', dark: '#60a5fa' } },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 15, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            content={(props) => {
              return (
                <ChartTooltipContent
                  {...props}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name
                  ]}
                />
              );
            }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PayablesTrendChart;
