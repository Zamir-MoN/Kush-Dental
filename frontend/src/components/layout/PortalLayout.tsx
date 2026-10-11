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
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { NotificationCenter } from './NotificationCenter';

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
    <div className="portal-neumorphic flex min-h-screen bg-[#FAF7F2] text-slate-800 font-sans selection:bg-[#DC95FF]/30 selection:text-[#3B0764]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Neumorphic Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-[#FAF7F2] border-r border-[#E8E2D5]/80 shadow-[8px_0_24px_rgba(229,223,211,0.6)] md:shadow-[6px_0_18px_rgba(229,223,211,0.45)] transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#E8E2D5]/70 bg-[#FAF7F2]">
          <div className="flex items-center">
            <BrandLogo isDark={false} size="sm" />
          </div>
          <button 
            className="md:hidden text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] transition-all cursor-pointer" 
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
                    ? 'bg-[#FAF7F2] text-[#7C3AED] font-bold border border-white/95 shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#FAF7F2] hover:shadow-[4px_4px_10px_#E5DFD3,-4px_-4px_10px_#FFFFFF] hover:-translate-y-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3.5">
                    <span className={`shrink-0 p-1.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-[#7C3AED] bg-[#DC95FF]/20 shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF]' 
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
        <div className="p-4 border-t border-[#E8E2D5]/70 bg-[#FAF7F2]">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-center space-x-2.5 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 bg-[#FAF7F2] border border-white/80 shadow-[4px_4px_9px_#E5DFD3,-4px_-4px_9px_#FFFFFF] hover:shadow-[6px_6px_14px_#E5DFD3,-6px_-6px_14px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF] active:translate-y-0 transition-all cursor-pointer"
          >
            <span className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-12">
              <LogOut size={17} />
            </span>
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#FAF7F2]">
        {/* Neumorphic Top Header */}
        <header className="flex h-18 sm:h-20 items-center justify-between bg-[#FAF7F2]/95 backdrop-blur-md px-4 sm:px-6 md:px-8 border-b border-[#E8E2D5]/80 shadow-[0_4px_16px_rgba(229,223,211,0.4)] z-30">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <AnimatedLogo size={24} className="w-6 h-6 shrink-0" animate={false} />
              <span className="font-serif font-bold text-sm text-slate-800 tracking-tight">Kush Dental</span>
            </div>

            {/* Sleek Tactile Search Bar (Desktop) with Extended Length */}
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#FAF7F2] shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-[#E8E2D5] w-96 lg:w-[460px] xl:w-[500px] group focus-within:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF,0_0_0_2px_rgba(220,149,255,0.4)] transition-all">
              <Search size={16} className="text-slate-400 group-focus-within:text-[#7C3AED] shrink-0 transition-colors" />
              <input 
                type="text" 
                placeholder="Search appointments, patients..." 
                className="bg-transparent text-xs sm:text-sm text-slate-700 outline-none w-full placeholder:text-slate-400 font-medium pr-4" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Working Interactive Notification Center */}
            <NotificationCenter />

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
              <div className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF4BF] to-[#DC95FF]/25 shadow-[4px_4px_9px_#E5DFD3,-4px_-4px_9px_#FFFFFF] border border-[#DC95FF]/40 text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-300 hover:scale-105 select-none">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 custom-scrollbar bg-[#FAF7F2]">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (Doctor & Staff Mobile Quick Bar) */}
        <nav 
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D5]/90 px-1 py-1.5 shadow-[0_-4px_18px_rgba(229,223,211,0.65)] flex items-center justify-around safe-bottom"
        >
          <NavLink
            to="/staff/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#7C3AED] font-bold bg-[#DC95FF]/15 shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={19} className={isActive ? 'text-[#7C3AED] scale-105' : 'text-slate-500'} />
                <span className="text-[10px] mt-0.5 tracking-tight font-bold">Dashboard</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/staff/urgent-visits"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-rose-600 font-bold bg-rose-500/10 shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <AlertTriangle size={19} className={isActive ? 'text-rose-600 scale-105' : 'text-slate-500'} />
                <span className="text-[10px] mt-0.5 tracking-tight font-bold">Urgent</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/staff/appointments"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#7C3AED] font-bold bg-[#DC95FF]/15 shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <CalendarDays size={19} className={isActive ? 'text-[#7C3AED] scale-105' : 'text-slate-500'} />
                <span className="text-[10px] mt-0.5 tracking-tight font-bold">Appts</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/staff/leads"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#7C3AED] font-bold bg-[#DC95FF]/15 shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Target size={19} className={isActive ? 'text-[#7C3AED] scale-105' : 'text-slate-500'} />
                <span className="text-[10px] mt-0.5 tracking-tight font-bold">Leads</span>
              </>
            )}
          </NavLink>

          {/* More Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 hover:text-slate-800 active:bg-slate-200/50 transition-all cursor-pointer"
          >
            <Menu size={19} className="text-slate-600" />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
