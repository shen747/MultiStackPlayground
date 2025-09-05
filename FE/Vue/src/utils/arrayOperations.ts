import { fetchUserData, fetchUsers } from '@/services/api';
import { type User } from '@/types';

/**
 * 1. Basic Filtering: Filter Active Users
 * Returns users who meet specific criteria (e.g., salary above threshold)
 *
 * Implementation Steps:
 * 1. Use array.filter() method to create a new array
 * 2. Create a predicate function that returns true for users to keep
 * 3. Check if user.salary is greater than or equal to minSalary
 * 4. Return the filtered array
 *
 * Business Value: Helps HR identify high-performing employees for promotions/bonuses
 * Example: getActiveUsers(users, 60000) returns all users earning $60k+
 */
function getActiveUsers(users: User[], minSalary: number = 50000): User[] {
  // TODO: Implement filtering logic using array.filter()
  const filteredActiveUsers = users.filter((user: User) => {
    return user.salary > minSalary;
  });
  return filteredActiveUsers;
}

/**
 * 2. Complex Filtering: Multi-Criteria User Search
 * Find users matching multiple criteria (gender, salary range, age range)
 *
 * Implementation Steps:
 * 1. Use array.filter() with a complex predicate function
 * 2. Calculate user age from dateOfBirth using Date objects
 * 3. Check each criteria property if it exists (optional parameters)
 * 4. Use logical AND (&&) to combine multiple conditions
 * 5. Return false if any criteria fails, true if all pass
 *
 * Business Value: Enables targeted HR analysis and demographic reporting
 * Example: findUsersByCriteria(users, { gender: 'female', minSalary: 70000 })
 */
function findUsersByCriteria(
  users: User[],
  criteria: {
    gender?: 'male' | 'female';
    minSalary?: number;
    maxSalary?: number;
    minAge?: number;
    maxAge?: number;
  },
): User[] {
  // TODO: Implement complex filtering with multiple business rules
  // Hint: Calculate age = currentYear - birthYear
  // Hint: Use optional chaining or conditional checks for criteria
  const usersWithComplexCrit = users.filter((user: User) => {
    const age = new Date().getFullYear() - user.dateOfBirth.getFullYear();
    const minSalary = criteria.minSalary || 0;
    const maxSalary = criteria.maxSalary || 0;
    const minAge = criteria.minAge || 0;
    const maxAge = criteria.maxAge || 0;

    if (
      user.gender === criteria.gender &&
      minSalary < user.salary &&
      maxSalary > user.salary &&
      minAge < age &&
      maxAge > age
    ) {
      return user;
    }
  });
  return usersWithComplexCrit;
}

/**
 * 3. Data Transformation: Extract User Display Names
 * Transform user objects into display-ready format for UI components
 *
 * Implementation Steps:
 * 1. Use array.map() to transform each user object
 * 2. Return a new string for each user combining fullName and username
 * 3. Use template literals for clean string formatting
 * 4. Return array of strings suitable for dropdowns/select lists
 *
 * Business Value: Essential for UI components that need simple string arrays
 * Example: getUserDisplayNames(users) returns ["John Doe (john_doe)", "Jane Smith (jane_smith)"]
 */
function getUserDisplayNames(users: User[]): string[] {
  // TODO: Use array.map() to transform user objects to display strings
  // Hint: Use template literals `${user.fullName} (${user.username})`
  const userDisplayNames = users.map((user: User) => {
    return `${user.fullName} - ${user.username}`;
  });
  return userDisplayNames;
}

/**
 * 4. Aggregation: Calculate Department Statistics
 * Calculate total salary, average salary, and headcount
 *
 * Implementation Steps:
 * 1. Handle edge case: return zeros if users array is empty
 * 2. Use array.reduce() to sum all salaries (accumulator pattern)
 * 3. Use array.map() to extract salary values into separate array
 * 4. Calculate average by dividing total by count
 * 5. Use Math.min() and Math.max() with spread operator for salary range
 * 6. Return object with all calculated statistics
 *
 * Business Value: Critical for HR reporting and budget planning
 * Example: calculateUserStatistics(users) returns { totalSalary: 1500000, averageSalary: 75000, ... }
 */
