import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type User } from '@/types';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const login = (username: string, password: string): boolean => {
    //Simulate API Call
    if (username === 'test' && password == 'password') {
      //TODO: Make the real API call and authenticate the user.
      const mockToken = 'mock-jwt-token';
      const mockUser: User = {
        id: 1,
        username: 'test',
        fullName: 'Test User',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        salary: 75000,
      };

      token.value = mockToken;
      user.value = mockUser;
      localStorage.setItem('token', mockToken);
      router.push('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');

    // TODO: Add Google OAuth logout
    // Call signOutFromGoogle() method to properly sign out from Google
    signOutFromGoogle();

    router.push('/login');
  };

  // TODO: Google OAuth Implementation Methods
  // Add these methods to implement Google OAuth authentication

  /**
   * Initialize Google OAuth
   *
   * Implementation Steps:
   * 1. Install Google OAuth library: npm install @google-cloud/oauth2
   * 2. Create Google Cloud Console project and get client ID
   * 3. Add Google OAuth script to index.html:
   *    <script src="https://accounts.google.com/gsi/client" async defer></script>
   * 4. Initialize Google OAuth with your client ID
   * 5. Set up callback URL in Google Console
   *
   * Required Environment Variables:
   * - VITE_GOOGLE_CLIENT_ID=your_google_client_id
   *
   * Google Console Setup:
   * 1. Go to https://console.cloud.google.com/
   * 2. Create new project or select existing
   * 3. Enable Google+ API
   * 4. Create OAuth 2.0 credentials
   * 5. Add authorized redirect URIs (http://localhost:5173 for dev)
   */
  const initializeGoogleAuth = () => {
    // TODO: Initialize Google OAuth
    // Example implementation:
    // window.google.accounts.id.initialize({
    //   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    //   callback: handleGoogleCallback
    // });
  };

  /**
   * Handle Google OAuth Callback
   *
   * Implementation Steps:
   * 1. Decode the JWT token received from Google
   * 2. Extract user information (name, email, picture)
   * 3. Send token to your backend for verification
   * 4. Create user session and store token
   * 5. Redirect to home page
   *
   * Security Notes:
   * - Always verify the token on your backend
   * - Check token expiration
   * - Validate the audience (aud) claim
   */
  const handleGoogleCallback = (response: any) => {
    // TODO: Handle Google OAuth callback
    // Example implementation:
    // try {
    //   const credential = response.credential;
    //   const decoded = jwt_decode(credential);
    //
    //   // Verify token with your backend
    //   const backendResponse = await verifyGoogleToken(credential);
    //
    //   if (backendResponse.success) {
    //     user.value = {
    //       id: decoded.sub,
    //       username: decoded.email,
    //       fullName: decoded.name,
    //       // Map other fields as needed
    //     };
    //     token.value = backendResponse.token;
    //     localStorage.setItem('token', backendResponse.token);
    //     router.push('/');
    //   }
    // } catch (error) {
    //   console.error('Google auth error:', error);
    // }
  };

  /**
   * Initiate Google Sign-In
   *
   * Implementation Steps:
   * 1. Call Google's sign-in prompt
   * 2. Handle user consent
   * 3. Process the returned credential
   *
   * UI Integration:
   * - Add Google Sign-In button to login page
   * - Style according to Google's brand guidelines
   * - Handle loading states
   */
  const signInWithGoogle = () => {
    // TODO: Trigger Google sign-in
    // Example implementation:
    // window.google.accounts.id.prompt((notification) => {
    //   if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
    //     // Fallback to manual sign-in button
    //     window.google.accounts.id.renderButton(
    //       document.getElementById('google-signin-button'),
    //       { theme: 'outline', size: 'large' }
    //     );
    //   }
    // });
  };

  /**
   * Sign out from Google
   *
   * Implementation Steps:
   * 1. Revoke Google access token
   * 2. Clear Google session
   * 3. Clear local storage
   * 4. Redirect to login
   *
   * Security Notes:
   * - Always revoke tokens on logout
   * - Clear all session data
   * - Notify backend of logout
   */
  const signOutFromGoogle = () => {
    // TODO: Sign out from Google
    // Example implementation:
    // if (window.google && window.google.accounts) {
    //   window.google.accounts.id.disableAutoSelect();
    //   // Revoke the token if you have it
    //   if (token.value) {
    //     window.google.accounts.oauth2.revoke(token.value);
    //   }
    // }
  };

  /**
   * Verify Google Token with Backend
   *
   * Implementation Steps:
   * 1. Send Google token to your backend
   * 2. Backend verifies token with Google
   * 3. Backend creates/updates user record
   * 4. Backend returns your app's JWT token
   *
   * Backend Endpoint Example:
   * POST /auth/google
   * Body: { googleToken: string }
   * Response: { success: boolean, token: string, user: User }
   */
  const verifyGoogleToken = async (googleToken: string) => {
    // TODO: Implement backend verification
    // Example implementation:
    // const response = await fetch('/api/auth/google', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ googleToken })
    // });
    // return await response.json();
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    // Google OAuth methods
    initializeGoogleAuth,
    handleGoogleCallback,
    signInWithGoogle,
    signOutFromGoogle,
    verifyGoogleToken,
  };
});
