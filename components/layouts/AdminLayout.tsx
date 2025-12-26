import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full relative">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-slate-900">Zela Admin</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-500">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
      <main className="flex-1 p-6 pb-24">
        {children}
      </main>
    </div>
  );
};