function calculateUserStatistics(users: User[]): {
  totalSalary: number;
  averageSalary: number;
  headcount: number;
  salaryRange: { min: number; max: number };
} {
  if (users.length > 0) {
    const userStats = {
      totalSalary: 0,
      averageSalary: 0,
      headcount: 0,
      salaryRange: { min: 0, max: 0 },
    };
    const salaries = users.map((user: User) => user.salary);

    userStats.headcount = users.length;
    userStats.totalSalary = salaries.reduce((acc: number, salary: number) => {
      return (acc += salary);
    });
    userStats.averageSalary = userStats.totalSalary / userStats.headcount;
    userStats.salaryRange = { min: Math.min(...salaries), max: Math.max(...salaries) };

    return userStats;
  } else {
    return { totalSalary: 0, averageSalary: 0, headcount: 0, salaryRange: { min: 0, max: 0 } };
  }
}

/**
 * 5. Advanced Grouping: Group Users by Criteria
 * Group users by gender, salary bands, or age groups
 *
 * Implementation Steps:
 * 1. Use array.reduce() with an empty object {} as initial accumulator
 * 2. For each user, determine the group key based on groupBy parameter
 * 3. Use switch statement to handle different grouping criteria
 * 4. For salary bands: use if/else if chains to categorize salary ranges
 * 5. For age groups: calculate age from dateOfBirth and categorize
 * 6. Check if group key exists in accumulator, create empty array if not
 * 7. Push user to appropriate group array
 * 8. Return accumulator for next iteration
 *
 * Business Value: Enables demographic analysis and reporting for HR insights
 * Example: groupUsersByCriteria(users, 'salaryBand') returns { 'Entry Level': [...], 'Senior Level': [...] }
 */
function groupUsersByCriteria(
  users: User[],
  groupBy: 'gender' | 'salaryBand' | 'ageGroup',
): Record<string, User[]> {
  // TODO: Use array.reduce() with switch statement for flexible grouping
  // Hint: Calculate age = currentYear - birthYear for ageGroup
  // Hint: Use salary thresholds: <60k, 60k-80k, 80k-100k, 100k+
  const userGroups = users.reduce((accumulator: Record<string, User[]>, user: User) => {
    let groupKey: string;

    switch (groupBy) {
      case 'gender':
        groupKey = user.gender;
        break;
      case 'salaryBand':
        if (user.salary < 60000) {
          groupKey = 'Entry Level (<$60k)';
        } else if (user.salary < 80000) {
          groupKey = 'Mid Level ($60k-$80k)';
        } else if (user.salary < 100000) {
          groupKey = 'Senior Level ($80k-$100k)';
        } else {
          groupKey = 'Executive Level ($100k+)';
        }
        break;
      case 'ageGroup':
        const age = new Date().getFullYear() - user.dateOfBirth.getFullYear();
        if (age < 25) {
          groupKey = 'Young (Under 25)';
        } else if (age < 35) {
          groupKey = 'Mid-Career (25-34)';
        } else if (age < 45) {
          groupKey = 'Experienced (35-44)';
        } else {
          groupKey = 'Senior (45+)';
        }
        break;
      default:
        groupKey = 'Unknown';
    }

    // Initialize group if it doesn't exist
    if (!accumulator[groupKey]) {
      accumulator[groupKey] = [];
    }

    // Add user to the appropriate group
    accumulator[groupKey].push(user);

    return accumulator;
  }, {});

  return userGroups;
}

/**
 * 6. Robust Sorting: Multi-Field User Sorting
 * Clean, reusable sorting function for any user field
 *
 * Implementation Steps:
 * 1. Create immutable copy using spread operator [...users]
 * 2. Calculate direction multiplier: 1 for 'asc', -1 for 'desc'
 * 3. Use array.sort() with custom compare function
 * 4. Extract values to compare using bracket notation a[sortBy]
 * 5. Handle different data types: strings use localeCompare(), numbers use subtraction
 * 6. For dates, convert to Date objects and compare timestamps
 * 7. Multiply comparison result by direction for asc/desc
 *
 * Business Value: Replaces buggy sorting code, handles all User fields correctly
 * Example: sortUsers(users, 'salary', 'desc') returns users sorted by salary descending
 */
