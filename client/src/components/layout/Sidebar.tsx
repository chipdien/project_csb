import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings, 
  Plus 
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'Dashboard' }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Schedule', icon: Calendar },
    { name: 'Courses', icon: BookOpen },
    { name: 'Faculty', icon: Users },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface-container flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-primary tracking-tight">VietElite</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface/50 font-bold mt-1">Weekly Teaching</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = item.name === activeTab;
          return (
            <a
              key={item.name}
              href="#"
              className={`flex items-center space-x-3 px-4 py-2 transition-all font-headline text-sm font-medium tracking-tight rounded-full ${
                isActive 
                  ? 'bg-primary-container text-white' 
                  : 'text-on-surface hover:bg-surface/50 transition-colors'
              }`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <button className="w-full py-3 px-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
