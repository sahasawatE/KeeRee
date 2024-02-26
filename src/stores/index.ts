import { defineStore } from "pinia";

export const useStore = defineStore("main-store", {
  state: (): { loading: boolean; menuTitle: string; canReset: boolean } => {
    return {
      loading: false,
      menuTitle: "",
      canReset: false,
    };
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setMenuTitle(title: string) {
      this.menuTitle = title;
    },
    setCanReset(can: boolean) {
      this.canReset = can;
    },
  },

  getters: {
    getLoading: (state): boolean => {
      return state.loading;
    },
    getMenuTitle: (state): string => {
      return state.menuTitle;
    },
    getCanReset: (state): boolean => {
      return state.canReset;
    },
  },
});
