<template>
  <div class="analytics-dashboard">
    <h2>User Analytics Dashboard</h2>

    <!-- Quick Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ userStats.headcount }}</p>
      </div>
      <div class="stat-card">
        <h3>Average Salary</h3>
        <p class="stat-value">${{ formatCurrency(userStats.averageSalary) }}</p>
      </div>
      <div class="stat-card">
        <h3>Salary Range</h3>
        <p class="stat-value">
          ${{ formatCurrency(userStats.salaryRange.min) }} - ${{
            formatCurrency(userStats.salaryRange.max)
          }}
        </p>
      </div>
      <div class="stat-card">
        <h3>Top Performers</h3>
        <p class="stat-value">{{ topPerformers.users.length }}</p>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <div class="control-group">
        <label>Filter by Salary Range:</label>
        <input v-model.number="salaryFilter.min" type="number" placeholder="Min Salary" />
        <input v-model.number="salaryFilter.max" type="number" placeholder="Max Salary" />
        <button @click="applyFilters">Apply Filters</button>
      </div>

      <div class="control-group">
        <label>Search Users:</label>
        <input v-model="searchQuery" type="text" placeholder="Search by name or username..." />
      </div>

      <div class="control-group">
        <label>Group By:</label>
        <select v-model="groupBy">
          <option value="gender">Gender</option>
          <option value="salaryBand">Salary Band</option>
          <option value="ageGroup">Age Group</option>
        </select>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery" class="search-results">
      <h3>Search Results ({{ searchResults.results.length }} found)</h3>
      <div class="user-list">
        <div v-for="user in searchResults.highlightedResults" :key="user.id" class="user-item">
          <span>{{ user.fullName }} ({{ user.username }})</span>
          <span class="salary">${{ formatCurrency(user.salary) }}</span>
          <span class="highlights">Matched: {{ user.highlights.join(', ') }}</span>
        </div>
      </div>
    </div>

    <!-- Grouped Data Display -->
    <div class="grouped-data">
      <h3>Users Grouped by {{ groupBy }}</h3>
      <div class="groups-container">
        <div v-for="(users, groupName) in groupedUsers" :key="groupName" class="group-card">
          <h4>{{ groupName }} ({{ users.length }})</h4>
          <div class="group-stats">
            <p>Avg Salary: ${{ formatCurrency(calculateGroupAverage(users)) }}</p>
            <p>Total: ${{ formatCurrency(calculateGroupTotal(users)) }}</p>
          </div>
          <div class="user-preview">
            <span v-for="user in users.slice(0, 3)" :key="user.id" class="user-tag">
              {{ user.fullName }}
            </span>
            <span v-if="users.length > 3" class="more-users">+{{ users.length - 3 }} more</span>
          </div>
        </div>
      </div>
    </div>

    <!-- User Sorting Section -->
    <div class="user-sorting-section">
      <h3>Sorted User List</h3>
      <div class="sorting-controls">
        <div class="sort-options">
          <label>Sort by:</label>
          <select v-model="sortField">
            <option value="id">ID</option>
            <option value="username">Username</option>
            <option value="fullName">Full Name</option>
            <option value="gender">Gender</option>
            <option value="dateOfBirth">Date of Birth</option>
            <option value="salary">Salary</option>
          </select>
        </div>
        <div class="sort-direction">
          <label>Order:</label>
          <select v-model="sortDirection">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button @click="applySorting" class="sort-button">Sort Users</button>
        <button @click="resetSorting" class="reset-button">Reset</button>
      </div>

      <div class="sorted-results">
        <p class="results-info">
          Showing {{ sortedUsersList.length }} users sorted by <strong>{{ sortField }}</strong> ({{
            sortDirection === 'asc' ? 'Ascending' : 'Descending'
          }})
        </p>
        <div class="sorted-users-grid">
          <div v-for="user in sortedUsersList.slice(0, 10)" :key="user.id" class="sorted-user-card">
            <div class="user-header">
              <span class="user-id">#{{ user.id }}</span>
              <span class="user-name">{{ user.fullName }}</span>
            </div>
            <div class="user-details">
              <span class="user-username">@{{ user.username }}</span>
              <span class="user-gender">{{ user.gender }}</span>
              <span class="user-salary">${{ formatCurrency(user.salary) }}</span>
              <span class="user-age">{{ calculateAge(user.dateOfBirth) }} years</span>
            </div>
          </div>
        </div>
        <p v-if="sortedUsersList.length > 10" class="more-results">
          ... and {{ sortedUsersList.length - 10 }} more users
        </p>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="performance-section">
      <h3>Performance Analytics</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <h4>Salary Percentiles</h4>
          <ul>
            <li>25th: ${{ formatCurrency(performanceMetrics.salaryPercentiles.p25) }}</li>
            <li>50th: ${{ formatCurrency(performanceMetrics.salaryPercentiles.p50) }}</li>
            <li>75th: ${{ formatCurrency(performanceMetrics.salaryPercentiles.p75) }}</li>
            <li>90th: ${{ formatCurrency(performanceMetrics.salaryPercentiles.p90) }}</li>
          </ul>
        </div>

        <div class="metric-card">
          <h4>Gender Distribution</h4>
          <ul>
            <li v-for="(count, gender) in performanceMetrics.genderDistribution" :key="gender">
              {{ gender }}: {{ count }} ({{ formatPercentage(count, userStats.headcount) }}%)
            </li>
          </ul>
        </div>

        <div class="metric-card">
          <h4>Age Distribution</h4>
          <ul>
            <li v-for="(count, ageGroup) in performanceMetrics.ageDistribution" :key="ageGroup">
              {{ ageGroup }}: {{ count }} ({{ formatPercentage(count, userStats.headcount) }}%)
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Organization Chart Preview -->
    <div class="org-chart-section">
      <h3>Organization Structure Preview</h3>
      <p class="org-note">
        <strong>Tree Operations Available:</strong>
        The system includes {{ treeOperationsCount }} organizational tree methods for building
        hierarchies, finding reporting chains, calculating team sizes, and managing organizational
        structures.
      </p>
      <div class="org-preview">
        <div class="org-level">
          <div class="org-node ceo">CEO Level (Salary $90k+): {{ ceoLevel.length }} users</div>
        </div>
        <div class="org-level">
          <div class="org-node manager">
            Manager Level (Salary $70k-$90k): {{ managerLevel.length }} users
          </div>
        </div>
        <div class="org-level">
          <div class="org-node employee">
            Employee Level (Salary less than $70k): {{ employeeLevel.length }} users
          </div>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div class="export-section">
      <h3>Data Export</h3>
      <button @click="exportToCSV" class="export-btn">Export to CSV</button>
      <button @click="generateReport" class="export-btn">Generate Report</button>
    </div>

    <!-- Validation Results -->
    <div v-if="validationResults.errors.length > 0" class="validation-section">
      <h3>Data Validation Issues</h3>
      <div class="validation-errors">
        <p v-for="error in validationResults.errors" :key="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { type User } from '@/types';
