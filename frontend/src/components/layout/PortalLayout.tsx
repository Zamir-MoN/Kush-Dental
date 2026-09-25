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
          className="fixed inset-0 z-40 bg-[#162723]/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#FAF7F2]">
          <BrandLogo isDark={false} size="sm" />
          <button 
            className="md:hidden text-[#162723] p-1" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#162723] text-white'
                    : 'text-[#162723]/70 hover:bg-[#FAF7F2] hover:text-[#162723]'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[#FAF7F2]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between bg-white px-6 shadow-sm z-30">
          <button 
            className="md:hidden text-[#162723] p-2 -ml-2 rounded-lg hover:bg-[#FAF7F2]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-[#162723]">{user?.email || 'User'}</span>
              <span className="inline-flex items-center rounded-full bg-[#DCA51B]/10 px-2 py-0.5 text-xs font-medium text-[#DCA51B]">
                {user?.role}
              </span>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#162723] text-[#DCA51B] font-bold">
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
