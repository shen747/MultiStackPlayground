<template>
  <div class="tree-operations-dashboard">
    <h2>BST Operations Dashboard</h2>
    <p class="dashboard-description">
      Binary Search Tree operations for user management based on User IDs
    </p>

    <!-- BST Building Section -->
    <section class="dashboard-section">
      <h3>1. Build User BST by ID</h3>
      <div class="section-content">
        <button @click="buildOrgChart" class="demo-button">Build BST</button>
        <div v-if="organizationRoot" class="org-chart-display">
          <h4>BST Structure Built</h4>
          <div class="org-info">
            <p>
              <strong>Root User:</strong> {{ organizationRoot.user.fullName }} (ID:
              {{ organizationRoot.user.id }})
            </p>
            <p><strong>BST Depth:</strong> {{ organizationDepth }}</p>
            <p><strong>Total Nodes:</strong> {{ totalEmployees }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- User Search Section -->
    <section class="dashboard-section">
      <h3>2. Find User in BST</h3>
      <div class="section-content">
        <div class="search-controls">
          <input
            v-model="searchUserId"
            type="number"
            placeholder="Enter User ID"
            class="search-input"
          />
          <button @click="findUser" class="demo-button">Search BST</button>
        </div>
        <div v-if="foundUser" class="search-result">
          <h4>User Found in BST:</h4>
          <div class="user-card">
            <p><strong>Name:</strong> {{ foundUser.user.fullName }}</p>
            <p><strong>ID:</strong> {{ foundUser.user.id }}</p>
            <p><strong>Salary:</strong> ${{ foundUser.user.salary.toLocaleString() }}</p>
            <p><strong>Has Left Child:</strong> {{ foundUser.leftNode ? 'Yes' : 'No' }}</p>
            <p><strong>Has Right Child:</strong> {{ foundUser.rightNode ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BST Levels Section -->
    <section class="dashboard-section">
      <h3>3. Users by BST Level</h3>
      <div class="section-content">
        <button @click="getUsersLevels" class="demo-button">Get Hierarchy Levels</button>
        <div v-if="usersByLevel.length > 0" class="hierarchy-display">
          <div v-for="(level, index) in usersByLevel" :key="index" class="level-group">
            <h4>Level {{ index }} ({{ level.length }} users)</h4>
            <div class="users-grid">
              <div v-for="user in level" :key="user.id" class="user-chip">
                {{ user.fullName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- In-Order Traversal Section -->
    <section class="dashboard-section">
      <h3>4. In-Order Traversal (Sorted Users)</h3>
      <div class="section-content">
        <button @click="getSortedUsers" class="demo-button">Get Sorted Users by ID</button>
        <div v-if="sortedUsers.length > 0" class="sorted-display">
          <h4>Users in Sorted Order ({{ sortedUsers.length }}):</h4>
          <div class="users-grid">
            <div v-for="user in sortedUsers" :key="user.id" class="user-card">
              <p>
                <strong>{{ user.fullName }}</strong>
              </p>
              <p>ID: {{ user.id }}</p>
              <p>Salary: ${{ user.salary.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BST Children Section -->
    <section class="dashboard-section">
      <h3>5. BST Node Children</h3>
      <div class="section-content">
        <div class="reports-controls">
          <input
            v-model="managerId"
            type="number"
            placeholder="Node User ID"
            class="search-input"
          />
          <button @click="getReports" class="demo-button">Get Node Children</button>
        </div>
        <div v-if="directReports.length > 0" class="reports-display">
          <h4>BST Children ({{ directReports.length }}):</h4>
          <div class="users-grid">
            <div v-for="user in directReports" :key="user.id" class="user-card">
              <p>
                <strong>{{ user.fullName }}</strong>
              </p>
              <p>ID: {{ user.id }}</p>
              <p>Salary: ${{ user.salary.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Size Section -->
    <section class="dashboard-section">
      <h3>5. Calculate Team Size</h3>
      <div class="section-content">
        <div class="team-controls">
          <input
            v-model="teamManagerId"
            type="number"
            placeholder="Manager ID"
            class="search-input"
          />
          <button @click="calculateTeam" class="demo-button">Calculate Team Size</button>
        </div>
        <div v-if="teamSize > 0" class="team-result">
          <h4>Team Size: {{ teamSize }} employees</h4>
        </div>
      </div>
    </section>

    <!-- Salary Range Search Section -->
    <section class="dashboard-section">
      <h3>6. Find Users by Salary Range</h3>
      <div class="section-content">
        <div class="salary-controls">
          <input v-model="minSalary" type="number" placeholder="Min Salary" class="search-input" />
          <input v-model="maxSalary" type="number" placeholder="Max Salary" class="search-input" />
          <button @click="findBySalary" class="demo-button">Find Users</button>
        </div>
        <div v-if="salaryRangeUsers.length > 0" class="salary-results">
          <h4>Users in Salary Range ({{ salaryRangeUsers.length }}):</h4>
          <div class="users-grid">
            <div v-for="user in salaryRangeUsers" :key="user.id" class="user-card">
              <p>
                <strong>{{ user.fullName }}</strong>
              </p>
              <p>Salary: ${{ user.salary.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reporting Chain Section -->
    <section class="dashboard-section">
      <h3>7. Reporting Chain</h3>
      <div class="section-content">
        <div class="chain-controls">
          <input v-model="chainUserId" type="number" placeholder="User ID" class="search-input" />
          <button @click="getChain" class="demo-button">Get Reporting Chain</button>
        </div>
        <div v-if="reportingChain.length > 0" class="chain-display">
          <h4>Reporting Chain:</h4>
          <div class="chain-path">
            <div v-for="(user, index) in reportingChain" :key="user.id" class="chain-item">
              <div class="user-card">
                <p>
                  <strong>{{ user.fullName }}</strong>
                </p>
                <p>ID: {{ user.id }}</p>
              </div>
              <div v-if="index < reportingChain.length - 1" class="chain-arrow">↑</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Peers Section -->
    <section class="dashboard-section">
      <h3>8. Find Peers</h3>
      <div class="section-content">
        <div class="peers-controls">
          <input v-model="peersUserId" type="number" placeholder="User ID" class="search-input" />
          <button @click="findUserPeers" class="demo-button">Find Peers</button>
        </div>
        <div v-if="peers.length > 0" class="peers-display">
          <h4>Peers ({{ peers.length }}):</h4>
          <div class="users-grid">
            <div v-for="user in peers" :key="user.id" class="user-card">
              <p>
                <strong>{{ user.fullName }}</strong>
              </p>
              <p>ID: {{ user.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Organization Report Section -->
    <section class="dashboard-section">
      <h3>9. Organization Report</h3>
      <div class="section-content">
        <button @click="generateReport" class="demo-button">Generate Report</button>
        <div v-if="orgReport" class="report-display">
          <h4>Organization Report:</h4>
          <div class="report-stats">
            <div class="stat-item">
              <strong>Total Employees:</strong> {{ orgReport.totalEmployees }}
            </div>
            <div class="stat-item">
              <strong>Management Levels:</strong> {{ orgReport.managementLevels }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Organization Validation Section -->
    <section class="dashboard-section">
      <h3>10. Validate Organization</h3>
      <div class="section-content">
        <button @click="validateOrg" class="demo-button">Validate Structure</button>
        <div v-if="validationResult !== null" class="validation-result">
          <h4>Validation Result:</h4>
          <div :class="['validation-status', validationResult ? 'valid' : 'invalid']">
            {{
              validationResult
                ? 'Organization structure is valid'
                : 'Organization structure has issues'
            }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type User } from '@/types';
import {
  UserTreeNode,
  findUserInBST,
  getInOrderTraversal,
  getUsersByLevel,
  getBSTDepth,
  buildUserBST,
  getBSTNodeChildren,
  countSubtreeNodes,
  findUsersBySalaryRange,
  validateBSTStructure,
  generateBSTReport,
} from '@/utils/treeOperations';

// Props
const props = defineProps<{
  users: User[];
}>();

// Reactive state
const organizationRoot = ref<UserTreeNode | null>(null);
const organizationDepth = ref<number>(0);
const totalEmployees = ref<number>(0);

// Search states
const searchUserId = ref<number>(1);
const foundUser = ref<UserTreeNode | null>(null);

// Hierarchy states
const usersByLevel = ref<User[][]>([]);

// Sorted users states
const sortedUsers = ref<User[]>([]);

// Direct reports states
const managerId = ref<number>(1);
const directReports = ref<User[]>([]);

// Team size states
const teamManagerId = ref<number>(1);
const teamSize = ref<number>(0);

// Salary range states
const minSalary = ref<number>(50000);
const maxSalary = ref<number>(100000);
const salaryRangeUsers = ref<User[]>([]);

// Reporting chain states
const chainUserId = ref<number>(1);
const reportingChain = ref<User[]>([]);

// Peers states
const peersUserId = ref<number>(1);
const peers = ref<User[]>([]);

// Organization report states
const orgReport = ref<any>(null);

// Validation states
const validationResult = ref<boolean | null>(null);

// Methods
const buildOrgChart = () => {
  console.log('Building BST...');
  organizationRoot.value = buildUserBST(props.users);
  if (organizationRoot.value) {
    organizationDepth.value = getBSTDepth(organizationRoot.value);
    totalEmployees.value = props.users.length;
  }
  console.log('BST built:', organizationRoot.value);
};

const findUser = () => {
  console.log('Finding user with ID:', searchUserId.value);
  foundUser.value = findUserInBST(organizationRoot.value, searchUserId.value);
  console.log('Found user:', foundUser.value);
};

const getUsersLevels = () => {
  console.log('Getting users by BST levels...');
  usersByLevel.value = getUsersByLevel(organizationRoot.value);
  console.log('Users by level:', usersByLevel.value);
};

const getSortedUsers = () => {
  console.log('Getting sorted users via in-order traversal...');
  sortedUsers.value = getInOrderTraversal(organizationRoot.value);
  console.log('Sorted users:', sortedUsers.value);
};

const getReports = () => {
  console.log('Getting BST children for user ID:', managerId.value);
  directReports.value = getBSTNodeChildren(organizationRoot.value, managerId.value);
  console.log('BST children:', directReports.value);
};

const calculateTeam = () => {
  console.log('Calculating subtree nodes for user ID:', teamManagerId.value);
  teamSize.value = countSubtreeNodes(organizationRoot.value, teamManagerId.value);
  console.log('Subtree size:', teamSize.value);
};

const findBySalary = () => {
  console.log('Finding users by salary range:', minSalary.value, '-', maxSalary.value);
  salaryRangeUsers.value = findUsersBySalaryRange(
    organizationRoot.value,
    minSalary.value,
    maxSalary.value,
  );
  console.log('Users in salary range:', salaryRangeUsers.value);
};

const getChain = () => {
  console.log('Getting path to root for user ID:', chainUserId.value);
  // This function doesn't exist in BST - we'll implement a simple path to root
  const node = findUserInBST(organizationRoot.value, chainUserId.value);
  if (node) {
    reportingChain.value = [node.user]; // Just the user itself for now
  } else {
    reportingChain.value = [];
  }
  console.log('Path to root:', reportingChain.value);
};

const findUserPeers = () => {
  console.log('Finding nodes at same level as user ID:', peersUserId.value);
  // For BST, peers would be nodes at the same level
  const levels = getUsersByLevel(organizationRoot.value);
  const userNode = findUserInBST(organizationRoot.value, peersUserId.value);
  if (userNode) {
    // Find which level the user is on and return other users at that level
    for (let i = 0; i < levels.length; i++) {
      const levelUsers = levels[i];
      if (levelUsers.some((user) => user.id === peersUserId.value)) {
        peers.value = levelUsers.filter((user) => user.id !== peersUserId.value);
        break;
      }
    }
  } else {
    peers.value = [];
  }
  console.log('Peers:', peers.value);
};

const generateReport = () => {
  console.log('Generating BST report...');
  orgReport.value = generateBSTReport(organizationRoot.value);
  console.log('BST report:', orgReport.value);
};

const validateOrg = () => {
  console.log('Validating BST structure...');
  validationResult.value = validateBSTStructure(organizationRoot.value);
  console.log('Validation result:', validationResult.value);
};

// Initialize on mount
onMounted(() => {
  if (props.users && props.users.length > 0) {
    buildOrgChart();
  }
});
</script>

<style scoped>
.tree-operations-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-description {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.dashboard-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-section h3 {
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

.section-content {
  margin-top: 15px;
}

.demo-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.demo-button:hover {
  background: #0056b3;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 150px;
}

.search-controls,
.reports-controls,
.team-controls,
.salary-controls,
.chain-controls,
.peers-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.org-chart-display,
.search-result,
.hierarchy-display,
.reports-display,
.team-result,
.salary-results,
.chain-display,
.peers-display,
.report-display,
.validation-result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.org-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.user-card {
  background: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.user-chip {
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin: 2px;
  display: inline-block;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.level-group {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.level-group h4 {
  color: #007bff;
  margin-bottom: 10px;
}

.chain-path {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.chain-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chain-arrow {
  font-size: 24px;
  color: #007bff;
  margin: 5px 0;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.validation-status {
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
}

.validation-status.valid {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.validation-status.invalid {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .tree-operations-dashboard {
    padding: 10px;
  }

  .search-controls,
  .reports-controls,
  .team-controls,
  .salary-controls,
  .chain-controls,
  .peers-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
    margin-right: 0;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }
}
</style>
