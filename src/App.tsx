
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";

// Page imports
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/banking" element={<Banking />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/add" element={<AddSupplier />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/administration" element={<Administration />} />
              <Route path="/administration/users" element={<ManageUsers />} />
              <Route path="/administration/users/add" element={<AddUser />} />
              <Route path="/administration/access" element={<UserAccess />} />
              <Route path="/administration/change-password" element={<ChangePassword />} />
              <Route path="/administration/my-account" element={<MyAccount />} />
              
              {/* Accounting Routes */}
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/accounting/chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="/accounting/journals" element={<Journals />} />
              <Route path="/accounting/journals/new" element={<CreateJournal />} />
              <Route path="/accounting/general-ledger" element={<GeneralLedger />} />
              <Route path="/accounting/trial-balance" element={<TrialBalance />} />
              <Route path="/accounting/add-account" element={<AddAccount />} />
              <Route path="/accounting/reconciliation" element={<Reconciliation />} />
              <Route path="/accounting/adjust-opening-balance" element={<AdjustOpeningBalance />} />
              <Route path="/accounting/tax-reports" element={<TaxReports />} />
              <Route path="/accounting/period-end" element={<PeriodEnd />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
