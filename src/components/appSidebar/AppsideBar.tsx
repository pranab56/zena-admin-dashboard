import {
  CreditCard,
  FileText,
  Gift,
  Grid3x3,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Settings,
  Users,
  X
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock shadcn/ui components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button = ({ children, className = '', onClick }: ButtonProps) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Avatar = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>
);

const AvatarImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image src={src} alt={alt} width={40} height={40} className="w-full h-full object-cover" />
);

const AvatarFallback = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full h-full flex items-center justify-center ${className}`}>{children}</div>
);

const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>
);

// Sidebar Item Type
interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: string[];
}

interface ZenaSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Sidebar Component
const ZenaSidebar = ({ isCollapsed, onToggle }: ZenaSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [role] = useState<'superadmin' | 'admin'>('superadmin');

  const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, allowedRoles: ['superadmin', 'admin'] },
    { name: "Customers", path: "/customers", icon: Users, allowedRoles: ['superadmin'] },
    { name: "Visits", path: "/visits", icon: FileText, allowedRoles: ['superadmin'] },
    { name: "Rewards Management", path: "/rewards-management", icon: Gift, allowedRoles: ['superadmin'] },
    { name: "Redemption Requests", path: "/redemption-requests", icon: CreditCard, allowedRoles: ['superadmin'] },
    { name: "Settings", path: "/settings", icon: Settings, allowedRoles: ['superadmin'] },
    { name: "Overview", path: "/overview", icon: Grid3x3, allowedRoles: ['admin'] },
    { name: "Salons Management", path: "/salons-management", icon: Scissors, allowedRoles: ['admin'] },
    { name: "Setting", path: "/setting", icon: Settings, allowedRoles: ['admin'] },
  ];

  const filteredSidebars = sidebarItems.filter(item => item.allowedRoles.includes(role));

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout');
    // Example: router.push('/login');
  };

  return (
    <aside
      className="h-screen border-r border-gray-200 bg-linear-to-b from-gray-50 to-white flex flex-col transition-all duration-100 ease-in-out sticky top-0 left-0"
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      {/* Header */}
      <div className={`flex items-center py-8 ${isCollapsed ? 'px-4 justify-center' : 'px-6 justify-between'}`}>
        {!isCollapsed && (
          <h1 className="text-4xl font-light text-gray-400 italic">Zena</h1>
        )}
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <ul className="space-y-1">
          {filteredSidebars.map((item) => {
            const isItemActive = isActive(item.path);
            const Icon = item.icon;

            return (
              <li key={item.name} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full h-12 flex items-center cursor-pointer transition-all duration-200 ${isCollapsed ? 'px-0 justify-center rounded-lg' : 'px-4 rounded-r-full'
                    } ${isItemActive
                      ? `${isCollapsed ? 'bg-primary' : 'bg-linear-to-r from-green-200 to-green-300'} text-gray-800 hover:from-green-300 cursor-pointer hover:to-green-400 ${!isCollapsed && 'border-l-4 border-pink-400'}`
                      : `text-gray-600 hover:bg-gray-100 ${!isCollapsed && 'border-l-4 border-transparent'}`
                    }`}
                  aria-current={isItemActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isItemActive ? 'text-gray-700' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <span className={`ml-3 text-[15px] ${isItemActive ? 'font-medium' : 'font-normal'}`}>
                      {item.name}
                    </span>
                  )}
                </button>
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                    {item.name}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`pb-6 mt-auto space-y-3 ${isCollapsed ? 'px-3' : 'px-6'}`}>
        <div className="relative group">
          <Button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center cursor-pointer bg-linear-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-full h-11 shadow-md ${isCollapsed ? 'px-0' : ''
              }`}
          >
            <LogOut className={`h-4 w-4 ${!isCollapsed && 'mr-2'}`} />
            {!isCollapsed && 'Logout'}
          </Button>
          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
              Logout
            </div>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-center text-xs text-gray-500">Copyright@app</p>
        )}
      </div>
    </aside>
  );
};

export default ZenaSidebar;