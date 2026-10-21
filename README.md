# PrepTrack

PrepTrack is a responsive interview-practice tracker built with React, Vite, Tailwind CSS, and Lucide icons. It helps students organize DSA, Git, technical, interview, and machine-coding practice in one place.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or run the configured linter with `npm run lint`.

## Features

- Dashboard statistics and overall completion progress are calculated from the question collection.
- Add, edit, and delete questions; update status directly from the list.
- Search by title, category, or notes, and combine category, status, difficulty, and sorting controls.
- Desktop sidebar navigation and a compact mobile navigation menu.
- Demo sign-in and registration screens; the app stores a demo profile only for the current browser tab.
- Questions are stored as JSON in browser LocalStorage under `preptrack.questions.v1`. Sample questions are created only on the first visit when that key is absent.

LocalStorage belongs to one browser profile on one device. It does not sync data between browsers or devices; clearing browser storage also removes saved questions.

## Demo authentication

There is no authentication backend. Sign-in accepts any valid email and a non-empty password; registration also asks for a name and an 8-character minimum password. Credentials are never saved or verified. Only a demo profile is kept in session storage, and signing out returns to the sign-in screen. Do not use this flow to protect real accounts or sensitive data.
