# Personal Portfolio & Blog (React + Vite)

This project is a personal portfolio and blog site built with **React**, **TypeScript**, and **Vite**. It will showcase projects (apps, services, games, designs) and provide a simple MDX-powered blog section for articles.

## Planned Features
- Portfolio project listing & filters
- Individual project detail pages
- MDX blog with tagging
- Dark / Light theme toggle
- Firebase Hosting deployment
- Sitemap generation & basic SEO

## Tech Stack
- React 18 + TypeScript
- Vite 5
- React Router (to be added)
- MDX via `@mdx-js/react` + Vite plugin (to be added)
- Firebase Hosting

## Development
Install dependencies:
```bash
npm install
```
Run dev server:
```bash
npm run dev
```
Build production bundle:
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```

## Firebase (Upcoming)
A `firebase.json` and deployment instructions will be added. Expected steps:
```bash
npm install firebase-tools -g
firebase login
firebase init hosting
firebase deploy
```

## Continuous Deployment (GitHub Actions)

This project supports automatic deployment to Firebase Hosting via GitHub Actions.

### Setup Steps
1. Generate a Firebase CI token:
   ```powershell
   firebase login:ci
   ```
   Copy the token output.
2. Go to your GitHub repo → Settings → Secrets → Actions → New repository secret.
   - Name: `FIREBASE_TOKEN`
   - Value: (paste your token)
3. Push to `main` branch. The workflow in `.github/workflows/deploy.yml` will build and deploy automatically.

See `.github/workflows/deploy.yml` for details.

## CI/CD (Updated Secure Deployment)

The GitHub Action now uses a **Firebase service account** instead of the deprecated `FIREBASE_TOKEN`.

### Create Service Account JSON
1. Go to Google Cloud Console → IAM & Admin → Service Accounts.
2. Create account (or reuse) with role: `Firebase Hosting Admin` (or minimally: `Firebase Hosting Admin` + `Viewer`).
3. Add key → JSON → download.
4. Base64 encode the JSON (optional) OR paste raw JSON as secret value.

### Add Secret to GitHub
- Go to: Repository Settings → Secrets and variables → Actions → New repository secret
- Name: `FIREBASE_SERVICE_ACCOUNT`
- Value: Paste full JSON contents

### Workflow Behavior
- Builds on push to `main`.
- Generates sitemap (`npm run sitemap`).
- Deploys to the live channel of project `piano8283-a9aca`.
- (Optional) For previews, we can add a PR workflow using a `channelId` based on the PR number.

### Example Preview Enhancement (Future)
Add another job (or convert) with:
```
channelId: pr-${{ github.event.pull_request.number }}
expires: 7d
```

Let me know if you’d like that added.

### Authentication Modes
The workflow attempts deployment in this order:
1. Service Account (`FIREBASE_SERVICE_ACCOUNT`) – preferred.
2. Legacy Token (`FIREBASE_TOKEN`) – fallback (deprecated by Firebase).
3. Fails with an instructive message if neither secret exists.

Secrets required:
- `FIREBASE_SERVICE_ACCOUNT`: JSON of a service account with Firebase Hosting Admin.
- `FIREBASE_TOKEN` (optional): Output from `firebase login:ci`.

## Environment Variables
Create a `.env.local` file for Firebase configuration:

```bash
# Copy from .env.example and fill in your Firebase project configuration
cp .env.example .env.local
```

Required environment variables:
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Firebase Setup

This project uses Firebase for hosting and Firestore for the blog backend.

### Getting Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → General → Your apps
4. Copy the config values to `.env.local`

### Database Setup
Firestore is configured with security rules in `firestore.rules`. The rules protect user data and implement role-based access control.

**Database Collections:**
- `users`: User profiles with roles and metadata
- `blogPosts`: Blog posts with privacy settings  
- `messages`: Demo messages for FirestoreDemo component

### Available Components
- `FirestoreDemo`: Test component for reading/writing data
- `BlogAdmin`: CRUD interface for managing blog posts (admin-only)
- `UserManagement`: Interface for managing user roles (admin-only)

### Authentication & Admin Access
The blog system includes role-based access control with database-driven user management:

- **Regular Users**: Can sign in and view public blog posts
- **Admin Users**: Can manage blog posts, view private posts, and manage user roles

**User Management System:**
- User profiles are automatically created in Firestore on first sign-in
- All users start with the "user" role by default
- User roles are stored in the `users` collection in Firestore
- Admins can promote/demote users through the User Management interface

**To become an admin:**
1. Sign in with Google authentication (creates user profile with "user" role)
2. Have an existing admin promote your account to "admin" role via the User Management interface
3. **Bootstrap first admin**: Temporarily add your email to `ADMIN_EMAILS` in `src/utils/permissions.ts`, deploy, sign in, then remove the email from the array

### Blog Post Visibility
- **Public Posts**: Visible to all visitors
- **Private Posts**: Only visible to admin users

### Local Development
1. Ensure `.env.local` is configured with your Firebase credentials
2. Run `npm run dev`
3. Visit the app to test Firebase connectivity
4. Sign in with Google to test authentication features

### Deployment
Firebase rules and hosting are automatically deployed via GitHub Actions when pushing to main branch.

## License
You can choose a license later (MIT recommended for portfolio content). Placeholder for now.
