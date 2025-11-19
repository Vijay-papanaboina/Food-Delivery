import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: "light",
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme: "light" | "dark") => set({ theme }),
}));
