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
  Bot
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
    { label: 'AI Content', path: '/staff/dxgen', icon: <Bot size={20} />, allowedRoles: ['DOCTOR'] },
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#E8E2D5] shadow-sm transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#E8E2D5] bg-[#FAF7F2]/60">
          <BrandLogo isDark={false} size="sm" />
          <button 
            className="md:hidden text-zinc-600 hover:text-zinc-900 p-1" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1.5 px-3.5 py-6 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/40 shadow-xs'
                    : 'text-zinc-600 hover:bg-[#FAF7F2] hover:text-zinc-900'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[#E8E2D5] bg-[#FAF7F2]/40">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#FAF7F2]">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between bg-white px-6 md:px-8 border-b border-[#E8E2D5] shadow-xs z-30">
          <button 
            className="md:hidden text-zinc-700 p-2 -ml-2 rounded-xl hover:bg-[#FAF7F2]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-zinc-900">{user?.email || 'User'}</span>
              <span className="inline-flex items-center rounded-full bg-[#FAF3E0] border border-[#DCA51B]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#8C6B14]">
                {user?.role}
              </span>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/50 text-[#8C6B14] font-bold shadow-xs">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
