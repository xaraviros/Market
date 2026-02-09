
import React, { useState, useEffect } from 'react';
import { Sale, SaleItem, Location } from '../types';
import { MapPin, Trash2, Plus, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SaleFormProps {
  onSave: (sale: Sale) => void;
  onCancel: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ onSave, onCancel }) => {
  const [marketName, setMarketName] = useState('');
  const [items, setItems] = useState<SaleItem[]>([{ id: '1', name: '', quantity: 1, price: 0 }]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [debtDueDate, setDebtDueDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [location, setLocation] = useState<Location | undefined>();
  const [loadingLocation, setLoadingLocation] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const debtAmount = Math.max(0, totalAmount - paidAmount);

  useEffect(() => {
    setPaidAmount(totalAmount); // Default to fully paid
  }, [totalAmount]);

  const captureLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setLoadingLocation(false);
        },
        (err) => {
          console.error(err);
          alert('نەتوانرا شوێنەکە دیاری بکرێت. تکایە دڵنیابەرەوە لۆکەیشن کراوەیە.');
          setLoadingLocation(false);
        }
      );
    }
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketName.trim()) return alert('تکایە ناوی مارکێت بنووسە');
    
    const newSale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      marketName,
      items: items.filter(i => i.name.trim()),
      totalAmount,
      paidAmount,
      debtAmount,
      debtDueDate: debtAmount > 0 ? debtDueDate : undefined,
      location,
      isCompleted: true
    };

    onSave(newSale);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12 animate-slideUp">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-700">زانیاری مارکێت</h2>
        
        <input
          type="text"
          placeholder="ناوی مارکێت..."
          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          value={marketName}
          onChange={(e) => setMarketName(e.target.value)}
          required
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={captureLocation}
            disabled={loadingLocation}
            className={`flex-1 flex items-center justify-center p-3 rounded-xl border transition ${location ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}
          >
            <MapPin size={18} className="ml-2" />
            {loadingLocation ? 'دیاریکردن...' : location ? 'شوێن تۆمارکرا' : 'تۆمارکردنی شوێن (Live)'}
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">کاڵاکان</h2>
          <button type="button" onClick={addItem} className="text-blue-600 font-bold flex items-center text-sm">
            <Plus size={16} className="ml-1" /> زیادکردن
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="ناوی کاڵا..."
                className="flex-[2] p-2 bg-gray-50 rounded-lg border border-gray-200"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="دانە"
                className="w-16 p-2 bg-gray-50 rounded-lg border border-gray-200"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
              />
              <input
                type="number"
                placeholder="نرخ"
                className="w-24 p-2 bg-gray-50 rounded-lg border border-gray-200"
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
              />
              <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 p-1">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-dashed flex justify-between items-center font-bold">
          <span>کۆی گشتی:</span>
          <span className="text-xl text-blue-600">{totalAmount.toLocaleString()} دینار</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-700">بڕی پارە و قەرز</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">بڕی پارەی وەرگیراو</label>
            <input
              type="number"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold"
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseInt(e.target.value) || 0)}
            />
          </div>

          {debtAmount > 0 && (
            <div className="animate-fadeIn space-y-4">
              <div className="flex justify-between items-center text-red-600 font-bold p-3 bg-red-50 rounded-xl">
                <span>بڕی قەرز:</span>
                <span>{debtAmount.toLocaleString()} دینار</span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1 flex items-center">
                  <Calendar size={14} className="ml-1" /> بەرواری وەرگرتنەوەی قەرز
                </label>
                <input
                  type="date"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-[2] bg-blue-600 text-white font-bold p-4 rounded-2xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
        >
          <CheckCircle className="ml-2" size={20} /> سەیڤکردن
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-bold p-4 rounded-2xl hover:bg-gray-300 transition"
        >
          لابردن
        </button>
      </div>
    </form>
  );
};

export default SaleForm;
