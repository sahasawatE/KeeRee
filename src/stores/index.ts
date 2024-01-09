import { defineStore } from "pinia";

export const useStore = defineStore("main-store", {
  state: (): { loading: boolean; menuTitle: string } => {
    return {
      loading: false,
      menuTitle: "",
    };
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setMenuTitle(title: string) {
      this.menuTitle = title;
    },
  },

  getters: {
    getLoading: (state): boolean => {
      return state.loading;
    },
    getMenuTitle: (state): string => {
      return state.menuTitle;
    },
  },
});
