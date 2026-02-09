
import React from 'react';
import { Sale } from '../types';
import { AlertCircle, Calendar as CalIcon, CheckCircle2, MapPin } from 'lucide-react';
import { format, parseISO, isBefore, isSameDay } from 'date-fns';

interface DebtTrackerProps {
  sales: Sale[];
  onMarkAsPaid: (saleId: string) => void;
}

const DebtTracker: React.FC<DebtTrackerProps> = ({ sales, onMarkAsPaid }) => {
  const debtSales = sales.filter(s => s.debtAmount > 0);
  const today = new Date();

  const sortedDebts = [...debtSales].sort((a, b) => {
    if (!a.debtDueDate || !b.debtDueDate) return 0;
    return new Date(a.debtDueDate).getTime() - new Date(b.debtDueDate).getTime();
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
        <div>
          <div className="text-red-600 font-bold text-xl">
            {debtSales.reduce((acc, s) => acc + s.debtAmount, 0).toLocaleString()} <span className="text-sm font-normal">دینار</span>
          </div>
          <div className="text-red-500 text-sm">کۆی گشتی قەرزەکانت لە بازاڕ</div>
        </div>
        <AlertCircle className="text-red-400" size={32} />
      </div>

      <h3 className="font-bold text-gray-700 mt-6 mb-2 px-1">لیستی قەرزارەکان</h3>

      {sortedDebts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">هیچ قەرزێکی هەڵپەسێردراو نییە</div>
      ) : (
        <div className="space-y-3">
          {sortedDebts.map(sale => {
            const isOverdue = sale.debtDueDate && (isBefore(parseISO(sale.debtDueDate), today) && !isSameDay(parseISO(sale.debtDueDate), today));
            const isToday = sale.debtDueDate && isSameDay(parseISO(sale.debtDueDate), today);

            return (
              <div key={sale.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${isToday ? 'border-amber-400' : isOverdue ? 'border-red-400' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{sale.marketName}</h4>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <CalIcon size={14} className="ml-1" />
                      بەرواری وەرگرتنەوە: 
                      <span className={`mr-1 font-bold ${isOverdue ? 'text-red-600' : isToday ? 'text-amber-600' : 'text-gray-700'}`}>
                        {sale.debtDueDate ? format(parseISO(sale.debtDueDate), 'yyyy-MM-dd') : 'دیاری نەکراوە'}
                        {isToday && " (ئەمڕۆ)"}
                        {isOverdue && " (بەسەرچووە)"}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-red-600 font-bold text-lg">{sale.debtAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">دینار</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {sale.location && (
                    <a
                      href={`https://www.google.com/maps?q=${sale.location.lat},${sale.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center p-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold"
                    >
                      <MapPin size={14} className="ml-1" /> نەخشەی مارکێت
                    </a>
                  )}
                  <button
                    onClick={() => onMarkAsPaid(sale.id)}
                    className="flex-1 flex items-center justify-center p-2.5 bg-green-50 text-green-600 rounded-xl text-xs font-bold"
                  >
                    <CheckCircle2 size={14} className="ml-1" /> وەرگیرایەوە
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DebtTracker;
