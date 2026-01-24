import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
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
import { useEffect, useState } from 'react';

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

// Sidebar Item Type
interface SubItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: string[];
  subItems?: SubItem[];
}

interface ZenaSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Sidebar Component
const ZenaSidebar = ({ isCollapsed, onToggle }: ZenaSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string>('salonadmin'); // Default role
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Get role from localStorage, if not found use default
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
    // If no role in localStorage, keep default as 'salonadmin'
  }, []);

  const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, allowedRoles: ['salonadmin', 'superadmin'] },
    { name: "Customers", path: "/customers", icon: Users, allowedRoles: ['salonadmin'] },
    { name: "Visits", path: "/visits", icon: FileText, allowedRoles: ['salonadmin'] },
    { name: "Rewards Management", path: "/rewards-management", icon: Gift, allowedRoles: ['salonadmin'] },
    { name: "Redemption Requests", path: "/redemption-requests", icon: CreditCard, allowedRoles: ['salonadmin'] },
    { name: "Settings", path: "/settings/super-admin", icon: Settings, allowedRoles: ['salonadmin'] },
    { name: "Overview", path: "/overview", icon: Grid3x3, allowedRoles: ['superadmin'] },
    { name: "Salons Management", path: "/salons-management", icon: Scissors, allowedRoles: ['superadmin'] },
    {
      name: "Settings",
      path: "/settings/admin",
      icon: Settings,
      allowedRoles: ['superadmin'],
      subItems: [
        { name: "System Setting", path: "/settings/admin/system-setting", icon: ClipboardList },
        { name: "Loyalty Rules", path: "/settings/admin/loyalty-rules", icon: ClipboardList },
      ]
    },
  ];

  // Filter sidebar items based on role
  // If role is not 'salonadmin' or 'superadmin', show only Dashboard
  const filteredSidebars = sidebarItems.filter(item => {
    // Always show Dashboard for all roles
    if (item.name === "Dashboard") return true;

    // For other items, check if user role is in allowedRoles
    return item.allowedRoles.includes(role);
  });

  // Alternative: If you want to show all items for salonadmin when role is null
  // const filteredSidebars = sidebarItems.filter(item => 
  //   item.allowedRoles.includes(role || 'salonadmin')
  // );

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isSubItemActive = (parentPath: string, subItems?: SubItem[]) => {
    if (!subItems) return false;
    return subItems.some(subItem => pathname === subItem.path);
  };

  const handleNavigation = (path: string, hasSubItems?: boolean, itemName?: string) => {
    if (hasSubItems && itemName) {
      // Toggle submenu
      setOpenSubMenus(prev => ({
        ...prev,
        [itemName]: !prev[itemName]
      }));
    } else {
      router.push(path);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout');
    localStorage.removeItem('role');
    router.push('/auth/login');
  };

  return (
    <aside
      className="h-screen border-r border-gray-200 bg-[#FFF8F5] flex flex-col transition-all duration-100 ease-in-out sticky top-0 left-0"
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      <div className='flex justify-end px-5'>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors pt-5"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      {/* Header */}
      <div className={`flex items-center justify-center w-full pb-5 ${isCollapsed ? 'px-4 justify-center' : 'px-6 justify-between'}`}>
        {!isCollapsed && (
          <Image
            src="/logo/logo.png"
            alt="Zena Logo"
            width={1000}
            height={1000}
            className="object-contain w-28 h-28"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'} overflow-y-auto`}>
        <ul className="space-y-1">
          {filteredSidebars.map((item) => {
            const isItemActive = isActive(item.path) || isSubItemActive(item.path, item.subItems);
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubMenuOpen = openSubMenus[item.name];

            return (
              <li key={item.name} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path, hasSubItems, item.name)}
                  className={`w-full h-12 flex items-center cursor-pointer transition-all duration-200 ${isCollapsed ? 'px-0 justify-center rounded-lg' : 'px-4 rounded-r-full'
                    } ${isItemActive
                      ? `${isCollapsed ? 'bg-primary' : 'bg-gradient-to-r from-green-200 to-green-300'} text-gray-800 hover:from-green-300 hover:to-green-400 ${!isCollapsed && 'border-l-4 border-pink-400'}`
                      : `text-gray-600 hover:bg-gray-100 ${!isCollapsed && 'border-l-4 border-transparent'}`
                    }`}
                  aria-current={isItemActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isItemActive ? 'text-gray-700' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <>
                      <span className={`ml-3 text-[15px] flex-1 text-left ${isItemActive ? 'font-medium' : 'font-normal'}`}>
                        {item.name}
                      </span>
                      {hasSubItems && (
                        isSubMenuOpen ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )
                      )}
                    </>
                  )}
                </button>

                {/* Tooltip for collapsed sidebar */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                    {item.name}
                  </div>
                )}

                {/* Submenu Items */}
                {!isCollapsed && hasSubItems && isSubMenuOpen && (
                  <ul className="mt-1 space-y-1 rounded-lg py-2 px-2 ml-4">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = pathname === subItem.path;

                      return (
                        <li key={subItem.name}>
                          <button
                            onClick={() => router.push(subItem.path)}
                            className={`w-full h-10 flex items-center cursor-pointer transition-all duration-200 px-3 rounded-md ${isSubActive
                              ? 'text-gray-800 font-medium'
                              : 'text-gray-600 hover:bg-green-100'
                              }`}
                          >
                            <div className={`w-2 h-2 rounded-full mr-3 ${isSubActive ? 'bg-pink-400' : 'bg-gray-400'}`} />
                            <span className="text-[14px]">{subItem.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
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
            className={`w-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-full h-11 shadow-md ${isCollapsed ? 'px-0' : ''
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