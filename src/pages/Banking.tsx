import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PlusCircle, Link2, CreditCard, ArrowDownUp, Filter, Download } from 'lucide-react';

const Banking: React.FC = () => {
  // Sample data for the bank accounts
  const accounts = [
    { id: 1, name: 'Business Checking', bank: 'Chase Bank', balance: 'R24,567.89', accountNumber: '•••• 5678', type: 'checking' },
    { id: 2, name: 'Business Savings', bank: 'Chase Bank', balance: 'R42,123.45', accountNumber: '•••• 9012', type: 'savings' },
    { id: 3, name: 'Payroll Account', bank: 'Bank of America', balance: 'R18,765.23', accountNumber: '•••• 3456', type: 'checking' }
  ];
  
  // Sample data for transactions
  const transactions = [
    { id: 1, date: '2023-06-01', description: 'Client Payment - ABC Corp', category: 'Income', amount: '+R5,000.00', account: 'Business Checking' },
    { id: 2, date: '2023-05-30', description: 'Office Rent', category: 'Rent', amount: '-R2,500.00', account: 'Business Checking' },
    { id: 3, date: '2023-05-28', description: 'Software Subscription', category: 'Software', amount: '-R99.99', account: 'Business Checking' },
    { id: 4, date: '2023-05-25', description: 'Client Payment - XYZ Inc', category: 'Income', amount: '+R3,450.00', account: 'Business Checking' },
    { id: 5, date: '2023-05-20', description: 'Transfer to Savings', category: 'Transfer', amount: '-R1,000.00', account: 'Business Checking' },
    { id: 6, date: '2023-05-20', description: 'Transfer from Checking', category: 'Transfer', amount: '+R1,000.00', account: 'Business Savings' }
  ];
  
  // Sample data for the chart
  const balanceData = [
    { date: 'Jan', checking: 15000, savings: 30000 },
    { date: 'Feb', checking: 18000, savings: 32000 },
    { date: 'Mar', checking: 16500, savings: 34000 },
    { date: 'Apr', checking: 21000, savings: 36000 },
    { date: 'May', checking: 24500, savings: 42000 },
    { date: 'Jun', checking: 28000, savings: 45000 }
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
            <h1 className="text-2xl font-bold tracking-tight">Banking</h1>
            <p className="text-muted-foreground">Manage your accounts, transactions, and reconciliation</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
              <Link2 size={16} className="mr-2" />
              Connect Bank
            </button>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
              <PlusCircle size={16} className="mr-2" />
              Add Transaction
            </button>
          </div>
        </div>
        
        {/* Bank Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{account.name}</CardTitle>
                <CardDescription>{account.bank} • {account.accountNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-3">{account.balance}</div>
                <div className="flex justify-between gap-2">
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-1">
                    Reconcile
                  </button>
                  <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-1">
                    View Statements
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Balance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Balances</CardTitle>
            <CardDescription>6-month history of your account balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={balanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f2" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `R${value / 1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`R${value.toLocaleString()}`, undefined]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="checking" 
                    name="Business Checking" 
                    stroke="#0077c8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    name="Business Savings" 
                    stroke="#34c759" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Recent banking activity across all accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray px-3 py-1.5 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
                <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray px-3 py-1.5 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-sage-lightGray">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Account</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-sage-lightGray/50 hover:bg-sage-lightGray/20 transition-colors">
                      <td className="py-3 text-sm">{transaction.date}</td>
                      <td className="py-3 text-sm">{transaction.description}</td>
                      <td className="py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sage-lightGray text-sage-darkGray">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-3 text-sm">{transaction.account}</td>
                      <td className={`py-3 text-sm font-medium text-right ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount}
                      </td>
                      <td className="py-3 text-sm text-right">
                        <button className="text-primary-500 hover:text-primary-600 mr-2">
                          Edit
                        </button>
                        <button className="text-primary-500 hover:text-primary-600">
                          Match
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Showing 6 of 230 transactions</p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-500 text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reconciliation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank Reconciliation</CardTitle>
              <CardDescription>Match your records with bank statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <select className="w-full bg-sage-lightGray border-0 rounded-md text-sm p-2 focus:ring-1 focus:ring-primary-500 mb-3">
                  <option>Business Checking - May 2023</option>
                  <option>Business Checking - April 2023</option>
                  <option>Business Savings - May 2023</option>
                </select>
                
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Statement Balance:</span>
                  <span className="font-medium">R24,567.89</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Book Balance:</span>
                  <span className="font-medium">R24,378.45</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-sage-lightGray">
                  <span className="font-medium">Difference:</span>
                  <span className="font-medium text-amber-600">R189.44</span>
                </div>
              </div>
              
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full">
                Start Reconciliation
              </button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Unmatched Transactions</CardTitle>
              <CardDescription>3 transactions need to be categorized</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-sage-lightGray/50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-sm">Amazon Business</p>
                      <p className="text-xs text-muted-foreground">May 28, 2023</p>
                    </div>
                    <p className="font-medium text-red-600">-R127.84</p>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button className="text-primary-500 hover:text-primary-600 text-sm mr-2">Categorize</button>
                    <button className="text-primary-500 hover:text-primary-600 text-sm">Match</button>
                  </div>
                </div>
                
                <div className="bg-sage-lightGray/50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-sm">Transfer Deposit</p>
                      <p className="text-xs text-muted-foreground">May 25, 2023</p>
                    </div>
                    <p className="font-medium text-green-600">+R2,500.00</p>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button className="text-primary-500 hover:text-primary-600 text-sm mr-2">Categorize</button>
                    <button className="text-primary-500 hover:text-primary-600 text-sm">Match</button>
                  </div>
                </div>
                
                <div className="bg-sage-lightGray/50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-sm">Staples Office Supply</p>
                      <p className="text-xs text-muted-foreground">May 22, 2023</p>
                    </div>
                    <p className="font-medium text-red-600">-R89.57</p>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button className="text-primary-500 hover:text-primary-600 text-sm mr-2">Categorize</button>
                    <button className="text-primary-500 hover:text-primary-600 text-sm">Match</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Banking;
