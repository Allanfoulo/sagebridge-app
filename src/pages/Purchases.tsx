import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Package, FileText, Building, Download, Upload } from 'lucide-react';

const Purchases: React.FC = () => {
  // Sample bills data
  const bills = [
    { id: 'BILL-001', vendor: 'Office Supplies Ltd', date: '2023-05-28', amount: 'R450.00', status: 'Paid' },
    { id: 'BILL-002', vendor: 'Server Hosting Inc', date: '2023-05-25', amount: 'R1,200.00', status: 'Pending' },
    { id: 'BILL-003', vendor: 'Marketing Agency Co', date: '2023-06-10', amount: 'R2,780.00', status: 'Upcoming' },
    { id: 'BILL-004', vendor: 'Utility Services', date: '2023-05-18', amount: 'R340.00', status: 'Paid' },
    { id: 'BILL-005', vendor: 'Travel Expenses', date: '2023-05-15', amount: 'R900.00', status: 'Pending' }
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
            <h1 className="text-2xl font-bold tracking-tight">Purchases</h1>
            <p className="text-muted-foreground">Manage your bills, expenses, and vendors</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
              <Upload size={16} className="mr-2" />
              Import
            </button>
            <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
              <PlusCircle size={16} className="mr-2" />
              New Purchase
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Purchases Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                <FileText size={16} className="mr-2" />
                New Bill
              </button>
              <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                <Package size={16} className="mr-2" />
                Purchase Order
              </button>
              <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                <Building size={16} className="mr-2" />
                Vendor Management
              </button>
              
              <div className="pt-4 border-t border-sage-lightGray">
                <h4 className="font-medium text-sm mb-3">Expense Categories</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Office Supplies</span>
                    <span className="text-muted-foreground">R2,450</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Software & IT</span>
                    <span className="text-muted-foreground">R3,870</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Marketing</span>
                    <span className="text-muted-foreground">R5,340</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Travel</span>
                    <span className="text-muted-foreground">R1,230</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Utilities</span>
                    <span className="text-muted-foreground">R890</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-9">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Bills & Expenses</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="search"
                      placeholder="Search bills..."
                      className="w-48 py-1.5 pl-8 pr-3 text-sm rounded-md border border-sage-lightGray focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        className="w-4 h-4 text-gray-400"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full mt-4">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Bill No.</th>
                      <th className="pb-3 font-medium">Vendor</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-lightGray/70">
                    {bills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-sage-lightGray/50 transition-colors">
                        <td className="py-3 text-sm font-medium">{bill.id}</td>
                        <td className="py-3 text-sm">{bill.vendor}</td>
                        <td className="py-3 text-sm">{bill.date}</td>
                        <td className="py-3 text-sm font-medium">{bill.amount}</td>
                        <td className="py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {bill.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm">
                          <div className="flex gap-2">
                            <button className="text-primary-500 hover:text-primary-600">View</button>
                            <button className="text-primary-500 hover:text-primary-600">Pay</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Recent Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border border-sage-lightGray rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Office Supplies</h4>
                        <p className="text-sm text-muted-foreground mt-1">May 28, 2023</p>
                      </div>
                      <span className="font-medium">R125.00</span>
                    </div>
                    <p className="text-sm mt-3">New printer cartridges and paper</p>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <span className="bg-sage-lightGray px-2 py-0.5 rounded">Admin</span>
                      <span className="ml-2">Patel Office Supplies</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-sage-lightGray rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Software Subscription</h4>
                        <p className="text-sm text-muted-foreground mt-1">May 25, 2023</p>
                      </div>
                      <span className="font-medium">R49.99</span>
                    </div>
                    <p className="text-sm mt-3">Monthly design software subscription</p>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <span className="bg-sage-lightGray px-2 py-0.5 rounded">Software</span>
                      <span className="ml-2">Adobe Inc</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-sage-lightGray rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Business Lunch</h4>
                        <p className="text-sm text-muted-foreground mt-1">May 22, 2023</p>
                      </div>
                      <span className="font-medium">R78.50</span>
                    </div>
                    <p className="text-sm mt-3">Client meeting lunch expense</p>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <span className="bg-sage-lightGray px-2 py-0.5 rounded">Meals</span>
                      <span className="ml-2">Downtown Grill</span>
                    </div>
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

export default Purchases;
