
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FilePlus, Users, ListFilter, Download, Upload } from 'lucide-react';

const Sales: React.FC = () => {
  // Sample invoices data
  const invoices = [
    { id: 'INV-001', customer: 'Acme Corp', date: '2023-05-28', amount: 'R3,450.00', status: 'Paid' },
    { id: 'INV-002', customer: 'Globex Inc', date: '2023-05-25', amount: 'R1,200.00', status: 'Pending' },
    { id: 'INV-003', customer: 'Stark Industries', date: '2023-05-20', amount: 'R4,780.00', status: 'Paid' },
    { id: 'INV-004', customer: 'Wayne Enterprises', date: '2023-05-18', amount: 'R2,340.00', status: 'Overdue' },
    { id: 'INV-005', customer: 'Umbrella Corp', date: '2023-05-15', amount: 'R900.00', status: 'Paid' }
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
            <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
            <p className="text-muted-foreground">Manage your invoices, quotes, and customers</p>
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
              New Invoice
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Sales Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                <FilePlus size={16} className="mr-2" />
                New Invoice
              </button>
              <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                <FilePlus size={16} className="mr-2" />
                New Quote
              </button>
              <button className="bg-white border border-sage-lightGray hover:bg-sage-lightGray text-sage-darkGray w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                <Users size={16} className="mr-2" />
                Customer Database
              </button>
              
              <div className="pt-4 border-t border-sage-lightGray">
                <h4 className="font-medium text-sm mb-3">Quick Filters</h4>
                <div className="space-y-2">
                  <button className="bg-sage-lightGray hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
                    All Invoices
                  </button>
                  <button className="hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
                    Paid
                  </button>
                  <button className="hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
                    Unpaid
                  </button>
                  <button className="hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
                    Overdue
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Invoices</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="search"
                      placeholder="Search invoices..."
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
                  <button className="flex items-center gap-1 p-1.5 rounded-md hover:bg-sage-lightGray transition-colors">
                    <ListFilter size={16} /> <span className="text-sm">Filter</span>
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full mt-4">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Invoice No.</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-lightGray/70">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-sage-lightGray/50 transition-colors">
                        <td className="py-3 text-sm font-medium">{invoice.id}</td>
                        <td className="py-3 text-sm">{invoice.customer}</td>
                        <td className="py-3 text-sm">{invoice.date}</td>
                        <td className="py-3 text-sm font-medium">{invoice.amount}</td>
                        <td className="py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm">
                          <div className="flex gap-2">
                            <button className="text-primary-500 hover:text-primary-600">View</button>
                            <button className="text-primary-500 hover:text-primary-600">Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing 5 of 25 invoices
                </div>
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
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Sales;
