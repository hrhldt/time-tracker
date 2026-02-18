window.TimeTracker = window.TimeTracker || {};

(() => {
  class LocalStorageService {
    constructor({ entriesKey, themeKey }) {
      this.entriesKey = entriesKey;
      this.themeKey = themeKey;
    }

    loadEntries() {
      const raw = localStorage.getItem(this.entriesKey);
      if (!raw) {
        return [];
      }

      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    saveEntries(entryObjects) {
      localStorage.setItem(this.entriesKey, JSON.stringify(entryObjects));
    }

    loadThemePreference() {
      const stored = localStorage.getItem(this.themeKey);
      if (stored === "dark" || stored === "light") {
        return stored;
      }

      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    saveThemePreference(theme) {
      localStorage.setItem(this.themeKey, theme);
    }
  }

  window.TimeTracker.LocalStorageService = LocalStorageService;
})();