function sortUsers(users: User[], sortBy: keyof User, order: 'asc' | 'desc' = 'asc'): User[] {
  // TODO: Implement robust sorting with proper type handling
  // Hint: Use [...users] for immutable copy, localeCompare() for strings
  // Hint: Handle dates by converting to Date objects and comparing getTime()
  const sortDirectionMultiplier = order === 'asc' ? 1 : -1;

  const sortedUsers = [...users].sort((a: User, b: User) => {
    if (sortBy === 'id') {
      const idA = a.id;
      const idB = b.id;
      return (idA - idB) * sortDirectionMultiplier;
    }

    if (sortBy === 'username') {
      const userNameA = a.username;
      const userNameB = b.username;
      if (userNameA > userNameB) {
        return 1 * sortDirectionMultiplier;
      }
      if (userNameA < userNameB) {
        return -1 * sortDirectionMultiplier;
      }
      return 0;
    }

    if (sortBy === 'fullName') {
      const fullNameA = a.fullName;
      const fullNameB = b.fullName;

      return fullNameA.localeCompare(fullNameB) * sortDirectionMultiplier;
    }

    if (sortBy === 'dateOfBirth') {
      const dateA = a.dateOfBirth as Date;
      const dateB = b.dateOfBirth as Date;
      return (dateB.getTime() - dateA.getTime()) * sortDirectionMultiplier;
    }

    if (sortBy === 'salary') {
      const salaryA = a.salary;
      const salaryB = b.salary;
      return (salaryA - salaryB) * sortDirectionMultiplier;
    } else {
      return 0;
    }
  });
  return sortedUsers;
}

/**
 * 7. Method Chaining: Complex User Queries
 * Chain multiple operations for complex business queries
 *
 * Implementation Steps:
 * 1. Start with users array and chain methods using dot notation
 * 2. Use filter() to find high performers (salary > threshold)
 * 3. Use sort() to order by salary descending (b.salary - a.salary)
 * 4. Use slice() to limit results to top N performers
 * 5. Use map() to add additional properties (performance flag)
 * 6. Calculate summary statistics using Math.min/max on salary array
 * 7. Return object with both users array and summary string
 *
 * Business Value: Demonstrates modern functional programming for complex queries
 * Example: getTopPerformers(users, 3) returns top 3 earners with summary
 */
function getTopPerformers(
  users: User[],
  limit: number = 5,
): {
  users: User[];
  summary: string;
} {
  // TODO: Chain filter() -> sort() -> slice() -> map() operations
  // Hint: Use spread operator to add properties: { ...user, performance: 'Top Performer' }
  const topPerformers = users
    .filter((user: User) => user.salary > 50000)
    .sort((a: User, b: User) => b.salary - a.salary)
    .slice(0, limit)
    .map((user: User) => {
      user.isTopPerformer = true;
      return user;
    });

  const salariesArr = topPerformers.map((user: User) => user.salary);
  const userStats = {
    minSalaray: Math.min(...salariesArr),
    maxSalary: Math.max(...salariesArr),
  };
  // console.debug('userStats -> ', userStats);
  return { users: topPerformers, summary: `Top Performers` };
}

/**
 * 8. Efficient Search: Find User by ID
 * Optimized single-item lookup using find() instead of filter()
 *
 * Implementation Steps:
 * 1. Use array.find() method (not filter!)
 * 2. Provide predicate function that checks user.id === id
 * 3. find() returns first match or undefined if not found
 * 4. find() stops searching after first match (more efficient than filter)
 *
 * Business Value: Critical for user profile pages and edit operations
 * Performance: O(n) worst case but stops early, vs filter() always O(n)
 * Example: findUserById(users, 123) returns user object or undefined
 */
function findUserById(users: User[], id: number): User | undefined {
  // TODO: Use array.find() for efficient single-item lookup
  // Hint: find() stops at first match, filter() checks all items
  const userById = users.find((user: User) => {
    return user.id === id;
  });
  return userById;
}

