<template>
  <div class="home-container">
    <div class="home-header">
      <h2>Welcome {{ authStore.user?.fullName }}!</h2>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <div class="home-banner">
      <BannerLayout></BannerLayout>
    </div>

    <div class="home-main">
      <div class="main-tabs">
        <button
          @click="activeTab = 'users'"
          :class="{ active: activeTab === 'users' }"
          class="tab-button"
        >
          User Management
        </button>
        <button
          @click="activeTab = 'analytics'"
          :class="{ active: activeTab === 'analytics' }"
          class="tab-button"
        >
          Analytics Dashboard
        </button>
        <button
          @click="activeTab = 'maps'"
          :class="{ active: activeTab === 'maps' }"
          class="tab-button"
        >
          Map Operations
        </button>
        <button
          @click="activeTab = 'trees'"
          :class="{ active: activeTab === 'trees' }"
          class="tab-button"
        >
          Tree Operations
        </button>
      </div>

      <div v-if="activeTab === 'users'" class="tab-content">
        <p>Here is the List of registered users</p>
        <div v-if="isLoading">Loading users...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else class="users-table">
          <UserTable :users="users || []"></UserTable>
        </div>
      </div>

      <div v-if="activeTab === 'analytics'" class="tab-content">
        <div v-if="isLoading">Loading analytics...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="!users || users.length === 0" class="no-data-message">
          No user data available for analytics.
        </div>
        <AnalyticsDashboard v-else :users="users"></AnalyticsDashboard>
      </div>

      <div v-if="activeTab === 'maps'" class="tab-content">
        <div v-if="isLoading">Loading map operations...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="!users || users.length === 0" class="no-data-message">
          No user data available for map operations.
        </div>
        <MapDashboard v-else :users="users"></MapDashboard>
      </div>

      <div v-if="activeTab === 'trees'" class="tab-content">
        <div v-if="isLoading">Loading tree operations...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="!users || users.length === 0" class="no-data-message">
          No user data available for tree operations.
        </div>
        <TreeOperations v-else :users="users"></TreeOperations>
      </div>
    </div>

    <div class="home-footer"></div>
  </div>
</template>
<script setup lang="ts">
import BannerLayout from '@/components/BannerLayout.vue';
import { useAuthStore } from '@/stores/authStore';
import { fetchUsers } from '@/services/api';
import { onMounted, ref } from 'vue';
import { type User } from '@/types/index';
import UserTable from '@/components/UserTable.vue';
import AnalyticsDashboard from '@/components/AnalyticsDashboard.vue';
import MapDashboard from '@/components/MapDashboard.vue';
import TreeOperations from '@/components/TreeOperations.vue';

const authStore = useAuthStore();
const users = ref<User[] | undefined>();
const isLoading = ref(true);
const error = ref<string | null>(null);
const activeTab = ref<'users' | 'analytics' | 'maps' | 'trees'>('trees');

// TODO: Enhanced Logout Implementation
/**
 * Handle Logout with Improvements
 *
 * Current Issues to Fix:
 * 1. No confirmation dialog - users can accidentally logout
 * 2. No loading state during logout process
 * 3. No cleanup of cached data
 * 4. Google OAuth not properly signed out
 * 5. No success/error feedback
 *
 * Implementation Steps:
 * 1. Add confirmation dialog
 * 2. Show loading state
 * 3. Clear application data
 * 4. Handle Google OAuth sign-out
 * 5. Provide user feedback
 */
const handleLogout = () => {
  // TODO: Implement enhanced logout
  // Example implementation:
  // const confirmed = confirm('Are you sure you want to sign out?');
  // if (confirmed) {
  //   try {
  //     // Clear application data
  //     clearApplicationData();
  //
  //     // Call auth store logout (includes Google OAuth sign-out)
  //     authStore.logout();
  //
  //     // Show success message
  //     console.log('Successfully signed out');
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //   }
  // }

  // Current simple implementation
  authStore.logout();
};

/**
 * Clear Application Data on Logout
 *
 * Implementation Steps:
 * 1. Clear component state
 * 2. Clear cached user data
 * 3. Reset active tab
 * 4. Clear any pending API requests
 * 5. Reset error states
 */
const clearApplicationData = () => {
  // TODO: Implement data cleanup
  // Example implementation:
  // users.value = undefined;
  // isLoading.value = true;
  // error.value = null;
  // activeTab.value = 'users';
  //
  // // Clear any cached data
  // localStorage.removeItem('cached-users');
  // sessionStorage.clear();
};

onMounted(async () => {
  try {
    users.value = await fetchUsers();
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
});
</script>
<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;

  .home-header {
    display: flex;
    .logout-button {
      margin-left: auto;
      height: 30px;
    }
  }

  .home-banner {
    display: flex;
  }

  .home-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .main-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      .tab-button {
        padding: 0.75rem 1.5rem;
        border: 2px solid #007bff;
        background: white;
        color: #007bff;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          background: #f8f9fa;
        }

        &.active {
          background: #007bff;
          color: white;
        }
      }
    }

    .tab-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .error-message {
      color: red;
    }

    .no-data-message {
      color: #6c757d;
      font-style: italic;
      text-align: center;
      padding: 2rem;
    }

    .users-table {
      display: flex;
      width: 100%;
    }
  }

  .home-footer {
    display: flex;
  }
}
</style>
