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
import { AnimatedLogo } from '../ui/AnimatedLogo';

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
    <div className="portal-dark flex min-h-screen bg-[#0D0E12] text-zinc-100">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#13151A] border-r border-[#22252E] shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-18 sm:h-20 items-center justify-between px-6 border-b border-[#22252E] bg-[#16181E]">
          <BrandLogo isDark={true} size="sm" />
          <button 
            className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" 
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
                    ? 'bg-[#DCA51B]/15 text-[#F5C242] border border-[#DCA51B]/35 shadow-[0_0_15px_rgba(220,165,27,0.12)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
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
        
        <div className="p-4 border-t border-[#22252E] bg-[#16181E]">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <span className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-12">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#0D0E12]">
        {/* Top Header */}
        <header className="flex h-16 sm:h-20 items-center justify-between bg-[#13151A]/90 backdrop-blur-md px-3.5 sm:px-6 md:px-8 border-b border-[#22252E] shadow-xs z-30">
          <div className="flex items-center gap-2 shrink-0">
            <button 
              className="md:hidden text-zinc-300 p-2 -ml-1 rounded-xl hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <AnimatedLogo size={24} className="w-6 h-6 shrink-0" animate={false} />
              <span className="font-serif font-bold text-sm text-white tracking-tight">Kush Dental</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop user email + role */}
            <div className="hidden sm:flex flex-col items-end min-w-0">
              <span className="text-xs sm:text-sm font-bold text-zinc-200 truncate max-w-[200px]" title={user?.email || 'User'}>
                {user?.email || 'User'}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#DCA51B]/15 border border-[#DCA51B]/35 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#F5C242]">
                {user?.role}
              </span>
            </div>
            
            {/* Mobile role pill only */}
            <span className="sm:hidden inline-flex items-center rounded-full bg-[#DCA51B]/15 border border-[#DCA51B]/35 px-2 py-0.5 text-[10px] font-bold text-[#F5C242]">
              {user?.role}
            </span>

            {/* User Avatar Circle */}
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-2xl bg-[#DCA51B]/20 border border-[#DCA51B]/40 text-[#F5C242] font-bold text-xs sm:text-sm shadow-xs shrink-0 transition-transform duration-300 hover:scale-105">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 custom-scrollbar bg-[#0D0E12]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
