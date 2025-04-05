
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Suspense, useState, useEffect, Component, ReactNode } from "react";
import React from "react";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Banking from "./pages/Banking";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import NotFound from "./pages/NotFound";
import Administration from './pages/Administration';
import ManageUsers from './pages/administration/ManageUsers';
import AddUser from './pages/administration/AddUser';
import UserAccess from './pages/administration/UserAccess';
import ChangePassword from './pages/administration/ChangePassword';
import MyAccount from './pages/administration/MyAccount';
import AddCustomer from './pages/AddCustomer';

// Accounting pages
import Accounting from './pages/Accounting';
import ChartOfAccounts from './pages/accounting/ChartOfAccounts';
import Journals from './pages/accounting/Journals';
import CreateJournal from './pages/accounting/CreateJournal';
import GeneralLedger from './pages/accounting/GeneralLedger';
import TrialBalance from './pages/accounting/TrialBalance';
import AddAccount from './pages/accounting/AddAccount';
import Reconciliation from './pages/accounting/Reconciliation';
import AdjustOpeningBalance from './pages/accounting/AdjustOpeningBalance';
import TaxReports from './pages/accounting/TaxReports';
import PeriodEnd from './pages/accounting/PeriodEnd';

// Supplier pages
import AllSuppliers from './pages/suppliers/AllSuppliers';
import ActiveSuppliers from './pages/suppliers/ActiveSuppliers';
import InactiveSuppliers from './pages/suppliers/InactiveSuppliers';
import SuppliersByCategory from './pages/suppliers/SuppliersByCategory';

// Supplier Report pages
import SupplierBalances from './pages/suppliers/reports/SupplierBalances';

// Supplier Transaction pages
import PurchaseOrders from './pages/suppliers/transactions/PurchaseOrders';
import Invoices from './pages/suppliers/transactions/Invoices';
import Payments from './pages/suppliers/transactions/Payments';
import CreditNotes from './pages/suppliers/transactions/CreditNotes';
import StatementReconciliation from './pages/suppliers/transactions/StatementReconciliation';

// Create a fallback component for loading states
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <p className="ml-3 text-lg">Loading application...</p>
  </div>
);

// Error boundary component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We're sorry, but there was an error loading the application.</p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-w-full mb-4">
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a more robust query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/auth" element={<Auth />} />
                      
                      {/* Protected routes */}
                      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
                      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
                      <Route path="/banking" element={<ProtectedRoute><Banking /></ProtectedRoute>} />
                      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                      <Route path="/customers/add" element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />
                      <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                      <Route path="/suppliers/add" element={<ProtectedRoute><AddSupplier /></ProtectedRoute>} />
                      <Route path="/suppliers/all" element={<ProtectedRoute><AllSuppliers /></ProtectedRoute>} />
                      <Route path="/suppliers/active" element={<ProtectedRoute><ActiveSuppliers /></ProtectedRoute>} />
                      <Route path="/suppliers/inactive" element={<ProtectedRoute><InactiveSuppliers /></ProtectedRoute>} />
                      <Route path="/suppliers/by-category" element={<ProtectedRoute><SuppliersByCategory /></ProtectedRoute>} />
                      
                      {/* Supplier Transaction Routes */}
                      <Route path="/suppliers/transactions/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
                      <Route path="/suppliers/transactions/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
                      <Route path="/suppliers/transactions/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
                      <Route path="/suppliers/transactions/credit-notes" element={<ProtectedRoute><CreditNotes /></ProtectedRoute>} />
                      <Route path="/suppliers/transactions/statement-reconciliation" element={<ProtectedRoute><StatementReconciliation /></ProtectedRoute>} />
                      
                      {/* Supplier Reports Routes */}
                      <Route path="/suppliers/reports/balances" element={<ProtectedRoute><SupplierBalances /></ProtectedRoute>} />
                      
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/administration" element={<ProtectedRoute><Administration /></ProtectedRoute>} />
                      <Route path="/administration/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
                      <Route path="/administration/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                      <Route path="/administration/access" element={<ProtectedRoute><UserAccess /></ProtectedRoute>} />
                      <Route path="/administration/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                      <Route path="/administration/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                      
                      {/* Accounting Routes */}
                      <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
                      <Route path="/accounting/chart-of-accounts" element={<ProtectedRoute><ChartOfAccounts /></ProtectedRoute>} />
                      <Route path="/accounting/journals" element={<ProtectedRoute><Journals /></ProtectedRoute>} />
                      <Route path="/accounting/journals/new" element={<ProtectedRoute><CreateJournal /></ProtectedRoute>} />
                      <Route path="/accounting/general-ledger" element={<ProtectedRoute><GeneralLedger /></ProtectedRoute>} />
                      <Route path="/accounting/trial-balance" element={<ProtectedRoute><TrialBalance /></ProtectedRoute>} />
                      <Route path="/accounting/add-account" element={<ProtectedRoute><AddAccount /></ProtectedRoute>} />
                      <Route path="/accounting/reconciliation" element={<ProtectedRoute><Reconciliation /></ProtectedRoute>} />
                      <Route path="/accounting/adjust-opening-balance" element={<ProtectedRoute><AdjustOpeningBalance /></ProtectedRoute>} />
                      <Route path="/accounting/tax-reports" element={<ProtectedRoute><TaxReports /></ProtectedRoute>} />
                      <Route path="/accounting/period-end" element={<ProtectedRoute><PeriodEnd /></ProtectedRoute>} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
