
import { Sale } from '../types';

const STORAGE_KEY = 'sales_master_db_v2';

export const storageService = {
  saveSales: (sales: Sale[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
      // Also try to use Persistent Storage API if available
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(persistent => {
          if (persistent) console.log("Storage will not be cleared by OS");
        });
      }
    } catch (e) {
      console.error("Error saving data", e);
      alert("کێشەیەک لە سەیڤکردنی داتا دروست بوو.");
    }
  },
  
  loadSales: (): Sale[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error("Error loading data", e);
      return [];
    }
  },
  
  addSale: (sale: Sale) => {
    const sales = storageService.loadSales();
    const updated = [sale, ...sales];
    storageService.saveSales(updated);
    return updated;
  },

  exportData: () => {
    const data = storageService.loadSales();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData: (file: File): Promise<Sale[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          storageService.saveSales(data);
          resolve(data);
        } catch (err) {
          reject("فایلەکە دروست نییە");
        }
      };
      reader.onerror = () => reject("ناتوانرێت فایلەکە بخوێندرێتەوە");
      reader.readAsText(file);
    });
  }
};
