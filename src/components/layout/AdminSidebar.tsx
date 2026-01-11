import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  School,
  Users,
  FileText,
  DoorOpen,
  Shuffle,
  Settings,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: School, label: 'Institutions', path: '/admin/institutions' },
  { icon: Users, label: 'Students', path: '/admin/students' },
  { icon: FileText, label: 'Exams', path: '/admin/exams' },
  { icon: DoorOpen, label: 'Exam Halls', path: '/admin/halls' },
  { icon: Shuffle, label: 'Allocations', path: '/admin/allocations' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminSidebar = () => {
  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="mb-4">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Management
          </h2>
        </div>
        
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
          <h3 className="font-display font-semibold text-foreground">Need Help?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Check our documentation for guides on allocation algorithms.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
