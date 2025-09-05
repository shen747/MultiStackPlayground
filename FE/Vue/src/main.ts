import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// TODO: Initialize Google OAuth on App Startup
// Add this initialization after the app is mounted

/**
 * Google OAuth Application Setup
 *
 * Required Files to Create/Modify:
 * 1. .env file with VITE_GOOGLE_CLIENT_ID
 * 2. index.html with Google OAuth script
 * 3. Backend API endpoints for token verification
 *
 * Setup Steps:
 * 1. Create Google Cloud Console Project
 * 2. Enable Google Identity Services
 * 3. Create OAuth 2.0 Client ID
 * 4. Configure authorized domains
 * 5. Add environment variables
 */
const initializeGoogleOAuth = () => {
  // TODO: Initialize Google OAuth after DOM is ready
  // Example implementation:
  // if (typeof window !== 'undefined' && window.google) {
  //   const authStore = useAuthStore();
  //   authStore.initializeGoogleAuth();
  // } else {
  //   // Wait for Google script to load
  //   window.addEventListener('load', () => {
  //     if (window.google) {
  //       const authStore = useAuthStore();
  //       authStore.initializeGoogleAuth();
  //     }
  //   });
  // }
};

app.mount('#app');

// TODO: Call OAuth initialization after app is mounted
// initializeGoogleOAuth();
