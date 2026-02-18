window.TimeTracker = window.TimeTracker || {};

(() => {
  class TimeTrackerView {
    constructor({ onCreateEntry, onToggleEntry, onUpdateStartTime, onDeleteEntry, onToggleTheme, onStartTimeEditingChange }) {
      this.onCreateEntry = onCreateEntry;
      this.onToggleEntry = onToggleEntry;
      this.onUpdateStartTime = onUpdateStartTime;
      this.onDeleteEntry = onDeleteEntry;
      this.onToggleTheme = onToggleTheme;
      this.onStartTimeEditingChange = onStartTimeEditingChange;

      this.elements = {
        form: document.getElementById("entryForm"),
        nameInput: document.getElementById("entryName"),
        dateInput: document.getElementById("entryDate"),
        groups: document.getElementById("dateGroups"),
        globalTotal: document.getElementById("globalTotal"),
        themeToggle: document.getElementById("themeToggle"),
        template: document.getElementById("entryRowTemplate"),
      };
    }

    bind() {
      this.elements.form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = this.elements.nameInput.value.trim();
        const date = this.elements.dateInput.value;
        const created = this.onCreateEntry(name, date);

        if (!created) {
          return;
        }

        this.elements.form.reset();
        this.elements.dateInput.value = date;
        this.elements.nameInput.focus();
      });

      this.elements.themeToggle.addEventListener("click", () => {
        this.onToggleTheme();
      });

      this.elements.groups.addEventListener("focusin", (event) => {
        if (event.target.classList.contains("start-time-input")) {
          this.onStartTimeEditingChange(true);
        }
      });

      this.elements.groups.addEventListener("focusout", (event) => {
        if (event.target.classList.contains("start-time-input")) {
          this.onStartTimeEditingChange(false);
        }
      });
    }

    setDefaultDate(isoDate) {
      this.elements.dateInput.value = isoDate;
    }

    render(snapshot) {
      document.body.classList.toggle("dark", snapshot.theme === "dark");
      this.elements.globalTotal.textContent = snapshot.globalTotal;
      this.elements.groups.innerHTML = "";

      if (!snapshot.grouped.length) {
        const empty = document.createElement("div");
        empty.className = "card empty";
        empty.textContent = "No entries yet. Create one to start tracking.";
        this.elements.groups.appendChild(empty);
        return;
      }

      snapshot.grouped.forEach((group) => {
        const card = document.createElement("section");
        card.className = "card";

        const header = document.createElement("div");
        header.className = "date-header";

        const title = document.createElement("h2");
        title.textContent = group.dateLabel;

        const dateTotal = document.createElement("p");
        dateTotal.className = "date-total";
        dateTotal.textContent = `Date total: ${group.dateTotal}`;

        header.append(title, dateTotal);

        const summary = document.createElement("div");
        summary.className = "name-summary";

        Object.entries(group.byName).forEach(([name, total]) => {
          const chip = document.createElement("span");
          chip.className = "name-chip";
          chip.textContent = `${name}: ${total}`;
          summary.appendChild(chip);
        });

        const list = document.createElement("div");
        list.className = "entry-list";

        group.entries.forEach((entry) => {
          const row = this.elements.template.content.firstElementChild.cloneNode(true);

          const nameEl = row.querySelector(".entry-name");
          const startDisplayEl = row.querySelector(".entry-start-display");
          const timeEl = row.querySelector(".entry-time");
          const startStopBtn = row.querySelector(".start-stop-btn");
          const startInput = row.querySelector(".start-time-input");
          const saveStartBtn = row.querySelector(".save-start-btn");
          const deleteEntryBtn = row.querySelector(".delete-entry-btn");

          nameEl.textContent = entry.name;
          startDisplayEl.textContent = entry.startDisplay;
          timeEl.textContent = entry.duration;

          startStopBtn.dataset.running = String(entry.isRunning);
          startStopBtn.textContent = entry.isRunning ? "Stop" : "Start";
          const startHint = "Start resumes latest session and keeps adjusted start time.";
          startStopBtn.title = entry.isRunning ? "Stop current running session." : startHint;
          startStopBtn.setAttribute("aria-label", entry.isRunning ? "Stop current running session" : startHint);
          startStopBtn.addEventListener("click", () => this.onToggleEntry(entry.id));

          startInput.value = entry.startInputValue;
          saveStartBtn.disabled = !entry.canEditStart;
          saveStartBtn.addEventListener("click", () => {
            this.onUpdateStartTime(entry.id, startInput.value);
          });

          deleteEntryBtn.addEventListener("click", () => {
            this.onDeleteEntry(entry.id);
          });

          list.appendChild(row);
        });

        card.append(header, summary, list);
        this.elements.groups.appendChild(card);
      });
    }
  }

  window.TimeTracker.TimeTrackerView = TimeTrackerView;
})();
