# Time Tracker

A minimal web app to track time spent on named entries by date.

## Quick Start

This app is plain HTML/CSS/JavaScript and needs no build step.

1. Open `index.html` in your browser.
2. Create an entry with a name and date.
3. Click **Start** / **Stop** to track time.

## Features

- Create entries with required **name** and **date**.
- Start/stop timer per entry.
- Delete an existing entry.
- Edit start time on an existing entry session.
- Running-entry elapsed time updates correctly after start-time edits.
- Local persistence via browser `localStorage`.
- Grouped timer display by date.
- Per-date accumulated totals.
- Per-name accumulated totals within each date group.
- Global total tracked time across all entries.
- Supports dark mode.
- Uses custom fonts.

## Data Storage

The app stores data in the browser only:

- Entries key: `time-tracker-entries-v1`
- Theme key: `time-tracker-theme-v1`

Clear browser site data/local storage to reset.

## Project Structure

- `index.html` – app UI markup and script wiring
- `styles.css` – visual styles, including dark mode
- `app.js` – application bootstrap/composition root
- `src/models/TimeEntry.js` – model layer (entry domain object)
- `src/services/LocalStorageService.js` – persistence service
- `src/viewmodels/TimeTrackerViewModel.js` – MVVM view-model orchestration
- `src/views/TimeTrackerView.js` – view rendering and UI event binding
- `spec/spec.md` – original feature specification

## Architecture

- Modularized JavaScript implementation
- Object-oriented class-based design
- Model-View-ViewModel (MVVM) structure

## Notes

- Time is displayed as `HH:MM:SS`.
- Date grouping is preserved across multiple dates.
- Start resumes the latest existing session for an entry when available.
- For start-time editing, the app edits the active session if running; otherwise it edits the latest session for that entry.
