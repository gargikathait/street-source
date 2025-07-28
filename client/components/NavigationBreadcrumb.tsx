import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { ChevronRight, Home } from "lucide-react";

export default function NavigationBreadcrumb() {
  const location = useLocation();
  const { t } = useLanguage();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbMap: Record<string, string> = {
    '': t('dashboard'),
    'menu': t('menu'),
    'suppliers': t('suppliers'),
    'inventory': t('inventory'),
    'analytics': t('analytics'),
    'notifications': t('notifications'),
    'onboarding': 'Vendor Onboarding'
  };

  if (pathSegments.length === 0) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
          <Link 
            to="/" 
            className="flex items-center hover:text-vendor transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            {t('dashboard')}
          </Link>
          
          {pathSegments.map((segment, index) => {
            const path = '/' + pathSegments.slice(0, index + 1).join('/');
            const isLast = index === pathSegments.length - 1;
            const label = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <div key={segment} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                {isLast ? (
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {label}
                  </span>
                ) : (
                  <Link 
                    to={path} 
                    className="hover:text-vendor transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
