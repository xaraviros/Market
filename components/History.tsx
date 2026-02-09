
import React, { useState } from 'react';
import { Sale } from '../types';
import { Search, ExternalLink, Calendar as CalIcon, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface HistoryProps {
  sales: Sale[];
}

const History: React.FC<HistoryProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(s => 
    s.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="relative">
        <Search className="absolute right-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="گەڕان بەدوای مارکێت یان کاڵا..."
          className="w-full p-3 pr-10 bg-white rounded-xl border border-gray-200 shadow-sm outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSales.length === 0 ? (
        <div className="text-center py-12 text-gray-400">هیچ تۆمارێک نییە</div>
      ) : (
        <div className="space-y-3">
          {filteredSales.map(sale => (
            <div key={sale.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{sale.marketName}</h3>
                  <div className="text-xs text-gray-400 flex items-center">
                    <CalIcon size={12} className="ml-1" /> {format(parseISO(sale.date), 'yyyy-MM-dd HH:mm')}
                  </div>
                </div>
                <div className="text-left font-bold text-blue-600">
                  {sale.totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="border-t border-gray-50 pt-2 mt-2 space-y-1">
                {sale.items.map(item => (
                  <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                    <span>{item.name} ({item.quantity} دانە)</span>
                    <span>{(item.quantity * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                {sale.location && (
                  <a
                    href={`https://www.google.com/maps?q=${sale.location.lat},${sale.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                  >
                    <MapPin size={14} className="ml-1" /> شوێنەکەی لەسەر نەخشە
                  </a>
                )}
                {sale.debtAmount > 0 && (
                  <div className="flex-1 flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                    قەرز: {sale.debtAmount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