/**
 * 9. Immutable Operations: Remove User Without Mutation
 * Safely remove users without affecting original array
 *
 * Implementation Steps:
 * 1. Use array.filter() to create new array
 * 2. Keep users where user.id !== userId (inverse logic)
 * 3. Original array remains unchanged (immutability)
 * 4. Return new array without the specified user
 *
 * Business Value: Essential for state management in Vue/React
 * Immutability: Prevents bugs from unexpected array mutations
 * Example: removeUserImmutable(users, 123) returns new array without user 123
 */
function removeUserImmutable(users: User[], userId: number): User[] {
  // TODO: Use array.filter() with inverse condition (id !== userId)
  // Hint: This creates a new array, original stays unchanged
  const userArray: User[] = users.filter((value: User) => {
    if (value.id !== userId) return value;
  });

  return userArray;
}

/**
 * 10. Async Operations: Batch User Processing
0. *
 * Implementation Steps:
 * 1. Use array.map() to create array of Promises
 * 2. Call processor function for each user (returns Promise<User>)
 * 3. Use Promise.all() to wait for all promises to resolve
 * 4. Promise.all() runs operations in parallel (faster than sequential)
 * 5. Return array of processed users
 *
 * Business Value: Useful for API calls, validation, or data enrichment
 * Performance: Parallel processing vs sequential forEach with await
 * Example: processUsersAsync(users, enrichUserData) processes all users concurrently
 */
async function processUsersAsync(
  users: User[],
  processor: (user: User) => Promise<User>,
): Promise<User[]> {
  // TODO: Use map() + Promise.all() for parallel async processing
  // Hint: Don't use forEach with await (runs sequentially)
  const userPromises = users.map((user: User) => {
    return fetchUserData(user.id);
  });
  return Promise.all(userPromises);
}

/**
 * Additional Practical Array Operations
 */

/**
 * 11. User Validation: Check Data Integrity
 * Validate user data and return validation results
 *
 * Implementation Steps:
 * 1. Initialize empty arrays for valid, invalid users and errors
 * 2. Use forEach() to iterate through all users
 * 3. For each user, create userErrors array to collect validation issues
 * 4. Check each field: username length, fullName presence, salary validity
 * 5. Push error messages to userErrors array if validation fails
 * 6. If userErrors has items, add user to invalid array and spread errors
 * 7. If no errors, add user to valid array
 * 8. Return object with categorized users and all error messages
 *
 * Business Value: Critical for data quality and system integrity
 * Example: validateUsers(users) returns { valid: [...], invalid: [...], errors: [...] }
 */
function validateUsers(users: User[]): {
  valid: User[];
  invalid: User[];
  errors: string[];
} {
  // TODO: Use forEach() to validate each user against business rules
  // Hint: Check username.length >= 3, fullName exists, salary >= 0
  // Hint: Use spread operator to add arrays: errors.push(...userErrors)

  const errors: string[] = [];
  const valid: User[] = [];
  const invalid: User[] = [];

  users.forEach((user: User) => {
    const userErrors: string[] = [];

    if (user.username.length >= 3) {
      userErrors.push(`User name ${user.username}  should be more than 03`);
    }

    if (!user.fullName) {
      userErrors.push('Users fullname cannot be empty');
    }

    if (user.salary <= 0) {
      userErrors.push('Users Salary has to be more than 0');
    }

    if (userErrors.length > 0) {
      invalid.push(user);
    } else {
      valid.push(user);
    }
    errors.push(...userErrors);
  });
  return { valid: valid, invalid: invalid, errors: errors };
}

/**
 * 12. Pagination: Split Users into Pages
 * Implement client-side pagination for large user lists
 *
 * Implementation Steps:
 * 1. Calculate startIndex: (page - 1) * pageSize
 * 2. Calculate endIndex: startIndex + pageSize
 * 3. Use array.slice(startIndex, endIndex) to get page data
 * 4. Calculate totalPages: Math.ceil(totalItems / pageSize)
 * 5. Calculate hasNext: currentPage < totalPages
 * 6. Calculate hasPrev: currentPage > 1
 * 7. Return object with data array and pagination metadata
 *
 * Business Value: Essential for performance with large datasets
 * Example: paginateUsers(users, 2, 10) returns page 2 with 10 users per page
 */
