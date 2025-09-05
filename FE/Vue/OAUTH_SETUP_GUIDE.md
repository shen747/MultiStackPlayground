# Google OAuth Implementation Guide

## Overview
This guide provides step-by-step instructions to implement Google OAuth authentication in your Vue.js application.

## Prerequisites
- Google Cloud Console account
- Vue.js application with Pinia store
- Backend API for token verification

## 1. Google Cloud Console Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select existing project
3. Enter project name and click "Create"

### Step 2: Enable Google Identity Services
1. Navigate to "APIs & Services" > "Library"
2. Search for "Google Identity Services API"
3. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Select "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Save and copy the Client ID

## 2. Frontend Setup

### Step 1: Environment Variables
Create `.env` file in project root:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 2: Add Google OAuth Script
Add to `index.html` in `<head>` section:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Step 3: Install Dependencies
```bash
npm install jwt-decode
```

## 3. Implementation Checklist

### Auth Store (`src/stores/authStore.ts`)
- [ ] `initializeGoogleAuth()` - Initialize Google OAuth
- [ ] `handleGoogleCallback()` - Process OAuth response
- [ ] `signInWithGoogle()` - Trigger sign-in flow
- [ ] `signOutFromGoogle()` - Handle sign-out
- [ ] `verifyGoogleToken()` - Backend verification

### Login View (`src/views/LoginView.vue`)
- [ ] Google Sign-In button component
- [ ] `handleGoogleSignIn()` method
- [ ] Error handling for OAuth failures
- [ ] Loading states during authentication

### Home View (`src/views/HomeView.vue`)
- [ ] Enhanced `handleLogout()` method
- [ ] `clearApplicationData()` cleanup
- [ ] Confirmation dialog for logout
- [ ] Google OAuth sign-out integration

### Main App (`src/main.ts`)
- [ ] `initializeGoogleOAuth()` on app startup
- [ ] Error handling for OAuth initialization

## 4. Backend Requirements

### API Endpoints Needed
```
POST /api/auth/google
- Verify Google token
- Create/update user record
- Return app JWT token

POST /api/auth/logout
- Invalidate tokens
- Clear user session
```

### Token Verification
Backend should verify Google tokens using Google's verification library.

## 5. Security Considerations

### Frontend Security
- Never store sensitive data in localStorage
- Always verify tokens on backend
- Use HTTPS in production
- Implement proper CORS policies

### Backend Security
- Verify Google tokens server-side
- Implement rate limiting
- Use secure session management
- Validate all user inputs

## 6. Testing

### Development Testing
1. Test with localhost URLs
2. Verify token exchange
3. Test logout functionality
4. Check error handling

### Production Testing
1. Test with production URLs
2. Verify SSL certificates
3. Test cross-browser compatibility
4. Performance testing

## 7. Troubleshooting

### Common Issues
- **"Invalid client ID"**: Check environment variables
- **"Unauthorized domain"**: Add domain to Google Console
- **"Token verification failed"**: Check backend implementation
- **"Popup blocked"**: Handle popup blockers

### Debug Steps
1. Check browser console for errors
2. Verify network requests
3. Test with Google OAuth Playground
4. Check backend logs

## 8. Implementation Status

### Current Status
- [ ] Google Cloud Console setup
- [ ] Environment variables configured
- [ ] OAuth script added to index.html
- [ ] Auth store methods implemented
- [ ] Login view updated
- [ ] Logout functionality enhanced
- [ ] Backend API endpoints created
- [ ] Testing completed

### Next Steps
1. Complete Google Cloud Console setup
2. Implement auth store methods
3. Add backend API endpoints
4. Test OAuth flow end-to-end
5. Deploy and test in production

## 9. Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Vue.js Authentication Guide](https://vuejs.org/guide/extras/security.html)
- [Pinia Store Documentation](https://pinia.vuejs.org/)
