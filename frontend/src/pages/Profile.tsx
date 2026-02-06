import { useAuth } from '@/context/auth/AuthContextProvider';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Sun, Moon, Monitor, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col p-6 max-w-lg mx-auto relative z-10">
      {/* Header */}
      <div className="flex-shrink-0 pb-6">
        <p className="text-muted-foreground text-center">
          Manage your account and preferences
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-4">
        {/* Account Section */}
        <div className="p-4 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20">
          <Label className="text-base font-semibold mb-4 block">Account</Label>
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={user?.photoURL || undefined} alt="Profile" />
              <AvatarFallback className="bg-primary/10">
                <User className="w-10 h-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">
              {user?.displayName || 'Anonymous User'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.email || 'No email'}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Theme Section */}
        <div className="p-4 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20">
          <Label className="text-base font-semibold mb-4 block">
            Appearance
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(option => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl transition-all',
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
