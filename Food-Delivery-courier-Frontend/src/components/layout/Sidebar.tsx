import { NavLink } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { Package, History, BarChart3, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  { name: "Active Deliveries", href: "/deliveries", icon: Package },
  { name: "Delivery History", href: "/history", icon: History },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

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
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Delivery Driver
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
