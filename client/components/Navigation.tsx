import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  ArrowLeft,
  Home,
  Package,
  Menu,
  X,
  UserCircle,
  Settings,
  Bell,
  BarChart3,
  FileText,
  Users,
  Package2,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  showBackButton?: boolean;
  title?: string;
  rightContent?: React.ReactNode;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
  unreadNotifications?: number;
}

export default function Navigation({ 
  showBackButton = true, 
  title,
  rightContent,
  showMobileMenu = false,
  onMobileMenuToggle,
  unreadNotifications = 0
}: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    if (onMobileMenuToggle) {
      onMobileMenuToggle();
    }
  };

  const menuItems = [
    { path: '/', label: t('dashboard'), icon: BarChart3 },
    { path: '/menu', label: t('menu'), icon: FileText },
    { path: '/suppliers', label: t('suppliers'), icon: Users },
    { path: '/inventory', label: t('inventory'), icon: Package2 },
    { path: '/analytics', label: t('analytics'), icon: TrendingUp },
    { 
      path: '/notifications', 
      label: t('notifications'), 
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    }
  ];

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left Section - Back Button, Home, Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {showBackButton && location.pathname !== '/' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="p-1 sm:p-2"
                  title={t('goBack')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              
              {location.pathname !== '/' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHome}
                  className="p-1 sm:p-2"
                  title={t('goHome')}
                >
                  <Home className="w-4 h-4" />
                </Button>
              )}

              <div className="flex items-center">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-vendor mr-2 sm:mr-3" />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    StreetSource
                  </h1>
                  {title && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                      {title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Center Section - Page Title (Mobile) */}
            {title && (
              <div className="flex-1 text-center sm:hidden">
                <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {title}
                </h2>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2 xl:space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="text-xs xl:text-sm px-2 xl:px-3 relative"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {rightContent}
              
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-1 sm:p-2"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 sm:px-4 py-3 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full justify-start relative"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.badge && (
                        <span className="absolute right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('preferences')}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <ThemeToggle />
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
