# Fionetix Employee Registry — Frontend

React 19 single-page application for the Fionetix Employee & Family Registry. Provides a full CRUD interface for employee management, global search, role-based access control, and PDF export triggers, backed by the Fionetix ASP.NET Core API.

**Live URL:** https://fionetix-task-project.web.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | TailwindCSS v4 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Authentication | Firebase Auth (Email/Password + Google Sign-In) |
| Notifications | react-hot-toast |
| Deployment | Firebase Hosting |

---

## Features

### Authentication
- **Email/Password login** via Firebase Authentication
- **Google Sign-In** via Firebase OAuth popup — new Google users are automatically provisioned as `Viewer`
- Firebase JWT token is attached to every API request via an Axios request interceptor
- Protected routes redirect unauthenticated users to `/login`
- Demo credentials pre-filled on the login page for quick testing

### Role-Based UI
- **Admin** — sees Add, Edit, and Delete buttons; can access the employee form
- **Viewer** — read-only; Add/Edit/Delete buttons are hidden; form routes return a 403 page
- Role is fetched from `GET /api/auth/me` after login and stored in `AuthContext`

### Employee List (`/dashboard/employees`)
- Displays all employees in a responsive table (desktop) and card grid (mobile)
- **Debounced search** (400 ms) filters by name, NID, or department in real time
- Search bar has a clear (×) button to reset instantly
- Color-coded department badges for quick visual scanning
- Action buttons always visible (not hover-only) for better UX
- Skeleton loaders during data fetch
- Empty state message when no results match

### Employee Detail (`/dashboard/employees/:id`)
- Full employee profile: name, NID, phone, department, basic salary
- Spouse section — shows name and NID, or "No spouse on record"
- Children section — table of names and dates of birth, or "No children on record"
- **Export CV (PDF)** button — triggers `GET /api/export/cv/:id` and downloads the file
- Edit button visible to Admins only

### Employee Form (`/dashboard/employees/add` and `/dashboard/employees/:id/edit`)
- **Three-section form:** Employee Details, Spouse (optional), Children (optional)
- Spouse section toggled by a checkbox; disappears when unchecked
- Children section supports dynamic add/remove rows
- Client-side validation mirrors backend rules:
  - NID: exactly 10 or 17 digits
  - Phone: Bangladesh format (`+8801XXXXXXXXX` or `01XXXXXXXXX`)
  - Basic salary: must be greater than 0
  - Child date of birth: must not be in the future
- On create: POST employee → PUT spouse (if toggled) → POST each child
- On edit: diffs existing data; upserts or deletes spouse/children as needed

### PDF Export
- **Export Table (PDF)** on the list page — downloads a PDF of the currently filtered employee list, respecting the active search term
- **Export CV (PDF)** on the detail page — downloads a full CV for one employee including spouse and children

### Dashboard Layout
- **Collapsible sidebar** — collapses to icon-only mode on desktop; hamburger toggle in the top bar
- **Mobile drawer** — slides in from the left with an overlay backdrop
- **Dark / Light mode toggle** in the top bar — persists to `localStorage`, defaults to `prefers-color-scheme`
- **User avatar** in the top bar — shows Google profile photo (with `referrerPolicy="no-referrer"`) or an initial-letter fallback
- Smooth fade-in and slide-up animations on page transitions
- Skeleton loaders for all async data states

---

## Project Structure

```
client/
├── public/
│   └── favicon.svg               # Custom "F" icon
├── src/
│   ├── components/
│   │   └── LoadingSpinner.jsx    # SkeletonRow, SkeletonCard, PageLoader
│   ├── context/
│   │   ├── AuthContext.jsx       # Firebase auth state + role
│   │   └── ThemeContext.jsx      # Dark/light mode with localStorage
│   ├── firebase/
│   │   └── firebase.init.js      # Firebase app, auth, googleProvider
│   ├── hooks/
│   │   └── useDebounce.js        # Debounce hook (400 ms default)
│   ├── layouts/
│   │   ├── AuthLayout.jsx        # Centered card for login page
│   │   └── DashboardLayout.jsx   # Sidebar + topbar + mobile drawer
│   ├── pages/
│   │   ├── Auth/
│   │   │   └── Login.jsx         # Email/password + Google sign-in
│   │   ├── Employees/
│   │   │   ├── EmployeeList.jsx  # Search, table, card grid, PDF export
│   │   │   ├── EmployeeDetail.jsx# Profile, family info, CV export
│   │   │   └── EmployeeForm.jsx  # Add / Edit with spouse + children sub-forms
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js                # Axios instance + PDF download helpers
│   ├── router.jsx                # Routes with ProtectedRoute + AdminRoute
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                 # TailwindCSS v4 + dark mode + animations
├── .env.example
├── firebase.json                 # Firebase Hosting config (SPA rewrite)
├── .firebaserc
└── package.json
```

---

## Prerequisites

- Node.js 20+
- npm 10+
- A running instance of the Fionetix backend API (see `server/README.md`)
- A Firebase project with **Email/Password** and **Google** sign-in providers enabled

---

## Local Development Setup

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Firebase config values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start the development server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@fionetix.com | Admin@123 |
| Viewer | viewer@fionetix.com | Viewer@123 |

Or use **Sign in with Google** — Google users are automatically granted Viewer access.

---

## Build for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

---

## Deploy to Firebase Hosting

```bash
npm run build
npx firebase deploy --only hosting
```

Ensure `firebase.json` and `.firebaserc` are configured for your project. The `**` rewrite rule in `firebase.json` handles client-side routing.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (no trailing slash) |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
