
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SaleForm from './components/SaleForm';
import History from './components/History';
import DebtTracker from './components/DebtTracker';
import Settings from './components/Settings';
import SplashScreen from './components/SplashScreen';
import { Sale, ViewType } from './types';
import { storageService } from './services/storageService';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType | 'settings'>('dashboard');
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = () => {
    const loaded = storageService.loadSales();
    setSales(loaded);
  };

  useEffect(() => {
    refreshData();
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveSale = (newSale: Sale) => {
    const updated = storageService.addSale(newSale);
    setSales(updated);
    setView('dashboard');
  };

  const handleMarkAsPaid = (saleId: string) => {
    const updated = sales.map(s => {
      if (s.id === saleId) {
        return { ...s, debtAmount: 0, paidAmount: s.totalAmount, debtDueDate: undefined };
      }
      return s;
    });
    setSales(updated);
    storageService.saveSales(updated);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard sales={sales} onViewDebts={() => setView('debts')} />;
      case 'add-sale':
        return <SaleForm onSave={handleSaveSale} onCancel={() => setView('dashboard')} />;
      case 'history':
        return <History sales={sales} />;
      case 'debts':
        return <DebtTracker sales={sales} onMarkAsPaid={handleMarkAsPaid} />;
      case 'settings':
        return <Settings onDataUpdate={refreshData} />;
      default:
        return <Dashboard sales={sales} onViewDebts={() => setView('debts')} />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

      <Layout activeView={view as ViewType} setView={(v) => setView(v)}>
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
