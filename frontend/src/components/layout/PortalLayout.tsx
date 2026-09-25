import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  UserCircle, 
  LogOut, 
  Menu,
  X,
  Target,
  FileText
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PortalLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/staff/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Follow-ups', path: '/staff/contacts', icon: <UserCircle size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Leads', path: '/staff/leads', icon: <Target size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Appointments', path: '/staff/appointments', icon: <CalendarDays size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Patients', path: '/staff/patients', icon: <Users size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Users', path: '/staff/users', icon: <UserCircle size={20} />, allowedRoles: ['DOCTOR'] },
    { label: 'Blog', path: '/staff/blog', icon: <FileText size={20} />, allowedRoles: ['DOCTOR'] },
  ];

  const visibleNavItems = navItems.filter(item => item.allowedRoles.includes(user?.role || ''));

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#E8E2D5] shadow-xl md:shadow-sm transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-18 sm:h-20 items-center justify-between px-6 border-b border-[#E8E2D5] bg-[#FAF7F2]/60">
          <BrandLogo isDark={false} size="sm" />
          <button 
            className="md:hidden text-zinc-600 hover:text-zinc-900 p-1.5 rounded-xl hover:bg-[#FAF7F2] transition-colors" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1.5 px-3.5 py-5 overflow-y-auto custom-scrollbar">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/40 shadow-xs'
                    : 'text-zinc-600 hover:bg-[#FAF7F2] hover:text-zinc-900'
                }`
              }
            >
              <span className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-0.5 group-active:scale-95">
                {item.icon}
              </span>
              <span className="transition-colors">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[#E8E2D5] bg-[#FAF7F2]/40">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
          >
            <span className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-12">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#FAF7F2]">
        {/* Top Header */}
        <header className="flex h-16 sm:h-20 items-center justify-between bg-white px-4 sm:px-6 md:px-8 border-b border-[#E8E2D5] shadow-xs z-30">
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden text-zinc-700 p-2 -ml-1 rounded-xl hover:bg-[#FAF7F2] active:scale-95 transition-all cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="md:hidden flex items-center">
              <BrandLogo isDark={false} size="sm" />
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="flex flex-col items-end min-w-0">
              <span className="text-xs sm:text-sm font-bold text-zinc-900 truncate max-w-[130px] sm:max-w-[200px]" title={user?.email || 'User'}>
                {user?.email || 'User'}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#FAF3E0] border border-[#DCA51B]/40 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#8C6B14]">
                {user?.role}
              </span>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/50 text-[#8C6B14] font-bold text-sm shadow-xs shrink-0 transition-transform duration-300 hover:scale-105">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
