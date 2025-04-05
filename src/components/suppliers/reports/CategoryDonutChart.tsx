
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryDonutChartProps {
  data: CategoryData[];
}

// Vibrant colors for the donut chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4'];

const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data }) => {
  const chartConfig = data.reduce((acc, { name }) => {
    acc[name] = { label: name };
    return acc;
  }, {} as Record<string, { label: string }>);

  const totalValue = data.reduce((sum, { value }) => sum + value, 0);

  return (
    <ChartContainer config={chartConfig}>
      <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
        <div className="col-span-3 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={(props) => {
                  return (
                    <ChartTooltipContent
                      {...props}
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${((Number(value) / totalValue) * 100).toFixed(1)}%)`,
                        name
                      ]}
                    />
                  );
                }}
              />
              <Legend 
                content={<ChartLegendContent verticalAlign="middle" />}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="col-span-2 flex flex-col justify-center p-4 space-y-4">
          <h3 className="text-lg font-semibold">Summary by Category</h3>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-gray-500">{((item.value / totalValue) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t mt-2">
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span className="font-mono">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default CategoryDonutChart;
