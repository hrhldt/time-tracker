# Time Tracker Web App Spec

## Goal
Build a simple web app to track time spent on named entries by date.

## Object Structure
- EntryGroup
	- date
	- entries: Entry[]
- Entry
	- name
	- date
	- timeEntries: TimeEntry[]
- TimeEntry
	- startTime
	- stopTime

## Core Functionality
1. Create an Entry with:
	- name (required)
	- date (required)
2. Start and stop a TimeEntry for each Entry.
	- Start must create a new TimeEntry for that Entry.
	- Stopping a running TimeEntry closes that TimeEntry.
3. Delete an existing entry.
4. Edit the start time of an existing TimeEntry.
	- If the TimeEntry is currently running, elapsed time must update correctly after the edit.
	- If the start time is adjusted manually, the adjusted start time must be shown consistently in the UI.
5. After stopping time, user can edit the stop time of that stopped TimeEntry.
 	- If end time is adjusted manually, elapsed time must update correctly after the edit.
 	- The adjusted end time must be shown consistently in the UI.
6. New Entries with the same name and date must be grouped in one EntryGroup by date.
	- Creating another Entry with the same name and date must reuse the same Entry.
7. One project name can have multiple TimeEntries across different dates.
8. Persist all data locally in the browser.
9. Keep and display accumulated tracked time grouped by date.
10. Within each date group, keep accumulated totals separated by entry name.
11. Show a total accumulated time field for each date group.
12. Preserve grouped accumulation across multiple dates.
13. Group the timer section by date.
14. Only one timer can be active at a time.

## UI/UX Requirements
- Use a modern, clean cool design.
- Use custom fonts.
- Include dark mode.

## Architecture Requirements
- Implementation must be modularized.
- Use object-oriented design paradigms.
- Use a Model-View-ViewModel (MVVM) approach.

## Notes
- Keep implementation minimal and focused on the features above.

## Acceptance Checklist
- [x] Object structure uses EntryGroup -> Entry -> TimeEntry.
- [x] EntryGroup stores Date.
- [x] Entry stores Name and Date.
- [x] TimeEntry stores Start time and Stop time.
- [x] User can create an entry with a required name and date.
- [x] User can start and stop timing on any entry.
- [x] Start creates a new session for the entry.
- [x] Stopping a running session closes that session.
- [x] User can delete an existing entry.
- [x] User can edit an existing entry start time.
- [x] If an entry is running, editing start time updates elapsed time correctly.
- [x] If start time is adjusted manually, the adjusted time is shown consistently in the UI.
- [x] After stopping an entry, user can edit that session end time.
- [x] Editing end time updates elapsed time correctly.
- [x] If end time is adjusted manually, the adjusted time is shown consistently in the UI.
- [x] Creating a new entry with the same name and date reuses the same grouped entry.
- [x] One project name can have entries across multiple dates.
- [x] Entries persist after page reload (local browser storage).
- [x] Total tracked time is shown across all entries.
- [x] Tracked time is accumulated and displayed in date groups.
- [x] Within each date group, totals are separated by entry name.
- [x] Each date group shows a total accumulated time field.
- [x] Grouped accumulation is preserved across multiple dates.
- [x] Timer section is grouped by date.
- [x] Only one timer can be active at a time.
- [x] Starting a timer stops any other currently running timer.
- [x] Currently running timer is visually highlighted in the UI.
- [x] UI uses custom fonts.
- [x] UI supports dark mode.
- [x] Implementation is modularized.
- [x] Implementation uses object-oriented paradigms.
- [x] Implementation follows a Model-View-ViewModel approach.