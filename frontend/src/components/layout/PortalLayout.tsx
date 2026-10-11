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
  FileText,
  AlertTriangle,
  Search,
  Bell,
  ShieldCheck
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
    { label: 'Urgent Visits', path: '/staff/urgent-visits', icon: <AlertTriangle size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Follow-ups', path: '/staff/contacts', icon: <UserCircle size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Leads', path: '/staff/leads', icon: <Target size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Appointments', path: '/staff/appointments', icon: <CalendarDays size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Patients', path: '/staff/patients', icon: <Users size={20} />, allowedRoles: ['DOCTOR', 'STAFF'] },
    { label: 'Users', path: '/staff/users', icon: <UserCircle size={20} />, allowedRoles: ['DOCTOR'] },
    { label: 'Blog', path: '/staff/blog', icon: <FileText size={20} />, allowedRoles: ['DOCTOR'] },
  ];

  const visibleNavItems = navItems.filter(item => item.allowedRoles.includes(user?.role || ''));

  return (
    <div className="portal-neumorphic flex min-h-screen bg-[#EBF0F7] text-slate-800 font-sans selection:bg-[#DC95FF]/30 selection:text-[#3B0764]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Neumorphic Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-[#EBF0F7] border-r border-white/80 shadow-[8px_0_24px_rgba(209,217,230,0.6)] md:shadow-[6px_0_18px_rgba(209,217,230,0.45)] transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200/60 bg-[#EBF0F7]">
          <div className="p-1 rounded-2xl bg-[#EBF0F7] shadow-[inset_2px_2px_5px_#D1D9E6,inset_-2px_-2px_5px_#FFFFFF]">
            <BrandLogo isDark={false} size="sm" />
          </div>
          <button 
            className="md:hidden text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] transition-all cursor-pointer" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 space-y-2.5 px-4 py-6 overflow-y-auto custom-scrollbar">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#EBF0F7] text-[#7C3AED] font-bold border border-white/90 shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#EBF0F7] hover:shadow-[4px_4px_10px_#D1D9E6,-4px_-4px_10px_#FFFFFF] hover:-translate-y-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3.5">
                    <span className={`shrink-0 p-1.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-[#7C3AED] bg-[#DC95FF]/20 shadow-[inset_1.5px_1.5px_3px_#D1D9E6,inset_-1.5px_-1.5px_3px_#FFFFFF]' 
                        : 'group-hover:scale-110 group-hover:rotate-3 group-hover:text-[#DC95FF]'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#DC95FF] to-[#FFF4BF] shadow-[0_0_8px_rgba(220,149,255,0.7)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Bottom Bar */}
        <div className="p-4 border-t border-slate-200/60 bg-[#EBF0F7]">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-center space-x-2.5 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 bg-[#EBF0F7] border border-white/80 shadow-[4px_4px_9px_#D1D9E6,-4px_-4px_9px_#FFFFFF] hover:shadow-[6px_6px_14px_#D1D9E6,-6px_-6px_14px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] active:translate-y-0 transition-all cursor-pointer"
          >
            <span className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-12">
              <LogOut size={17} />
            </span>
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#EBF0F7]">
        {/* Neumorphic Top Header */}
        <header className="flex h-18 sm:h-20 items-center justify-between bg-[#EBF0F7]/95 backdrop-blur-md px-4 sm:px-6 md:px-8 border-b border-white/80 shadow-[0_4px_16px_rgba(209,217,230,0.4)] z-30">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-slate-600 p-2 rounded-2xl bg-[#EBF0F7] shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 transition-all cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <AnimatedLogo size={24} className="w-6 h-6 shrink-0" animate={false} />
              <span className="font-serif font-bold text-sm text-slate-800 tracking-tight">Kush Dental</span>
            </div>

            {/* Inset Neumorphic Search Bar (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/60 w-64 lg:w-80 group focus-within:shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF,0_0_0_2px_rgba(220,149,255,0.35)] transition-all">
              <Search size={16} className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" />
              <input 
                type="text" 
                placeholder="Search appointments, patients..." 
                className="bg-transparent text-xs text-slate-700 outline-none w-full placeholder:text-slate-400 font-medium" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick Action Icon: Notifications */}
            <button 
              className="w-10 h-10 rounded-2xl bg-[#EBF0F7] shadow-[4px_4px_9px_#D1D9E6,-4px_-4px_9px_#FFFFFF] hover:shadow-[6px_6px_14px_#D1D9E6,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#D1D9E6,inset_-2px_-2px_5px_#FFFFFF] border border-white/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative group"
              title="Notifications"
            >
              <Bell size={18} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#DC95FF] shadow-[0_0_6px_rgba(220,149,255,0.9)]" />
            </button>

            {/* User Profile Info & Tactile Avatar */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-300/60">
              <div className="hidden sm:flex flex-col items-end min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[180px]" title={user?.email || 'User'}>
                  {user?.email || 'User'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4BF] shadow-[inset_1.5px_1.5px_3px_#E6DC9A,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-[#DC95FF]/30 px-2 py-0.5 text-[10px] font-extrabold text-[#6B21A8] uppercase tracking-wider">
                  <ShieldCheck size={10} className="text-[#7C3AED]" />
                  {user?.role}
                </span>
              </div>
              
              {/* Mobile role pill only */}
              <span className="sm:hidden inline-flex items-center rounded-full bg-[#FFF4BF] shadow-[inset_1.5px_1.5px_3px_#E6DC9A,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-[#DC95FF]/30 px-2 py-0.5 text-[10px] font-extrabold text-[#6B21A8]">
                {user?.role}
              </span>

              {/* Tactile Neumorphic Avatar Plate */}
              <div className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF4BF] to-[#DC95FF]/25 shadow-[4px_4px_9px_#D1D9E6,-4px_-4px_9px_#FFFFFF] border border-[#DC95FF]/40 text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-300 hover:scale-105 select-none">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar bg-[#EBF0F7]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
