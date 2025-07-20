import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Calendar, ChevronDown, FileText, BarChart2, PieChart as PieChartIcon, Activity, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const Reports: React.FC = () => {
  const { currencySymbol } = useCurrency();
  const [activeReport, setActiveReport] = useState('profit-loss');
  
  // Sample data for profit & loss chart
  const profitLossData = [
    { month: 'Jan', income: 12000, expenses: 8500, profit: 3500 },
    { month: 'Feb', income: 15000, expenses: 10200, profit: 4800 },
    { month: 'Mar', income: 18000, expenses: 12000, profit: 6000 },
    { month: 'Apr', income: 16000, expenses: 9800, profit: 6200 },
    { month: 'May', income: 21000, expenses: 13500, profit: 7500 },
    { month: 'Jun', income: 24000, expenses: 15000, profit: 9000 },
  ];
  
  // Sample data for accounts receivable aging
  const receivableData = [
    { name: 'Current', value: 15000 },
    { name: '1-30 Days', value: 8000 },
    { name: '31-60 Days', value: 4500 },
    { name: '61-90 Days', value: 2000 },
    { name: '>90 Days', value: 1500 },
  ];
  
  // Sample data for expense categories
  const expenseData = [
    { name: 'Salaries', value: 45000 },
    { name: 'Rent', value: 12000 },
    { name: 'Marketing', value: 9500 },
    { name: 'Software', value: 6500 },
    { name: 'Office Supplies', value: 3500 },
    { name: 'Travel', value: 2500 },
    { name: 'Other', value: 5000 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#A4DE6C'];
  
  // Available reports
  const reports = [
    { id: 'profit-loss', name: 'Profit & Loss', icon: <BarChart2 size={16} /> },
    { id: 'balance-sheet', name: 'Balance Sheet', icon: <FileText size={16} /> },
    { id: 'receivables', name: 'Accounts Receivable', icon: <PieChartIcon size={16} /> },
    { id: 'payables', name: 'Accounts Payable', icon: <PieChartIcon size={16} /> },
    { id: 'cash-flow', name: 'Cash Flow', icon: <Activity size={16} /> },
    { id: 'expenses', name: 'Expense Report', icon: <BarChart2 size={16} /> },
    { id: 'tax', name: 'Tax Summary', icon: <FileText size={16} /> },
  ];

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Financial and business reports</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-sage-lightGray rounded-md text-sm font-medium text-sage-darkGray hover:bg-sage-lightGray transition-colors">
              <Calendar size={16} className="mr-2" />
              <span>This Quarter</span>
              <ChevronDown size={14} className="ml-2" />
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
              <Download size={16} className="mr-2" />
              Export PDF
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Report Types</CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-1">
                <nav>
                  <ul className="space-y-1">
                    {reports.map((report) => (
                      <li key={report.id}>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                            activeReport === report.id
                              ? 'bg-primary-500 text-white'
                              : 'hover:bg-sage-lightGray text-sage-darkGray'
                          }`}
                          onClick={() => setActiveReport(report.id)}
                        >
                          <span className="mr-2">{report.icon}</span>
                          {report.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Profit & Loss Statement</CardTitle>
                  <p className="text-sm text-muted-foreground">January 1 - June 30, 2023</p>
                </div>
                <button className="text-primary-500 hover:text-primary-600 text-sm font-medium inline-flex items-center">
                  View Full Report <ArrowRight size={14} className="ml-1" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={profitLossData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f2" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${currencySymbol}${value / 1000}k`} />
                      <Tooltip 
                        formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, undefined]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#0077c8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" name="Net Profit" fill="#4caf50" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">Accounts Receivable Aging</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={receivableData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {receivableData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, undefined]}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-4">Expense Breakdown</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {expenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, undefined]}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Year-to-Date Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{currencySymbol}106,000.00</p>
                  <p className="text-xs text-green-600">↑ 18.5% from last year</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">{currencySymbol}69,000.00</p>
                  <p className="text-xs text-amber-600">↑ 12.3% from last year</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">{currencySymbol}37,000.00</p>
                  <p className="text-xs text-green-600">↑ 22.7% from last year</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sales Tax Collected</p>
                  <p className="text-2xl font-bold">{currencySymbol}8,475.00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Income Tax</p>
                  <p className="text-2xl font-bold">{currencySymbol}9,250.00</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">Next Quarterly Payment Due</p>
                  <p className="text-sm font-medium">July 15, 2023</p>
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white w-full py-2 rounded-md text-sm font-medium transition-colors">
                  Prepare Tax Forms
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <FileText size={16} className="text-primary-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Q2 Financial Statement</p>
                    <p className="text-xs text-muted-foreground">Generated on Jun 1, 2023</p>
                  </div>
                  <Download size={16} className="text-muted-foreground" />
                </div>
                
                <div className="flex items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <FileText size={16} className="text-primary-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sales by Customer</p>
                    <p className="text-xs text-muted-foreground">Generated on May 28, 2023</p>
                  </div>
                  <Download size={16} className="text-muted-foreground" />
                </div>
                
                <div className="flex items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <FileText size={16} className="text-primary-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Expense Analysis</p>
                    <p className="text-xs text-muted-foreground">Generated on May 25, 2023</p>
                  </div>
                  <Download size={16} className="text-muted-foreground" />
                </div>
                
                <div className="flex items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <FileText size={16} className="text-primary-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cash Flow Statement</p>
                    <p className="text-xs text-muted-foreground">Generated on May 20, 2023</p>
                  </div>
                  <Download size={16} className="text-muted-foreground" />
                </div>
              </div>
              
              <button className="mt-4 w-full bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center">
                View All Reports
              </button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Reports;

