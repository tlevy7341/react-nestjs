import create from "zustand";

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
  applyTheme: (theme: string) => void;
}

enum ThemeTypes {
  LIGHT = "light",
  DARK = "dark",
}

const userPreferedTheme =
  window.matchMedia("(prefers-color-scheme: dark)").matches === true
    ? "dark"
    : "light";

const localStorageTheme = localStorage.getItem("theme");

export const themeStore = create<ThemeState>((set, get) => ({
  theme: localStorageTheme ? localStorageTheme : userPreferedTheme,
  toggleTheme: () => {
    set((state) => ({
      theme:
        state.theme === ThemeTypes.LIGHT ? ThemeTypes.DARK : ThemeTypes.LIGHT,
    }));
    const themeState = themeStore.getState().theme;
    localStorage.setItem("theme", themeState);
    get().applyTheme(themeState);
  },
  applyTheme: (theme: string) => {
    const rootElement = document.documentElement;
    rootElement.setAttribute("data-theme", theme);
  },
}));
