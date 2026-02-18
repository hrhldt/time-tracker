# Time Tracker Web App Spec

## Goal
Build a simple web app to track time spent on named entries by date.

## Core Functionality
1. Create a time entry with:
	- Name (required)
	- Date (required)
2. Start and stop a timer for each entry.
	- Start must start/resume the existing entry session.
	- If start time was adjusted manually, pressing start must preserve that adjusted start time.
3. Delete an existing entry.
4. Edit the start time of an existing entry.
	- If the entry is currently running, elapsed time must update correctly after the edit.
	- If the start time is adjusted manually, the adjusted start time must be shown consistently in the UI.
5. Persist all data locally in the browser.
6. Keep and display accumulated tracked time grouped by date.
7. Within each date group, keep accumulated totals separated by entry name.
8. Show a total accumulated time field for each date group.
9. Preserve grouped accumulation across multiple dates.
10. Group the timer section by date.

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
- [] User can create an entry with a required name and date.
- [] User can start and stop timing on any entry.
- [] Start resumes the existing entry session.
- [] If start time was adjusted manually, pressing Start preserves the adjusted start time.
- [] User can delete an existing entry.
- [] User can edit an existing entry start time.
- [] If an entry is running, editing start time updates elapsed time correctly.
- [] If start time is adjusted manually, the adjusted time is shown consistently in the UI.
- [] Entries persist after page reload (local browser storage).
- [] Total tracked time is shown across all entries.
- [] Tracked time is accumulated and displayed in date groups.
- [] Within each date group, totals are separated by entry name.
- [] Each date group shows a total accumulated time field.
- [] Grouped accumulation is preserved across multiple dates.
- [] Timer section is grouped by date.
- [] UI uses custom fonts.
- [] UI supports dark mode.
- [] Implementation is modularized.
- [] Implementation uses object-oriented paradigms.
- [] Implementation follows a Model-View-ViewModel approach.