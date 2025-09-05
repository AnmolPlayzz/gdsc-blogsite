# GDSC Project - Authentication Setup

This project implements Google OAuth authentication using Lucia Auth and Arctic.js.

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the required values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Application URL
APP_URL=http://localhost:3000

# Google OAuth Configuration (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/gdsc_project

# Session Secret (generate a random string)
SESSION_SECRET=your_session_secret_key_here
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/login/google/callback` (for development)
   - `https://yourdomain.com/login/google/callback` (for production)
7. Copy the Client ID and Client Secret to your `.env.local`

### 3. Database Setup

1. Install PostgreSQL
2. Create a database called `gdsc_project`
3. Update the `DATABASE_URL` in `.env.local`
4. Run the app and visit `/api/init-db` to initialize tables

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Authentication Flow

1. **Login**: User visits `/login` and clicks "Sign in with Google"
2. **OAuth**: Redirects to Google OAuth consent screen
3. **Callback**: Google redirects back to `/login/google/callback`
4. **New User**: If first time, user is redirected to `/choose-role` to select user/admin role
5. **Existing User**: Logged in users are redirected to `/home`
6. **Protected Routes**: `/home` requires authentication
7. **Logout**: Users can logout which clears session

## API Endpoints

- `GET /login/google` - Initiate Google OAuth
- `GET /login/google/callback` - Handle OAuth callback
- `POST /register` - Create new user with selected role
- `GET /api/init-db` - Initialize database tables

## Pages

- `/` - Redirects to login or home based on auth status
- `/login` - Login page with Google OAuth button
- `/choose-role` - Role selection for new users
- `/home` - Protected dashboard page
- `/api/init-db` - Database initialization endpoint

## Technologies Used

- **Next.js 15** with App Router
- **Lucia Auth** for session management
- **Arctic.js** for Google OAuth2
- **PostgreSQL** for data storage
- **TypeScript** for type safety
- **CSS Modules** for styling

## Database Schema

### Users Table
- `id` - Unique user identifier
- `google_id` - Google OAuth ID
- `name` - User's full name
- `email` - User's email address
- `role` - 'user' or 'admin'
- `created_at` - Timestamp

### Sessions Table
- `id` - Session identifier
- `user_id` - Reference to users table
- `expires_at` - Session expiration
- `created_at` - Timestamp

### Temporary Google Users Table
- `id` - Temporary ID for role selection
- `google_id` - Google OAuth ID
- `name` - User's full name
- `email` - User's email address
- `created_at` - Timestamp (auto-cleanup after 30 minutes)