import React from 'react';
import { Home, Syringe, User, LayoutGrid, Settings } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  user: any; // TODO: Fix to UserData
  baby: any; // TODO: Fix to BabyData
  babyAgeWeeks: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, user, baby, babyAgeWeeks 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const getTitle = () => {
    switch(currentPath) {
      case '/dashboard': return `Olá, ${user?.name?.split(' ')[0] ?? 'Zela'}`;
      case '/vaccines': return 'Carteirinha';
      case '/tools': return 'Ferramentas';
      case '/profile': return 'Perfil';
      case '/reports': return 'Relatórios';
      case '/routine': return 'Rotina';
      case '/community': return 'Comunidade';
      case '/spirituality': return 'Espiritualidade';
      case '/settings': return 'Configurações';
      default: return '';
    }
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col pb-24">
        
        {/* HEADER */}
        <header className="px-6 py-6 bg-white sticky top-0 z-20 border-b border-slate-50 flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold text-slate-900">
               {getTitle()}
             </h1>
             <p className="text-sm text-slate-500 flex items-center gap-1">
               {baby?.name} • {babyAgeWeeks} semanas
             </p>
           </div>
           {currentPath === '/profile' ? (
             <button
               type="button"
               onClick={() => navigate('/settings')}
               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 active:scale-95 transition-all"
             >
               <Settings className="text-slate-400 w-6 h-6" />
             </button>
           ) : (
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
               <User className="w-5 h-5 text-slate-400" />
             </div>
           )}
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8">
          {children}
        </main>
        
        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-200 pointer-events-auto shadow-lg-up">
            <nav className="flex justify-around items-center h-20 pb-2">
              <Link 
                to="/dashboard"
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/dashboard') ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Home className={`w-6 h-6 ${isActive('/dashboard') ? 'fill-current' : ''}`} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Início</span>
              </Link>
              
              <Link 
                to="/tools"
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/tools') ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className={`w-6 h-6 ${isActive('/tools') ? 'fill-current' : ''}`} strokeWidth={isActive('/tools') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Ferramentas</span>
              </Link>

              <Link 
                to="/vaccines"
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/vaccines') ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Syringe className={`w-6 h-6 ${isActive('/vaccines') ? 'fill-current' : ''}`} strokeWidth={isActive('/vaccines') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Vacinas</span>
              </Link>
              <Link 
                to="/profile"
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/profile') ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <User className={`w-6 h-6 ${isActive('/profile') ? 'fill-current' : ''}`} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Perfil</span>
              </Link>
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
};
