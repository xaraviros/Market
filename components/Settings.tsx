
import React, { useRef } from 'react';
import { Download, Upload, Trash2, ShieldCheck, Database } from 'lucide-react';
import { storageService } from '../services/storageService';
import { triggerHaptic } from '../utils/haptics';

interface SettingsProps {
  onDataUpdate: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onDataUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    triggerHaptic('medium');
    storageService.exportData();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (confirm("ئایا دڵنیایت؟ ئەمە هەموو داتاکانی ئێستات دەسڕێتەوە و فایلە نوێیەکە دادەنێت.")) {
        try {
          await storageService.importData(file);
          onDataUpdate();
          alert("داتاکان بە سەرکەوتوویی گەڕانەوە");
        } catch (err) {
          alert("کێشەیەک هەبوو: " + err);
        }
      }
    }
  };

  const clearAllData = () => {
    if (confirm("ئایا دڵنیایت؟ هەموو فرۆشتنەکان و قەرزەکان بە یەکجاری دەسڕێنەوە!")) {
      storageService.saveSales([]);
      onDataUpdate();
      alert("هەموو داتاکان سڕانەوە");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Database size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-800">بەڕێوەبردنی داتا</h2>
            <p className="text-xs text-gray-400">سەیڤکردن و گەڕاندنەوەی زانیارییەکان</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <Download size={20} className="text-blue-600" />
              <span className="font-bold text-sm text-gray-700">دابەزاندنی باکئەپ (Backup)</span>
            </div>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <Upload size={20} className="text-green-600" />
              <span className="font-bold text-sm text-gray-700">گەڕاندنەوەی فایل (Import)</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
              accept=".json"
            />
          </button>

          <button 
            onClick={clearAllData}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-red-50 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-600" />
              <span className="font-bold text-sm text-gray-700">سڕینەوەی هەموو داتاکان</span>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white flex items-center gap-4">
        <ShieldCheck size={40} className="opacity-50" />
        <div>
          <h3 className="font-bold">داتاکانت پارێزراون</h3>
          <p className="text-xs opacity-80 leading-relaxed">
            هەموو زانیارییەکانت تەنها لەناو مۆبایلەکەی خۆت سەیڤ دەبن و ناچنە هیچ سێرڤەرێکەوە. بۆ دڵنیایی زیاتر هەفتانە فایلێکی باکئەپ دابەزێنە.
          </p>
        </div>
      </div>
      
      <div className="text-center text-gray-400 text-[10px] mt-10">
        Sales Master v2.1.0 - Native Experience
      </div>
    </div>
  );
};

export default Settings;
