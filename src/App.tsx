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
