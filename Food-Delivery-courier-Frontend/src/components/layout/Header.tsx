import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Menu, LogOut, Sun, Moon } from "lucide-react";
import { logger } from "@/lib/logger";
import { AvailabilityToggle } from "@/components/AvailabilityToggle";

export const Header = () => {
  const { user } = useAuthStore();
  const { toggleSidebar, theme, setTheme } = useUIStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
    logger.info("User logged out");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Driver Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <AvailabilityToggle />
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.name}
            </span>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        )}

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to sign in again
                to access the driver dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};
