import { NavLink } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  Menu as MenuIcon,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  { name: "Orders", href: "/orders", icon: ChefHat },
  { name: "Menu", href: "/menu", icon: MenuIcon },
  { name: "Status", href: "/status", icon: Activity },
];

export const Sidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transform transition-all duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "lg:w-16 w-64" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                Restaurant
              </h2>
            )}
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden lg:flex cursor-pointer",
                sidebarCollapsed && "mx-auto"
              )}
              onClick={toggleSidebarCollapsed}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      sidebarCollapsed ? "justify-center lg:px-0" : "gap-3",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                  onClick={() => {
                    // Only close sidebar on mobile devices
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
