
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  marketName: string;
  items: SaleItem[];
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  debtDueDate?: string;
  location?: Location;
  isCompleted: boolean;
}

export type ViewType = 'dashboard' | 'add-sale' | 'history' | 'debts';
