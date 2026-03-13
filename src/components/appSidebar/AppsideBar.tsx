import { logout } from '@/features/auth/authSlice';
import {
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  CreditCard,
  FileText,
  Gift,
  Grid3x3,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  Users
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

// Sidebar Component
const ZenaSidebar = ({ isCollapsed, onToggle, isMobileOpen, onCloseMobile }: ZenaSidebarProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [role, setRole] = useState<string>(''); // Default role
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Get role from localStorage, if not found use default
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
    // If no role in localStorage, keep default as 'salonadmin'
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [pathname, isMobileOpen, onCloseMobile]);

  const sidebarItems: SidebarItem[] = [
    { name: t('dashboard'), path: "/", icon: LayoutDashboard, allowedRoles: ['salonadmin', 'ADMIN'] },
    { name: t('customers'), path: "/customers", icon: Users, allowedRoles: ['salonadmin', 'ADMIN'] },
    { name: t('visits'), path: "/visits", icon: FileText, allowedRoles: ['salonadmin', 'ADMIN'] },
    { name: t('rewards_management'), path: "/rewards-management", icon: Gift, allowedRoles: ['salonadmin', 'ADMIN'] },
    { name: t('redemption_requests'), path: "/redemption-requests", icon: CreditCard, allowedRoles: ['salonadmin', 'ADMIN'] },
    { name: t('settings'), path: "/settings/super-admin", icon: Settings, allowedRoles: ['salonadmin', 'ADMIN'] },
    { name: t('overview'), path: "/overview", icon: Grid3x3, allowedRoles: ['superadmin', 'SUPER_ADMIN'] },
    { name: t('salons_management'), path: "/salons-management", icon: Scissors, allowedRoles: ['superadmin', 'SUPER_ADMIN'] },
    { name: t('analytics'), path: "/analytics", icon: ChartNoAxesColumnIncreasing, allowedRoles: ['superadmin', 'SUPER_ADMIN'] },
    {
      name: t('settings'),
      path: "/settings/admin",
      icon: Settings,
      allowedRoles: ['superadmin', 'SUPER_ADMIN'],
      subItems: [
        { name: t('system_setting'), path: "/settings/admin/system-setting", icon: ClipboardList },
        { name: t('loyalty_rules'), path: "/settings/admin/loyalty-rules", icon: ClipboardList },
      ]
    },
  ];

  // Filter sidebar items based on role
  // If role is not 'salonadmin' or 'superadmin', show only Dashboard
  const filteredSidebars = sidebarItems.filter(item => {
    // Check if user role is in allowedRoles
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
    console.log('Logout');
    dispatch(logout()); // This clears token from Redux and localStorage via the slice
    localStorage.removeItem('role');
    router.push('/auth/login');
  };

  return (
    <aside
      className={`h-screen border-r border-gray-200 bg-[#FFF8F5] flex flex-col transition-all duration-300 ease-in-out fixed md:sticky top-0 left-0 z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} px-5 py-5`}>
        {/* Toggle button - only visible on desktop or when mobile is open */}
        {isMobileOpen ? (
          <button
            onClick={onCloseMobile}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors hidden md:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        )}
      </div>

      {/* Header */}
      <div className={`flex items-center justify-center w-full pb-5 ${isCollapsed ? 'px-4' : 'px-6'}`}>
        {!isCollapsed && (
          <Image
            src="/logo/logo.png"
            alt="Zena Logo"
            width={112}
            height={112}
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
                      ? `${isCollapsed ? 'bg-primary' : 'bg-gradient-to-r from-green-200 to-green-300'} text-gray-800 hover:from-green-300 hover:to-green-400 ${!isCollapsed && 'border-s-4 border-pink-400'}`
                      : `text-gray-600 hover:bg-gray-100 ${!isCollapsed && 'border-s-4 border-transparent'}`
                    }`}
                  aria-current={isItemActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isItemActive ? 'text-gray-700' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <>
                      <span className={`ms-3 text-[15px] flex-1 text-left ${isItemActive ? 'font-medium' : 'font-normal'}`}>
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
                  <ul className="mt-1 space-y-1 rounded-lg py-2 px-2 ms-4">
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
                            <div className={`w-2 h-2 rounded-full me-3 ${isSubActive ? 'bg-pink-400' : 'bg-gray-400'}`} />
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
            <LogOut className={`h-4 w-4 ${!isCollapsed && 'me-2'}`} />
            {!isCollapsed && t('logout')}
          </Button>
          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
              {t('logout')}
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