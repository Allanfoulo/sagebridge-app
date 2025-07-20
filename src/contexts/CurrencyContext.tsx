import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrencySymbol, availableCurrencies } from '@/utils/salesInvoiceService';

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
  availableCurrencies: typeof availableCurrencies;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>('ZAR');
  const [currencySymbol, setCurrencySymbol] = useState<string>('R');

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('app-currency');
    if (savedCurrency && availableCurrencies.some(c => c.value === savedCurrency)) {
      setCurrencyState(savedCurrency);
      setCurrencySymbol(getCurrencySymbol(savedCurrency));
    }
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    setCurrencySymbol(getCurrencySymbol(newCurrency));
    localStorage.setItem('app-currency', newCurrency);
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const value: CurrencyContextType = {
    currency,
    currencySymbol,
    setCurrency,
    formatCurrency,
    availableCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};