
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, ShoppingBag, PieChart, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Suppliers = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      {/* Header Section with gradient background */}
      <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Suppliers</h1>
            <p className="text-white/80">Manage your suppliers, transactions, and reports</p>
          </div>
          <Button 
            className="bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700 shadow-md"
            onClick={() => navigate('/suppliers/add')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* Lists Section */}
          <AccordionItem value="lists" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="text-lg font-medium px-4 py-3 hover:bg-sage-blue/5">
              <div className="flex items-center text-sage-blue">
                <FileText className="mr-2 h-5 w-5" />
                Lists
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <nav className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue"
                  onClick={() => navigate('/suppliers/all')}
                >
                  All Suppliers
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue"
                  onClick={() => navigate('/suppliers/active')}
                >
                  Active Suppliers
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue"
                  onClick={() => navigate('/suppliers/inactive')}
                >
                  Inactive Suppliers
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue"
                  onClick={() => navigate('/suppliers/by-category')}
                >
                  By Category
                </Button>
              </nav>
            </AccordionContent>
          </AccordionItem>

          {/* Transactions Section */}
          <AccordionItem value="transactions" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="text-lg font-medium px-4 py-3 hover:bg-sage-blue/5">
              <div className="flex items-center text-sage-blue">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Transactions
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Purchase Orders</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Invoices</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Payments</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Credit Notes</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Statement Reconciliation</Button>
              </nav>
            </AccordionContent>
          </AccordionItem>

          {/* Reports Section */}
          <AccordionItem value="reports" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="text-lg font-medium px-4 py-3 hover:bg-sage-blue/5">
              <div className="flex items-center text-sage-blue">
                <PieChart className="mr-2 h-5 w-5" />
                Reports
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Supplier Balances</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Aging Analysis</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Payment History</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Purchase Analysis</Button>
              </nav>
            </AccordionContent>
          </AccordionItem>

          {/* Special Section */}
          <AccordionItem value="special" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="text-lg font-medium px-4 py-3 hover:bg-sage-blue/5">
              <div className="flex items-center text-sage-blue">
                <Settings className="mr-2 h-5 w-5" />
                Special
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Merge Suppliers</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Import/Export</Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-sage-blue/10 hover:text-sage-blue">Bulk Update</Button>
              </nav>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
};

export default Suppliers;