import {
  calculateUserStatistics,
  groupUsersByCriteria,
  getTopPerformers,
  searchUsers,
  calculatePerformanceMetrics,
  formatUsersForExport,
  validateUsers,
  findUsersByCriteria,
  sortUsers,
} from '@/utils/arrayOperations';

// Props
const props = defineProps<{
  users: User[];
}>();

// Reactive state
const searchQuery = ref('');
const groupBy = ref<'gender' | 'salaryBand' | 'ageGroup'>('gender');
const salaryFilter = ref({ min: 0, max: 200000 });
const filteredUsers = ref<User[]>([]);

// Sorting state
const sortField = ref<keyof User>('id');
const sortDirection = ref<'asc' | 'desc'>('asc');
const sortedUsersList = ref<User[]>([]);

// Initialize filtered users
onMounted(() => {
  filteredUsers.value = props.users;
  sortedUsersList.value = props.users;
});

// Computed properties
const userStats = computed(() => {
  try {
    const stats = calculateUserStatistics(filteredUsers.value);
    // Check if function is implemented (returns non-zero values)
    if (stats.headcount === 0 && filteredUsers.value.length > 0) {
      return {
        totalSalary: 0,
        averageSalary: 0,
        headcount: 0,
        salaryRange: { min: 0, max: 0 },
      };
    }
    return stats;
  } catch {
    return { totalSalary: 0, averageSalary: 0, headcount: 0, salaryRange: { min: 0, max: 0 } };
  }
});

const topPerformers = computed(() => {
  try {
    const performers = getTopPerformers(filteredUsers.value, 5);
    // Check if function returns the "not implemented" message
    if (performers.summary.includes('not implemented')) {
      return { users: [], summary: 'Feature not implemented yet' };
    }
    return performers;
  } catch {
    return { users: [], summary: 'Feature not implemented yet' };
  }
});

