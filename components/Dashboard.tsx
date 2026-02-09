
import React, { useMemo } from 'react';
import { Sale } from '../types';
import { TrendingUp, Wallet, AlertCircle, MapPin, ChevronLeft } from 'lucide-react';
import { format, isSameDay, isAfter, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { triggerHaptic } from '../utils/haptics';

interface DashboardProps {
  sales: Sale[];
  onViewDebts: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sales, onViewDebts }) => {
  const today = new Date();

  const stats = useMemo(() => {
    const todaySales = sales.filter(s => isSameDay(parseISO(s.date), today));
    const totalToday = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalDebt = sales.reduce((acc, s) => acc + s.debtAmount, 0);
    const upcomingCollections = sales.filter(s => 
      s.debtAmount > 0 && 
      s.debtDueDate && 
      (isSameDay(parseISO(s.debtDueDate), today) || isAfter(today, parseISO(s.debtDueDate)))
    );

    return { totalToday, totalDebt, upcomingCollections };
  }, [sales]);

  const chartData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = format(d, 'yyyy-MM-dd');
      const daySales = sales.filter(s => s.date.startsWith(iso));
      return {
        name: format(d, 'EEE'),
        amount: daySales.reduce((acc, s) => acc + s.totalAmount, 0)
      };
    }).reverse();
    return days;
  }, [sales]);

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-[2rem] shadow-lg shadow-blue-200 text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="opacity-80" />
            <span className="text-xs font-bold uppercase tracking-wider">ئەمڕۆ</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalToday.toLocaleString()}</div>
          <div className="text-[10px] opacity-70 mt-1 italic">دیناری عێراقی</div>
        </div>
        
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <Wallet size={16} />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">کۆی قەرز</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalDebt.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400 mt-1 italic">دیناری عێراقی</div>
        </div>
      </div>

      {stats.upcomingCollections.length > 0 && (
        <button 
          onClick={() => { triggerHaptic('medium'); onViewDebts(); }}
          className="w-full bg-amber-50 border border-amber-200 p-4 rounded-3xl flex items-center justify-between group active:scale-95 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <AlertCircle size={20} />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-amber-900 text-sm">ئاگاداری وەرگرتنی قەرز</h3>
              <p className="text-xs text-amber-700">{stats.upcomingCollections.length} مارکێت چاوەڕێت دەکەن</p>
            </div>
          </div>
          <ChevronLeft className="text-amber-400 group-hover:translate-x-[-4px] transition-transform" size={20} />
        </button>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="font-bold mb-6 text-gray-800 flex items-center gap-2">
           فرۆشی ٧ ڕۆژی ڕابردوو
        </h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
              <Tooltip cursor={{fill: '#f3f4f6', radius: 10}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 6, 6]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-gray-800">دوایین فرۆشتنەکان</h3>
          <span className="text-xs text-blue-600 font-bold">هەمووی ببینە</span>
        </div>
        <div className="space-y-3">
          {sales.slice(0, 5).map(sale => (
            <div key={sale.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex justify-between items-center active:scale-[0.98] transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-800">{sale.marketName}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{format(parseISO(sale.date), 'hh:mm a')}</div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-blue-600">{sale.totalAmount.toLocaleString()}</div>
                {sale.debtAmount > 0 && (
                  <div className="text-[10px] text-red-500 font-bold">قەرز: {sale.debtAmount.toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
