window.TimeTracker = window.TimeTracker || {};

(() => {
  class TimeEntry {
    constructor({ id, name, date, sessions = [], createdAt = Date.now() }) {
      this.id = id || crypto.randomUUID();
      this.name = String(name || "Untitled");
      this.date = String(date || TimeEntry.todayIsoDate());
      this.createdAt = Number(createdAt || Date.now());
      this.sessions = Array.isArray(sessions)
        ? sessions
            .map((session) => ({
              start: Number(session.start),
              end: session.end == null ? null : Number(session.end),
            }))
            .filter((session) => Number.isFinite(session.start))
        : [];
    }

    static todayIsoDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    static fromObject(raw) {
      return new TimeEntry(raw || {});
    }

    toObject() {
      return {
        id: this.id,
        name: this.name,
        date: this.date,
        createdAt: this.createdAt,
        sessions: this.sessions.map((session) => ({
          start: session.start,
          end: session.end,
        })),
      };
    }

    getActiveSession() {
      return this.sessions.find((session) => session.end == null) || null;
    }

    getLatestSession() {
      return this.sessions.length ? this.sessions[this.sessions.length - 1] : null;
    }

    hasRunningSession() {
      return Boolean(this.getActiveSession());
    }

    toggleTiming() {
      const active = this.getActiveSession();
      const now = Date.now();

      if (active) {
        active.end = now;
        return;
      }

      const latest = this.getLatestSession();
      if (latest && latest.end != null) {
        latest.end = null;
        return;
      }

      this.sessions.push({ start: now, end: null });
    }

    updateStartTime(timeValue) {
      if (!timeValue) {
        return false;
      }

      const session = this.getActiveSession() || this.getLatestSession();
      if (!session) {
        return false;
      }

      const nextStart = TimeEntry.mergeDateAndTime(this.date, timeValue);
      if (!Number.isFinite(nextStart)) {
        return false;
      }

      session.start = session.end == null ? nextStart : Math.min(nextStart, session.end);
      return true;
    }

    totalDurationMs() {
      return this.sessions.reduce((sum, session) => {
        const start = Number(session.start);
        const end = session.end == null ? Date.now() : Number(session.end);

        if (!Number.isFinite(start) || !Number.isFinite(end)) {
          return sum;
        }

        return sum + Math.max(0, end - start);
      }, 0);
    }

    static mergeDateAndTime(dateIso, timeValue) {
      const [hours = 0, minutes = 0, seconds = 0] = String(timeValue)
        .split(":")
        .map(Number);

      const date = new Date(`${dateIso}T00:00:00`);
      if (Number.isNaN(date.getTime())) {
        return NaN;
      }

      date.setHours(hours, minutes, seconds, 0);
      return date.getTime();
    }

    static formatDuration(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (totalSeconds % 60).toString().padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    }

    static formatTimeForInput(timestamp) {
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }

    static prettyDate(dateIso) {
      const date = new Date(`${dateIso}T00:00:00`);
      if (Number.isNaN(date.getTime())) {
        return dateIso;
      }

      return date.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  window.TimeTracker.TimeEntry = TimeEntry;
})();