function paginateUsers(
  users: User[],
  page: number,
  pageSize: number,
): {
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} {
  // TODO: Use array.slice() and Math.ceil() for pagination logic
  // Hint: slice(start, end) where start = (page-1) * pageSize
  const startIndex = (page - 1) * 1;
  const endIndex = startIndex + pageSize;
  const pageData = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / pageSize);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    data: pageData,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: users.length,
      hasNext: hasNext,
      hasPrev: hasPrev,
    },
  };
}

/**
 * 13. Search and Highlight: Full-Text User Search
 * Search users by multiple fields with highlighting
 */
function searchUsers(
  users: User[],
  query: string,
): {
  results: User[];
  highlightedResults: Array<User & { highlights: string[] }>;
} {
  // TODO: Implement full-text search with highlighting
  // Enhances user experience in search interfaces
  const lowerQuery = query.toLowerCase();
  const results: User[] = [];
  const highlightedResults: Array<User & { highlights: string[] }> = [];

  users.forEach((user) => {
    const highlights: string[] = [];
    const searchableFields = [user.username, user.fullName];

    const matches = searchableFields.some((field) => {
      if (field.toLowerCase().includes(lowerQuery)) {
        highlights.push(field);
        return true;
      }
      return false;
    });

    if (matches) {
      results.push(user);
      highlightedResults.push({ ...user, highlights });
    }
  });

  return { results, highlightedResults };
}

/**
 * 14. Data Export: Format Users for Export
 * Prepare user data for CSV/Excel export
 */
function formatUsersForExport(users: User[]): {
  csv: string;
  headers: string[];
  rows: string[][];
} {
  // TODO: Implement data export formatting
  // Useful for reporting and data analysis
  const headers = ['ID', 'Username', 'Full Name', 'Gender', 'Date of Birth', 'Salary'];
  const rows = users.map((user) => [
    user.id.toString(),
    user.username,
    user.fullName,
    user.gender,
    user.dateOfBirth.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
    user.salary.toString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return { csv, headers, rows };
}

/**
 * 15. Performance Analytics: User Performance Metrics
 * Calculate various performance and demographic metrics
 */
function calculatePerformanceMetrics(users: User[]): {
  salaryPercentiles: { p25: number; p50: number; p75: number; p90: number };
  genderDistribution: Record<string, number>;
  ageDistribution: Record<string, number>;
  topPerformers: User[];
  salaryGrowthPotential: Array<User & { growthPotential: string }>;
} {
  // TODO: Implement comprehensive performance analytics
  // Hint: Use map() to extract salaries, sort() for percentiles
  // Hint: Use reduce() for distributions, filter() for top performers

  const ageDistribution = users.reduce(
    (accumilator: Record<string, number>, user: User) => {
      let ageGroupKey: string;
      const userAge = new Date().getFullYear() - user.dateOfBirth.getFullYear();
      // console.debug('userAge -> ', userAge);
      if (userAge < 25) {
        ageGroupKey = 'Young (Under 25)';
      } else if (userAge < 35) {
        ageGroupKey = 'Mid-Career (25-34)';
      } else if (userAge < 45) {
        ageGroupKey = 'Experienced (35-44)';
      } else {
        ageGroupKey = 'Senior (45+)';
      }

      // Initialize group if it doesn't exist
      if (!accumilator[ageGroupKey]) {
        accumilator[ageGroupKey] = 0;
      }
      accumilator[ageGroupKey] += 1;

      return accumilator;
    },
    {} as Record<string, number>,
  );

  console.debug('ageDistribution -> ', ageDistribution);

  return {
    salaryPercentiles: { p25: 0, p50: 0, p75: 0, p90: 0 },
    genderDistribution: {},
    ageDistribution: ageDistribution,
    topPerformers: [],
    salaryGrowthPotential: [],
  };
}

// Export all functions
export {
  getActiveUsers,
  findUsersByCriteria,
  getUserDisplayNames,
  calculateUserStatistics,
  groupUsersByCriteria,
  sortUsers,
  getTopPerformers,
  findUserById,
  removeUserImmutable,
  processUsersAsync,
  validateUsers,
  paginateUsers,
  searchUsers,
  formatUsersForExport,
  calculatePerformanceMetrics,
};
