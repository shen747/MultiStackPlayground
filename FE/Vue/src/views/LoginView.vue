<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Login</h2>
      <BaseInput label="Username" type="text" v-model="username" />
      <!--  
          v-model : Syntactic Sugar that does Two-way binding

          This includes the following two:
          :model-value : One way binding (won't automatically update when the input changes)
          @update:model-value : password = $event (we need to handle this to update the input)
        -->
      <BaseInput label="Username" type="password" v-model="password" />
      <p v-if="error" class="error-message">{{ error }}</p>
      <button type="submit">Login</button>

      <!-- TODO: Add Google OAuth Sign-In Button -->
      <div class="oauth-section">
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Google Sign-In Button Placeholder -->
        <div id="google-signin-button" class="google-signin-placeholder">
          <button type="button" @click="handleGoogleSignIn" class="google-signin-btn">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import BaseInput from '@/components/BaseInput.vue';

const username = ref('test');
const password = ref('password');
const error = ref('');
const authStore = useAuthStore();

const handleLogin = () => {
  error.value = '';
  const success = authStore.login(username.value, password.value);
  if (!success) {
    error.value = 'invalid username or password';
  }
};

// TODO: Google OAuth Implementation
/**
 * Handle Google Sign-In Button Click
 *
 * Implementation Steps:
 * 1. Call authStore.signInWithGoogle() method
 * 2. Handle loading state during authentication
 * 3. Show error messages if authentication fails
 * 4. Redirect to home page on success
 *
 * Required Setup:
 * 1. Add Google OAuth script to index.html
 * 2. Configure environment variables
 * 3. Set up backend API endpoints
 * 4. Test with Google Developer Console
 */
const handleGoogleSignIn = () => {
  // TODO: Implement Google sign-in
  // Example implementation:
  // try {
  //   error.value = '';
  //   // Show loading state
  //   isLoading.value = true;
  //
  //   // Call auth store method
  //   await authStore.signInWithGoogle();
  //
  //   // Success - user will be redirected by auth store
  // } catch (err) {
  //   error.value = 'Google sign-in failed. Please try again.';
  //   console.error('Google auth error:', err);
  // } finally {
  //   isLoading.value = false;
  // }

  // Temporary placeholder
  error.value = 'Google OAuth not implemented yet. Please use regular login.';
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f5f5f5;

  .login-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }

    button[type='submit'] {
      width: 100%;
      padding: 0.75rem;
      margin-top: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #0056b3;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
    }

    .oauth-section {
      margin-top: 1.5rem;

      .divider {
        position: relative;
        text-align: center;
        margin: 1.5rem 0;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #dee2e6;
        }

        span {
          background: white;
          padding: 0 1rem;
          color: #6c757d;
          font-size: 0.875rem;
        }
      }

      .google-signin-placeholder {
        width: 100%;

        .google-signin-btn {
          width: 100%;
          padding: 0.75rem;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #3c4043;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;

          .google-icon {
            width: 18px;
            height: 18px;
          }

          &:hover {
            background: #f8f9fa;
            border-color: #c6c6c6;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          &:focus {
            outline: none;
            border-color: #4285f4;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.25);
          }

          &:active {
            background: #f1f3f4;
          }
        }
      }
    }
  }

  .error-message {
    color: #dc3545;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    text-align: center;
  }
}
</style>