const searchResults = computed(() => {
  if (!searchQuery.value) return { results: [], highlightedResults: [] };
  try {
    return searchUsers(filteredUsers.value, searchQuery.value);
  } catch {
    return { results: [], highlightedResults: [] };
  }
});

const groupedUsers = computed(() => {
  try {
    const grouped = groupUsersByCriteria(filteredUsers.value, groupBy.value);
    // Check if function is implemented (returns non-empty object)
    if (Object.keys(grouped).length === 0 && filteredUsers.value.length > 0) {
      return { 'Feature not implemented': filteredUsers.value };
    }
    return grouped;
  } catch {
    return { 'Feature not implemented': filteredUsers.value };
  }
});

const performanceMetrics = computed(() => {
  try {
    const metrics = calculatePerformanceMetrics(filteredUsers.value);
    // Check if function is implemented
    if (metrics.salaryPercentiles.p50 === 0 && filteredUsers.value.length > 0) {
      return {
        salaryPercentiles: { p25: 0, p50: 0, p75: 0, p90: 0 },
        genderDistribution: { 'Not implemented': filteredUsers.value.length },
        ageDistribution: {
          'Young (Under 25)': metrics.ageDistribution['Young (Under 25)'],
          'Mid-Career (25-34)': metrics.ageDistribution['Mid-Career (25-34)'],
          'Experienced (35-44)': metrics.ageDistribution['Experienced (35-44)'],
          'Senior (45+)': metrics.ageDistribution['Senior (45+)'],
        },
        topPerformers: [],
        salaryGrowthPotential: [],
      };
    }
    return metrics;
  } catch {
    return {
      salaryPercentiles: { p25: 0, p50: 0, p75: 0, p90: 0 },
      genderDistribution: {},
      ageDistribution: {},
      topPerformers: [],
      salaryGrowthPotential: [],
    };
  }
});

const validationResults = computed(() => {
  try {
    const results = validateUsers(filteredUsers.value);
    // Check if function is implemented
    if (
      results.valid.length === 0 &&
      results.invalid.length === 0 &&
      filteredUsers.value.length > 0
    ) {
      return { valid: filteredUsers.value, invalid: [], errors: ['Validation not implemented'] };
    }
    return results;
  } catch {
    return { valid: [], invalid: [], errors: ['Validation function error'] };
  }
});

// Tree operations demo
const treeOperationsCount = 20; // Number of tree operations available

const ceoLevel = computed(() => filteredUsers.value.filter((user) => user.salary >= 90000));
const managerLevel = computed(() =>
  filteredUsers.value.filter((user) => user.salary >= 70000 && user.salary < 90000),
);
const employeeLevel = computed(() => filteredUsers.value.filter((user) => user.salary < 70000));

// Helper functions
const formatCurrency = (value: number) => {
  return value > 0 ? value.toLocaleString() : '0';
};

const formatPercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

// Methods
const applyFilters = () => {
  filteredUsers.value = findUsersByCriteria(props.users, {
    minSalary: salaryFilter.value.min || undefined,
    maxSalary: salaryFilter.value.max || undefined,
  });
};

const calculateGroupAverage = (users: User[]): number => {
  if (users.length === 0) return 0;
  return Math.round(users.reduce((sum, user) => sum + user.salary, 0) / users.length);
};

const calculateGroupTotal = (users: User[]): number => {
  return users.reduce((sum, user) => sum + user.salary, 0);
};

