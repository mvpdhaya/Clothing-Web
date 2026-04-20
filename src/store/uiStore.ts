import { create } from 'zustand';

interface UIState {
  isCartDrawerOpen: boolean;
  isFilterSidebarOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openFilterSidebar: () => void;
  closeFilterSidebar: () => void;
  toggleFilterSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  isFilterSidebarOpen: false,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  openFilterSidebar: () => set({ isFilterSidebarOpen: true }),
  closeFilterSidebar: () => set({ isFilterSidebarOpen: false }),
  toggleFilterSidebar: () => set((state) => ({ isFilterSidebarOpen: !state.isFilterSidebarOpen })),
}));
