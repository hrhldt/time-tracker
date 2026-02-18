window.TimeTracker = window.TimeTracker || {};

(() => {
  const { TimeEntry } = window.TimeTracker;

  class TimeTrackerViewModel {
    constructor(storageService) {
      this.storageService = storageService;
      this.entries = [];
      this.theme = "light";
      this.listeners = new Set();
      this.tickTimer = null;
      this.isStartTimeEditing = false;
    }

    init() {
      this.entries = this.storageService
        .loadEntries()
        .map((entry) => TimeEntry.fromObject(entry))
        .sort((a, b) => b.createdAt - a.createdAt);
      this.theme = this.storageService.loadThemePreference();
      this.notify();
      this.startTicking();
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    notify() {
      const snapshot = this.getSnapshot();
      this.listeners.forEach((listener) => listener(snapshot));
    }

    setStartTimeEditing(isEditing) {
      this.isStartTimeEditing = Boolean(isEditing);
    }

    createEntry(name, date) {
      const safeName = String(name || "").trim();
      const safeDate = String(date || "").trim();
      if (!safeName || !safeDate) {
        return false;
      }

      this.entries.push(
        new TimeEntry({
          id: crypto.randomUUID(),
          name: safeName,
          date: safeDate,
          sessions: [],
          createdAt: Date.now(),
        })
      );

      this.persistAndNotify();
      return true;
    }

    toggleEntry(entryId) {
      const entry = this.findEntry(entryId);
      if (!entry) {
        return;
      }

      entry.toggleTiming();
      this.persistAndNotify();
    }

    updateEntryStartTime(entryId, timeValue) {
      const entry = this.findEntry(entryId);
      if (!entry) {
        return;
      }

      const updated = entry.updateStartTime(timeValue);
      if (!updated) {
        return;
      }

      this.persistAndNotify();
    }

    deleteEntry(entryId) {
      this.entries = this.entries.filter((entry) => entry.id !== entryId);
      this.persistAndNotify();
    }

    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.storageService.saveThemePreference(this.theme);
      this.notify();
    }

    hasRunningEntry() {
      return this.entries.some((entry) => entry.hasRunningSession());
    }

    startTicking() {
      if (this.tickTimer) {
        clearInterval(this.tickTimer);
      }

      this.tickTimer = setInterval(() => {
        if (this.hasRunningEntry() && !this.isStartTimeEditing) {
          this.notify();
        }
      }, 1000);
    }

    findEntry(entryId) {
      return this.entries.find((entry) => entry.id === entryId) || null;
    }

    persistAndNotify() {
      this.storageService.saveEntries(this.entries.map((entry) => entry.toObject()));
      this.notify();
    }

    getSnapshot() {
      const grouped = this.groupEntriesByDate();
      const globalTotalMs = this.entries.reduce((sum, entry) => sum + entry.totalDurationMs(), 0);

      return {
        theme: this.theme,
        globalTotal: TimeEntry.formatDuration(globalTotalMs),
        grouped,
      };
    }

    groupEntriesByDate() {
      const groupedMap = new Map();

      this.entries.forEach((entry) => {
        if (!groupedMap.has(entry.date)) {
          groupedMap.set(entry.date, {
            date: entry.date,
            dateLabel: TimeEntry.prettyDate(entry.date),
            totalMs: 0,
            byName: {},
            entries: [],
          });
        }

        const duration = entry.totalDurationMs();
        const group = groupedMap.get(entry.date);
        group.totalMs += duration;
        group.byName[entry.name] = (group.byName[entry.name] || 0) + duration;

        const editableSession = entry.getActiveSession() || entry.getLatestSession();
        const startTimeText = editableSession
          ? TimeEntry.formatTimeForInput(editableSession.start)
          : "";

        group.entries.push({
          id: entry.id,
          name: entry.name,
          duration: TimeEntry.formatDuration(duration),
          isRunning: entry.hasRunningSession(),
          canEditStart: Boolean(editableSession),
          startDisplay: editableSession ? `Start: ${startTimeText}` : "Start: --",
          startInputValue: startTimeText,
        });
      });

      return [...groupedMap.values()]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((group) => ({
          ...group,
          dateTotal: TimeEntry.formatDuration(group.totalMs),
          byName: Object.fromEntries(
            Object.entries(group.byName)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([name, ms]) => [name, TimeEntry.formatDuration(ms)])
          ),
        }));
    }
  }

  window.TimeTracker.TimeTrackerViewModel = TimeTrackerViewModel;
})();