const exportToCSV = () => {
  const exportData = formatUsersForExport(filteredUsers.value);
  const blob = new Blob([exportData.csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users-export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

const generateReport = () => {
  const report = `
User Analytics Report
Generated: ${new Date().toLocaleDateString()}

Summary:
- Total Users: ${userStats.value.headcount}
- Average Salary: $${formatCurrency(userStats.value.averageSalary)}
- Salary Range: $${formatCurrency(userStats.value.salaryRange.min)} - $${formatCurrency(userStats.value.salaryRange.max)}
- Top Performers: ${topPerformers.value.users.length}

${topPerformers.value.summary}

Performance Metrics:
- 50th Percentile Salary: $${formatCurrency(performanceMetrics.value.salaryPercentiles.p50)}
- 90th Percentile Salary: $${formatCurrency(performanceMetrics.value.salaryPercentiles.p90)}

Gender Distribution:
${Object.entries(performanceMetrics.value.genderDistribution)
  .map(([gender, count]) => `- ${gender}: ${count}`)
  .join('\n')}

Age Distribution:
${Object.entries(performanceMetrics.value.ageDistribution)
  .map(([age, count]) => `- ${age}: ${count}`)
  .join('\n')}
  `;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'analytics-report.txt';
  a.click();
  window.URL.revokeObjectURL(url);
};

// Sorting methods
const applySorting = () => {
  try {
    // Call the sortUsers function from arrayOperations
    sortedUsersList.value = sortUsers(filteredUsers.value, sortField.value, sortDirection.value);
  } catch (error) {
    console.error('Sorting failed:', error);
    // Fallback to original list if sorting fails
    sortedUsersList.value = [...filteredUsers.value];
  }
};

const resetSorting = () => {
  sortField.value = 'id';
  sortDirection.value = 'asc';
  sortedUsersList.value = [...filteredUsers.value];
};

// Helper function for age calculation
const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  const birthDate = dateOfBirth;
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
};
</script>

<style lang="scss" scoped>
.analytics-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
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

  .controls-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #dee2e6;

    .control-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      &:last-child {
        margin-bottom: 0;
      }

      label {
        font-weight: bold;
        min-width: 150px;
      }

      input,
      select {
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
      }

      button {
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background: #0056b3;
        }
      }
    }
  }

  .search-results,
  .grouped-data,
  .performance-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #dee2e6;

    h3 {
      margin-top: 0;
      color: #333;
    }
  }

  .user-list {
    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;

      .salary {
        font-weight: bold;
        color: #28a745;
      }

      .highlights {
        font-size: 0.8rem;
        color: #6c757d;
      }
    }
  }

  .groups-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;

    .group-card {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #dee2e6;

      h4 {
        margin: 0 0 0.5rem 0;
        color: #495057;
      }

      .group-stats {
        margin-bottom: 0.5rem;

        p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: #6c757d;
        }
      }

      .user-preview {
        .user-tag {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-right: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .more-users {
          font-size: 0.8rem;
          color: #6c757d;
        }
      }
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;

    .metric-card {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #dee2e6;

      h4 {
        margin: 0 0 0.5rem 0;
        color: #495057;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 0.25rem 0;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }

  .org-chart-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #dee2e6;

    .org-note {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      border-left: 4px solid #2196f3;
    }

    .org-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      .org-level {
        width: 100%;
        display: flex;
        justify-content: center;

        .org-node {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          text-align: center;
          min-width: 250px;

          &.ceo {
            background: #ff6b6b;
            color: white;
          }

          &.manager {
            background: #4ecdc4;
            color: white;
          }

          &.employee {
            background: #45b7d1;
            color: white;
          }
        }
      }
    }
  }

  .export-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #dee2e6;
    text-align: center;

    .export-btn {
      padding: 0.75rem 1.5rem;
      margin: 0 0.5rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;

      &:hover {
        background: #218838;
      }
    }
  }

  .validation-section {
    background: #fff3cd;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ffeaa7;

    .validation-errors {
      .error {
        color: #856404;
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: #ffeaa7;
        border-radius: 4px;
      }
    }
  }

  .user-sorting-section {
    margin-top: 2rem;
    padding: 1.5rem;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;

    h3 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .sorting-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      .sort-options,
      .sort-direction {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
          font-weight: 500;
          color: #495057;
        }

        select {
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          background: white;
          min-width: 120px;
        }
      }

      .sort-button,
      .reset-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      }

      .sort-button {
        background: #007bff;
        color: white;

        &:hover {
          background: #0056b3;
        }
      }

      .reset-button {
        background: #6c757d;
        color: white;

        &:hover {
          background: #545b62;
        }
      }
    }

    .sorted-results {
      .results-info {
        margin-bottom: 1rem;
        color: #495057;
        font-size: 0.9rem;
      }

      .sorted-users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;

        .sorted-user-card {
          padding: 1rem;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          transition: all 0.2s;

          &:hover {
            background: #e9ecef;
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .user-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .user-id {
              font-size: 0.8rem;
              color: #6c757d;
              font-weight: 500;
            }

            .user-name {
              font-weight: 600;
              color: #333;
            }
          }

          .user-details {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            font-size: 0.85rem;

            span {
              padding: 0.2rem 0.5rem;
              border-radius: 3px;
              background: white;
              border: 1px solid #dee2e6;
            }

            .user-username {
              color: #007bff;
              font-weight: 500;
            }

            .user-gender {
              color: #6f42c1;
            }

            .user-salary {
              color: #28a745;
              font-weight: 600;
            }

            .user-age {
              color: #fd7e14;
            }
          }
        }
      }

      .more-results {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        margin-top: 1rem;
      }
    }
  }
}
</style>
