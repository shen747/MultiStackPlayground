<template>
  <div class="user-table-wrapper">
    <h2>User Management</h2>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ props.users.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Filtered Results</h3>
        <p class="stat-value">{{ sortedUsers.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Currently Viewing</h3>
        <p class="stat-value">{{ visibleUsers.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Sort Order</h3>
        <p class="stat-value">{{ sortKey || 'ID' }} {{ sortDirection === 'asc' ? '↑' : '↓' }}</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <h3>Search Users</h3>
      <BaseInput
        label="Search Users"
        type="text"
        v-model="searchQuery"
        placeholder="Search by username, name, gender, salary, or date..."
      />
      <div class="search-stats">
        <p>Showing {{ visibleUsers.length }} of {{ sortedUsers.length }} users</p>
        <p v-if="searchQuery">Filtered from {{ props.users.length }} total users</p>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-section">
      <h3>User Data Table</h3>
      <div class="table-info">
        <p>Click column headers to sort. Virtual scrolling enabled for performance.</p>
      </div>
      <div
        ref="containerRef"
        class="user-table-container"
        :style="{ height: `${containerHeight}px` }"
        @scroll="handleScroll"
      >
        <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
          <table class="user-table" :style="{ transform: `translateY(${paddingTop}px)` }">
            <thead>
              <tr>
                <th @click="handleSort('id')" class="sortable">
                  ID
                  <span class="sort-indicator" v-if="sortKey === 'id'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="handleSort('username')" class="sortable">
                  Username
                  <span class="sort-indicator" v-if="sortKey === 'username'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="handleSort('fullName')" class="sortable">
                  Full Name
                  <span class="sort-indicator" v-if="sortKey === 'fullName'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="handleSort('gender')" class="sortable">
                  Gender
                  <span class="sort-indicator" v-if="sortKey === 'gender'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="handleSort('dateOfBirth')" class="sortable">
                  Date of Birth
                  <span class="sort-indicator" v-if="sortKey === 'dateOfBirth'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="handleSort('salary')" class="sortable">
                  Salary
                  <span class="sort-indicator" v-if="sortKey === 'salary'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in visibleUsers" :key="user.id" :style="{ height: `${rowHeight}px` }">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.fullName }}</td>
                <td>
                  <span class="gender-badge" :class="user.gender">
                    {{ user.gender }}
                  </span>
                </td>
                <td>
                  <div class="date-info">
                    <div>{{ formatDate(user.dateOfBirth) }}</div>
                    <div class="age-info">({{ calculateAge(user.dateOfBirth) }} years old)</div>
                  </div>
                </td>
                <td class="salary-cell">${{ formatCurrency(user.salary) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type User } from '@/types';
import { ref, computed, watch } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
const props = defineProps<{ users: User[] }>();
const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const searchQuery = ref('');
const sortKey = ref<keyof User | ''>('id');
const sortDirection = ref<'asc' | 'desc'>('asc');

//Since each row is 10px and the container height is 400 we only show 10 users at a time
const rowHeight = 40;
const containerHeight = 400;

const handleScroll = () => {
  if (containerRef.value) scrollTop.value = containerRef.value.scrollTop;
};

const handleSort = (key: keyof User) => {
  if (sortKey.value === key) {
    // Toggle direction if same key
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new key and default to ascending
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.users.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.gender.toLowerCase().includes(query) ||
      user.salary.toString().includes(query) ||
      user.dateOfBirth.toISOString().split('T')[0].includes(query),
  );
});

const sortedUsers = computed(() => {
  if (!sortKey.value) return filteredUsers.value;

  return [...filteredUsers.value].sort((a, b) => {
    const aValue = a[sortKey.value as keyof User];
    const bValue = b[sortKey.value as keyof User];

    let comparison = 0;

    // Handle different data types for proper sorting
    if (sortKey.value === 'id' || sortKey.value === 'salary') {
      // Handle numeric fields
      comparison = (aValue as number) - (bValue as number);
    } else if (sortKey.value === 'dateOfBirth') {
      // Handle date fields
      const dateA = aValue as Date;
      const dateB = bValue as Date;
      comparison = dateA.getTime() - dateB.getTime();
    } else {
      // Handle string fields
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
    }

    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

const startIndex = computed(() => Math.floor(scrollTop.value / rowHeight));
const visibleCount = 10;
const visibleUsers = computed(() =>
  sortedUsers.value.slice(startIndex.value, startIndex.value + visibleCount + 1),
);
const paddingTop = computed(() => startIndex.value * rowHeight);
const totalHeight = computed(() => sortedUsers.value.length * rowHeight);

// Helper functions
const formatCurrency = (value: number) => {
  return value > 0 ? value.toLocaleString() : '0';
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = dateOfBirth;
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
};

// Reset scroll position when sorting changes
watch([sortKey, sortDirection], () => {
  scrollTop.value = 0;
  if (containerRef.value) {
    containerRef.value.scrollTop = 0;
  }
});

// TODO: Virtual Scrolling Performance Improvements
// Add these methods to optimize virtual scrolling for large datasets

/**
 * Optimize Virtual Scrolling Performance
 *
 * Current Issues to Fix:
 * 1. Scroll position jumps when filtering
 * 2. Performance degrades with large datasets (>1000 items)
 * 3. Row height calculation is static
 * 4. No smooth scrolling transitions
 *
 * Implementation Steps:
 * 1. Add dynamic row height calculation
 * 2. Implement scroll position preservation
 * 3. Add buffer zones for smoother scrolling
 * 4. Optimize re-rendering with requestAnimationFrame
 * 5. Add intersection observer for better performance
 */
const optimizeVirtualScrolling = () => {
  // TODO: Implement virtual scrolling optimizations
  // Example improvements:
  // 1. Dynamic row height: measure actual row heights
  // 2. Buffer zones: render extra rows above/below viewport
  // 3. Smooth scrolling: use CSS transforms instead of changing scroll position
  // 4. Debounced scroll handling: reduce scroll event frequency
  // 5. Memory management: cleanup unused DOM elements
};

/**
 * Handle Scroll Position Preservation
 *
 * Issues to Fix:
 * 1. Scroll position resets when data changes
 * 2. No smooth transitions between different data sets
 * 3. User loses their place when filtering/sorting
 *
 * Implementation Steps:
 * 1. Store scroll position before data changes
 * 2. Calculate new scroll position based on data changes
 * 3. Smoothly transition to new position
 * 4. Handle edge cases (filtered data is smaller)
 */
const preserveScrollPosition = () => {
  // TODO: Implement scroll position preservation
  // Example implementation:
  // const currentScrollRatio = scrollTop.value / totalHeight.value;
  // // After data change:
  // const newScrollPosition = currentScrollRatio * newTotalHeight;
  // smoothScrollTo(newScrollPosition);
};

/**
 * Implement Smooth Scrolling
 *
 * Current Issues:
 * 1. Abrupt scroll position changes
 * 2. No visual feedback during transitions
 * 3. Poor user experience on data updates
 *
 * Implementation Steps:
 * 1. Use requestAnimationFrame for smooth animations
 * 2. Add easing functions for natural movement
 * 3. Provide visual feedback during transitions
 * 4. Allow user to interrupt animations
 */
const smoothScrollTo = (targetPosition: number) => {
  // TODO: Implement smooth scrolling
  // Example implementation:
  // const startPosition = scrollTop.value;
  // const distance = targetPosition - startPosition;
  // const duration = 300; // ms
  // const startTime = performance.now();
  //
  // const animateScroll = (currentTime: number) => {
  //   const elapsed = currentTime - startTime;
  //   const progress = Math.min(elapsed / duration, 1);
  //   const easeProgress = easeInOutCubic(progress);
  //
  //   const newPosition = startPosition + (distance * easeProgress);
  //   if (containerRef.value) {
  //     containerRef.value.scrollTop = newPosition;
  //   }
  //
  //   if (progress < 1) {
  //     requestAnimationFrame(animateScroll);
  //   }
  // };
  //
  // requestAnimationFrame(animateScroll);
};

/**
 * Add Intersection Observer for Performance
 *
 * Benefits:
 * 1. Only render visible rows
 * 2. Lazy load row content
 * 3. Reduce memory usage
 * 4. Better performance with large datasets
 *
 * Implementation Steps:
 * 1. Set up intersection observer
 * 2. Track which rows are visible
 * 3. Lazy load row content
 * 4. Cleanup observers on component unmount
 */
const setupIntersectionObserver = () => {
  // TODO: Implement intersection observer
  // Example implementation:
  // const observer = new IntersectionObserver((entries) => {
  //   entries.forEach(entry => {
  //     if (entry.isIntersecting) {
  //       // Load row content
  //       loadRowContent(entry.target);
  //     } else {
  //       // Unload row content to save memory
  //       unloadRowContent(entry.target);
  //     }
  //   });
  // }, {
  //   root: containerRef.value,
  //   rootMargin: '100px', // Load rows 100px before they're visible
  //   threshold: 0.1
  // });
  //
  // // Observe all row elements
  // document.querySelectorAll('.table-row').forEach(row => {
  //   observer.observe(row);
  // });
};

/**
 * Implement Dynamic Row Heights
 *
 * Current Issues:
 * 1. Fixed row height doesn't accommodate varying content
 * 2. Text wrapping breaks layout
 * 3. Different content lengths cause misalignment
 *
 * Implementation Steps:
 * 1. Measure actual row heights after rendering
 * 2. Store height cache for each row
 * 3. Update virtual scrolling calculations
 * 4. Handle height changes dynamically
 */
const calculateDynamicRowHeights = () => {
  // TODO: Implement dynamic row height calculation
  // Example implementation:
  // const rowHeights = new Map<number, number>();
  //
  // const measureRowHeight = (rowIndex: number) => {
  //   const rowElement = document.querySelector(`[data-row-index="${rowIndex}"]`);
  //   if (rowElement) {
  //     const height = rowElement.getBoundingClientRect().height;
  //     rowHeights.set(rowIndex, height);
  //     return height;
  //   }
  //   return rowHeight; // fallback to default
  // };
  //
  // const getTotalHeight = () => {
  //   let total = 0;
  //   for (let i = 0; i < sortedUsers.value.length; i++) {
  //     total += rowHeights.get(i) || rowHeight;
  //   }
  //   return total;
  // };
};
</script>

<style lang="scss" scoped>
.user-table-wrapper {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;

    .stat-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #dee2e6;

      h3 {
        margin: 0 0 0.5rem 0;
        color: #6c757d;
        font-size: 0.9rem;
        text-transform: uppercase;
      }

      .stat-value {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: #007bff;
      }
    }
  }

  .search-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #dee2e6;

    .search-stats {
      margin-top: 1rem;

      p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: #6c757d;
      }
    }
  }

  .table-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #dee2e6;

    .table-info {
      margin-bottom: 1rem;

      p {
        margin: 0;
        font-size: 0.9rem;
        color: #6c757d;
        font-style: italic;
      }
    }

    .user-table-container {
      width: 100%;
      overflow-y: auto;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background: #f8f9fa;

      .user-table {
        width: 100%;
        border-collapse: collapse;
        background: white;

        thead {
          position: sticky;
          top: 0;
          z-index: 10;
        }

        th {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 1rem 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          position: relative;

          &.sortable {
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s ease;

            &:hover {
              background: #e9ecef;
            }

            .sort-indicator {
              margin-left: 0.5rem;
              font-weight: bold;
              color: #007bff;
            }
          }
        }

        td {
          border: 1px solid #dee2e6;
          padding: 0.75rem;
          text-align: left;
          background: white;
          transition: background-color 0.2s ease;

          .gender-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: capitalize;

            &.male {
              background: #e3f2fd;
              color: #1976d2;
            }

            &.female {
              background: #fce4ec;
              color: #c2185b;
            }
          }

          &.salary-cell {
            font-weight: bold;
            color: #28a745;
            text-align: right;
          }

          .date-info {
            .age-info {
              font-size: 0.8rem;
              color: #6c757d;
              font-style: italic;
            }
          }
        }

        tbody tr {
          &:hover {
            background: #f8f9fa;
          }

          &:nth-child(even) {
            background: #fbfbfb;

            &:hover {
              background: #f8f9fa;
            }
          }
        }
      }
    }
  }
}
</style>
