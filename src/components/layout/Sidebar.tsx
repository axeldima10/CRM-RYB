import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Award,
  BookOpen,
  Settings,
  ClipboardList,
  FolderKanban,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import type { UserRole } from '../../types/database';


interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'bd', 'client'] },
  { label: 'Leads', path: '/leads', icon: Users, roles: ['admin', 'bd'] },
  { label: 'Projects', path: '/projects', icon: FolderKanban, roles: ['admin', 'client'] },
  { label: 'Meetings', path: '/meetings', icon: Calendar, roles: ['admin', 'bd'] },
  { label: 'Quotes', path: '/quotes', icon: FileText, roles: ['admin', 'bd'] },
  { label: 'Payments', path: '/payments', icon: CreditCard, roles: ['admin', 'bd'] },
  { label: 'Commissions', path: '/commissions', icon: Award, roles: ['admin', 'bd'] },
  { label: 'BDs', path: '/bds', icon: Users, roles: ['admin'] },
  { label: 'Training', path: '/training', icon: BookOpen, roles: ['bd'] },
  { label: 'Audit Log', path: '/audit', icon: ClipboardList, roles: ['admin'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'bd', 'client'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">RYB CRM</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-slate-400"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <Separator />

      {/* User section */}
      <div className={`p-4 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col' : 'gap-3'}`}>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.full_name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-slate-400" title="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
