<template>
  <div class="map-dashboard">
    <h2>Map Operations Dashboard</h2>

    <!-- Quick Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>User Roles</h3>
        <p class="stat-value">{{ userRoleMap.size }}</p>
        <p class="stat-description">Active role assignments</p>
      </div>
      <div class="stat-card">
        <h3>Cache Hit Rate</h3>
        <p class="stat-value">{{ cacheStats.hitRate.toFixed(1) }}%</p>
        <p class="stat-description">Performance metric</p>
      </div>
      <div class="stat-card">
        <h3>Word Frequencies</h3>
        <p class="stat-value">{{ wordFrequencies.size }}</p>
        <p class="stat-description">Unique words analyzed</p>
      </div>
      <div class="stat-card">
        <h3>User Groups</h3>
        <p class="stat-value">{{ userGroups.size }}</p>
        <p class="stat-description">Department categories</p>
      </div>
    </div>

    <!-- Map Operations Sections -->
    <div class="dashboard-sections">
      <!-- Basic Map Operations -->
      <section class="dashboard-section">
        <h3>1. Basic Map Operations - User Role Management</h3>
        <div class="section-content">
          <div class="operation-demo">
            <h4>Role Assignment Map</h4>
            <div class="map-display">
              <div v-for="[userId, role] of userRoleMap.entries()" :key="userId" class="map-entry">
                <span class="key">User {{ userId }}</span>
                <span class="arrow">→</span>
                <span class="value" :class="role.toLowerCase()">{{ role }}</span>
              </div>
            </div>
            <div class="controls">
              <button @click="demonstrateBasicOperations" class="demo-button">
                Demo Basic Operations
              </button>
              <button @click="clearUserRoles" class="clear-button">Clear Roles</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Performance Comparison -->
      <section class="dashboard-section">
        <h3>2. Map vs Object Performance</h3>
        <div class="section-content">
          <div class="performance-results">
            <div class="performance-metric">
              <h4>Map Performance</h4>
              <p class="metric-value">{{ performanceResults.mapTime }}ms</p>
            </div>
            <div class="performance-metric">
              <h4>Object Performance</h4>
              <p class="metric-value">{{ performanceResults.objectTime }}ms</p>
            </div>
            <div class="performance-metric">
              <h4>Winner</h4>
              <p class="metric-value winner">{{ performanceResults.winner }}</p>
            </div>
          </div>
          <button @click="runPerformanceTest" class="demo-button">Run Performance Test</button>
        </div>
      </section>

      <!-- Word Frequency Analysis -->
      <section class="dashboard-section">
        <h3>4. Word Frequency Counter</h3>
        <div class="section-content">
          <div class="text-analysis">
            <textarea
              v-model="textInput"
              placeholder="Enter text to analyze word frequencies..."
              class="text-input"
              rows="4"
            ></textarea>
            <button @click="analyzeText" class="demo-button">Analyze Text</button>
          </div>
          <div class="frequency-results">
            <h4>Top Words</h4>
            <div class="word-list">
              <div v-for="[word, count] of topWords" :key="word" class="word-item">
                <span class="word">{{ word }}</span>
                <span class="count">{{ count }}</span>
                <div class="frequency-bar" :style="{ width: `${(count / maxCount) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cache Operations -->
      <section class="dashboard-section">
        <h3>5. In-Memory Cache Implementation</h3>
        <div class="section-content">
          <div class="cache-demo">
            <div class="cache-controls">
              <input v-model="cacheKey" placeholder="Cache key" class="cache-input" />
              <input v-model="cacheValue" placeholder="Cache value" class="cache-input" />
              <button @click="setCacheItem" class="demo-button">Set</button>
              <button @click="getCacheItem" class="demo-button">Get</button>
              <button @click="clearCache" class="clear-button">Clear Cache</button>
            </div>
            <div class="cache-stats">
              <p>Hits: {{ cacheStats.hits }} | Misses: {{ cacheStats.misses }}</p>
              <p>Last Operation: {{ lastCacheOperation }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- User Grouping -->
      <section class="dashboard-section">
        <h3>7. Group Users by Property</h3>
        <div class="section-content">
          <div class="grouping-demo">
            <div class="grouping-controls">
              <select v-model="selectedGroupProperty" class="group-select">
                <option value="gender">Group by Gender</option>
                <option value="department">Group by Department</option>
                <option value="salaryBand">Group by Salary Band</option>
              </select>
              <button @click="groupUsers" class="demo-button">Group Users</button>
            </div>
            <div class="group-results">
              <div
                v-for="[groupName, users] of userGroups.entries()"
                :key="groupName"
                class="group-item"
              >
                <h4>{{ groupName }} ({{ users.length }})</h4>
                <div class="user-list">
                  <span v-for="user in users.slice(0, 3)" :key="user.id" class="user-chip">
                    {{ user.fullName }}
                  </span>
                  <span v-if="users.length > 3" class="more-users">
                    +{{ users.length - 3 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- String Analysis -->
      <section class="dashboard-section">
        <h3>8. First Non-Repeated Character</h3>
        <div class="section-content">
          <div class="string-analysis">
            <input
              v-model="stringInput"
              placeholder="Enter string to find first unique character..."
              class="string-input"
            />
            <button @click="findUniqueChar" class="demo-button">Find Unique</button>
            <div class="analysis-result">
              <p v-if="firstUniqueChar">
                First unique character: <strong>{{ firstUniqueChar }}</strong>
              </p>
              <p v-else-if="stringInput">No unique characters found</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Map Inversion -->
      <section class="dashboard-section">
        <h3>10. Map Inversion with Duplicates</h3>
        <div class="section-content">
          <div class="inversion-demo">
            <div class="original-map">
              <h4>Original: User → Role</h4>
              <div class="map-display small">
                <div
                  v-for="[userId, role] of userRoleMap.entries()"
                  :key="userId"
                  class="map-entry"
                >
                  <span class="key">{{ userId }}</span>
                  <span class="arrow">→</span>
                  <span class="value">{{ role }}</span>
                </div>
              </div>
            </div>
            <button @click="invertRoleMap" class="demo-button">Invert Map</button>
            <div class="inverted-map">
              <h4>Inverted: Role → Users[]</h4>
              <div class="map-display small">
                <div
                  v-for="[role, userIds] of invertedRoleMap.entries()"
                  :key="role"
                  class="map-entry"
                >
                  <span class="key">{{ role }}</span>
                  <span class="arrow">→</span>
                  <span class="value">[{{ userIds.join(', ') }}]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { type User } from '@/types';
import {
  createUserRoleMap,
  setUserRole,
  getUserRole,
  compareMapVsObject,
  countWordFrequencies,
  getTopWords,
  SimpleCache,
  groupUsersByProperty,
  findFirstNonRepeatedChar,
  invertUserRoleMap,
  analyzeStringCharacters,
} from '@/utils/mapOperations';

// Props
const props = defineProps<{ users: User[] }>();

// Reactive state
const userRoleMap = ref(new Map<number, 'Admin' | 'Editor' | 'Viewer'>());
const wordFrequencies = ref(new Map<string, number>());
const userGroups = ref(new Map<string, User[]>());
const invertedRoleMap = ref(new Map<string, number[]>());

// Performance testing
const performanceResults = ref({
  mapTime: 0,
  objectTime: 0,
  winner: 'Not tested',
});

// Cache demo
const cache = ref(new SimpleCache<string, string>());
const cacheKey = ref('');
const cacheValue = ref('');
const lastCacheOperation = ref('');
const cacheStats = ref({ hits: 0, misses: 0, hitRate: 0 });

// Text analysis
const textInput = ref('The quick brown fox jumps over the lazy dog. The dog was lazy.');
const stringInput = ref('swiss');
const firstUniqueChar = ref<string | null>(null);

// User grouping
const selectedGroupProperty = ref<'gender' | 'department' | 'salaryBand'>('gender');

// Computed properties
const topWords = computed(() => {
  // TODO: Implement getTopWords function call
  // Hint: Use getTopWords(wordFrequencies.value, 10)
  return getTopWords(wordFrequencies.value, 10);
});

const maxCount = computed(() => {
  if (topWords.value.length === 0) return 1;
  return Math.max(...topWords.value.map(([, count]) => count));
});

// Methods
const demonstrateBasicOperations = () => {
  // TODO: Implement basic Map operations demo
  // Hint: Use setUserRole to assign roles to sample users
  // Hint: Demonstrate .set(), .get(), .has(), .delete() operations
  console.log('Demo: Basic Map operations');
};

const clearUserRoles = () => {
  // TODO: Clear all user role assignments
  // Hint: Use userRoleMap.value.clear()
  userRoleMap.value.clear();
};

const runPerformanceTest = () => {
  // TODO: Implement performance comparison between Map and Object
  // Hint: Use compareMapVsObject function
  // Hint: Measure time for 10,000+ operations
  console.log('Demo: Performance test');
};

const analyzeText = () => {
  // TODO: Implement text analysis using countWordFrequencies
  // Hint: Call countWordFrequencies(textInput.value)
  // Hint: Update wordFrequencies.value with results
  console.log('Demo: Text analysis');
  wordFrequencies.value = countWordFrequencies(textInput.value);
};

const setCacheItem = () => {
  // TODO: Implement cache set operation
  // Hint: Use cache.value.set(cacheKey.value, cacheValue.value)
  // Hint: Update lastCacheOperation and cacheStats
  console.log('Demo: Cache set');
};

const getCacheItem = () => {
  // TODO: Implement cache get operation
  // Hint: Use cache.value.get(cacheKey.value)
  // Hint: Update lastCacheOperation and cacheStats
  console.log('Demo: Cache get');
};

const clearCache = () => {
  // TODO: Clear cache and reset statistics
  // Hint: Implement cache.clear() method
  console.log('Demo: Cache clear');
};

const groupUsers = () => {
  // TODO: Implement user grouping by selected property
  // Hint: Use groupUsersByProperty(props.users, selectedGroupProperty.value)
  // Hint: Handle different grouping criteria
  console.log('Demo: User grouping');
};

const findUniqueChar = () => {
  // TODO: Implement first unique character finding
  // Hint: Use findFirstNonRepeatedChar(stringInput.value)
  firstUniqueChar.value = findFirstNonRepeatedChar(stringInput.value);
  console.debug('analyzeStringCharacters --> ', analyzeStringCharacters(stringInput.value));
};

const invertRoleMap = () => {
  // TODO: Implement map inversion
  // Hint: Use invertUserRoleMap(userRoleMap.value)
  invertedRoleMap.value = invertUserRoleMap(userRoleMap.value);
};

// Initialize demo data
onMounted(() => {
  // TODO: Initialize demo data for all Map operations
  // Hint: Set up sample user roles, cache items, text analysis
  console.log('Initializing Map Dashboard demo data');
  createUserRoleMap(userRoleMap.value);
});
</script>

<style scoped lang="scss">
.map-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    font-weight: 600;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        opacity: 0.9;
        font-weight: 500;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0.5rem 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .stat-description {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }

  .dashboard-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .dashboard-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #e1e8ed;

      h3 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 1.4rem;
        font-weight: 600;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
      }

      .section-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    }
  }

  // Map Display Styles
  .map-display {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;

    &.small {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .map-entry {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      margin: 0.25rem 0;
      background: white;
      border-radius: 6px;
      border: 1px solid #dee2e6;

      .key {
        font-weight: 600;
        color: #495057;
        min-width: 80px;
      }

      .arrow {
        color: #6c757d;
        font-weight: bold;
      }

      .value {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-weight: 500;

        &.admin {
          background: #dc3545;
          color: white;
        }

        &.editor {
          background: #ffc107;
          color: #212529;
        }

        &.viewer {
          background: #28a745;
          color: white;
        }
      }
    }
  }

  // Button Styles
  .demo-button {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }
  }

  .clear-button {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  // Performance Results
  .performance-results {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1rem 0;

    .performance-metric {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;

      h4 {
        margin: 0 0 0.5rem 0;
        color: #495057;
        font-size: 1rem;
      }

      .metric-value {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
        color: #2c3e50;

        &.winner {
          color: #28a745;
        }
      }
    }
  }

  // Text Analysis
  .text-analysis {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .text-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
    }
  }

  .frequency-results {
    margin-top: 1rem;

    h4 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .word-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .word-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 6px;
        position: relative;

        .word {
          font-weight: 600;
          min-width: 100px;
          color: #495057;
        }

        .count {
          font-weight: bold;
          color: #3498db;
          min-width: 30px;
        }

        .frequency-bar {
          height: 4px;
          background: linear-gradient(90deg, #3498db, #2980b9);
          border-radius: 2px;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }

  // Cache Demo
  .cache-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .cache-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;

      .cache-input {
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        min-width: 150px;

        &:focus {
          outline: none;
          border-color: #3498db;
        }
      }
    }

    .cache-stats {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #dee2e6;

      p {
        margin: 0.25rem 0;
        color: #495057;
      }
    }
  }

  // User Grouping
  .grouping-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .grouping-controls {
      display: flex;
      gap: 1rem;
      align-items: center;

      .group-select {
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background: white;

        &:focus {
          outline: none;
          border-color: #3498db;
        }
      }
    }

    .group-results {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .group-item {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;

        h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .user-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;

          .user-chip {
            background: #3498db;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
          }

          .more-users {
            background: #6c757d;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-style: italic;
          }
        }
      }
    }
  }

  // String Analysis
  .string-analysis {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .string-input {
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
    }

    .analysis-result {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #dee2e6;

      p {
        margin: 0;
        color: #495057;

        strong {
          color: #3498db;
          font-size: 1.2rem;
        }
      }
    }
  }

  // Map Inversion
  .inversion-demo {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;

    .original-map,
    .inverted-map {
      h4 {
        margin-bottom: 0.5rem;
        color: #2c3e50;
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  // Responsive Design
  @media (max-width: 768px) {
    padding: 1rem;

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .performance-results {
      grid-template-columns: 1fr;
    }

    .cache-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .grouping-controls {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
