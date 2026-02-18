window.TimeTracker = window.TimeTracker || {};

(() => {
  const { LocalStorageService, TimeTrackerViewModel, TimeTrackerView, TimeEntry } = window.TimeTracker;

  const storage = new LocalStorageService({
    entriesKey: "time-tracker-entries-v1",
    themeKey: "time-tracker-theme-v1",
  });

  const viewModel = new TimeTrackerViewModel(storage);

  const view = new TimeTrackerView({
    onCreateEntry: (name, date) => viewModel.createEntry(name, date),
    onToggleEntry: (entryId) => viewModel.toggleEntry(entryId),
    onUpdateStartTime: (entryId, timeValue) => viewModel.updateEntryStartTime(entryId, timeValue),
    onDeleteEntry: (entryId) => viewModel.deleteEntry(entryId),
    onToggleTheme: () => viewModel.toggleTheme(),
    onStartTimeEditingChange: (isEditing) => viewModel.setStartTimeEditing(isEditing),
  });

  view.bind();
  view.setDefaultDate(TimeEntry.todayIsoDate());
  viewModel.subscribe((snapshot) => view.render(snapshot));
  viewModel.init();
})();
