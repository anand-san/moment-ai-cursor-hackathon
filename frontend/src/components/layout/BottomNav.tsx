import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
    },
    {
      path: '/sessions',
      label: 'History',
      icon: Clock,
    },
    {
      path: '/tips',
      label: 'Tips',
      icon: Lightbulb,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground transition-colors',
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 transition-transform duration-200',
                  isActive && 'scale-110',
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
