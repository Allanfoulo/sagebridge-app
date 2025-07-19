
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, Users, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalesStats {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
}

const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [stats, setStats] = useState<SalesStats>({
    totalInvoices: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSalesStats();
  }, []);
  
  const navigateToNewInvoice = () => {
    navigate('/sales/new-invoice');
  };

  const navigateToNewQuote = () => {
    navigate('/sales/new-quote');
  };

  const navigateToCustomers = () => {
    navigate('/customers');
  };

  const fetchSalesStats = async () => {
    try {
      setIsLoading(true);

      // Fetch all sales invoices
      const { data: invoices, error } = await supabase
        .from('sales_invoices')
        .select('id, status, total_amount, due_date');

      if (error) throw error;

      if (invoices) {
        const today = new Date();
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
        const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');
        const overdueInvoices = invoices.filter(inv => 
          inv.status !== 'Paid' && new Date(inv.due_date) < today
        );

        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
        const pendingRevenue = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);

        setStats({
          totalInvoices: invoices.length,
          paidInvoices: paidInvoices.length,
          unpaidInvoices: unpaidInvoices.length,
          overdueInvoices: overdueInvoices.length,
          totalRevenue,
          pendingRevenue
        });
      }
    } catch (error: any) {
      console.error('Error fetching sales stats:', error);
      toast({
        title: "Error",
        description: "Failed to load sales statistics.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Sales Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={navigateToNewInvoice} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          <FilePlus size={16} className="mr-2" />
          New Invoice
        </Button>
        <Button 
          onClick={navigateToNewQuote}
          variant="outline" 
          className="w-full"
        >
          <FilePlus size={16} className="mr-2" />
          New Quote
        </Button>
        <Button 
          onClick={navigateToCustomers}
          variant="outline" 
          className="w-full"
        >
          <Users size={16} className="mr-2" />
          Customer Database
        </Button>
        
        {/* Sales Statistics */}
        <div className="pt-4 border-t border-sage-lightGray">
          <h4 className="font-medium text-sm mb-3">Sales Overview</h4>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <DollarSign size={14} className="mr-1" />
                  Total Revenue
                </span>
                <span className="font-medium text-green-600">
                  R{stats.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <Clock size={14} className="mr-1" />
                  Pending Revenue
                </span>
                <span className="font-medium text-orange-600">
                  R{stats.pendingRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {stats.overdueInvoices > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <AlertTriangle size={14} className="mr-1" />
                    Overdue Invoices
                  </span>
                  <span className="font-medium text-red-600">
                    {stats.overdueInvoices}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-sage-lightGray">
          <h4 className="font-medium text-sm mb-3">Quick Filters</h4>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/sales')}
              className={`${isActive('/sales') ? 'bg-sage-lightGray' : ''} hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left flex items-center justify-between`}
            >
              <span>All Invoices</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{stats.totalInvoices}</span>
            </button>
            <button 
              onClick={() => navigate('/sales/paid-invoices')}
              className={`${isActive('/sales/paid-invoices') ? 'bg-sage-lightGray' : ''} hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left flex items-center justify-between`}
            >
              <span>Paid</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{stats.paidInvoices}</span>
            </button>
            <button 
              onClick={() => navigate('/sales/unpaid-invoices')}
              className={`${isActive('/sales/unpaid-invoices') ? 'bg-sage-lightGray' : ''} hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left flex items-center justify-between`}
            >
              <span>Unpaid</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{stats.unpaidInvoices}</span>
            </button>
            <button 
              onClick={() => navigate('/sales/overdue-invoices')}
              className={`${isActive('/sales/overdue-invoices') ? 'bg-sage-lightGray' : ''} hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left flex items-center justify-between`}
            >
              <span>Overdue</span>
              <span className={`text-xs px-2 py-1 rounded ${stats.overdueInvoices > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{stats.overdueInvoices}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesDashboard;
