import { type User } from '@/types';

/**
 * 1. Basic Map Operations: User Role Management
 * Create and manage user roles using Map for efficient lookups
 *
 * Implementation Steps:
 * 1. Create a new Map<UserId, UserRole> using new Map() constructor
 * 2. Use .set(key, value) to assign roles to users
 * 3. Use .get(key) to retrieve a user's role (returns undefined if not found)
 * 4. Use .has(key) to check if a user exists in the role map
 * 5. Use .delete(key) to remove a user's role assignment
 * 6. Use .clear() to remove all role assignments
 *
 * Business Value: Efficient role-based access control for user management
 * Performance: O(1) average time complexity for all operations
 * Example: setUserRole(101, 'Admin'), getUserRole(101) returns 'Admin'
 */
function createUserRoleMap(
  roleMap: Map<number, 'Admin' | 'Editor' | 'Viewer'>,
): Map<number, 'Admin' | 'Editor' | 'Viewer'> {
  // TODO: Create a new Map to store user ID to role mappings
  // Hint: Use Map<number, 'Admin' | 'Editor' | 'Viewer'>() for type safety
  // Hint: Pre-populate with some demo users for testing

  roleMap.set(101, 'Admin');
  roleMap.set(102, 'Editor');
  roleMap.set(103, 'Viewer');
  return roleMap;
}

function setUserRole(roleMap: Map<number, string>, userId: number, role: string): void {
  // TODO: Use .set() method to assign role to user
  // Hint: roleMap.set(userId, role)
  console.log(`TODO: Set role ${role} for user ${userId}`);
  roleMap.set(userId, role);
}

function getUserRole(roleMap: Map<number, string>, userId: number): string | undefined {
  // TODO: Use .get() method to retrieve user's role
  // Hint: Returns undefined if user not found
  console.log(`TODO: Get role for user ${userId}`);
  if (roleMap.has(userId)) {
    return roleMap.get(userId);
  }
  return undefined;
}

/**
 * 2. Map vs Object Performance Comparison
 * Demonstrate when to use Map over Object for key-value storage
 *
 * Implementation Steps:
 * 1. Create both Map and Object for comparison
 * 2. Measure performance of frequent additions using performance.now()
 * 3. Test with different key types (numbers, strings, objects)
 * 4. Compare memory usage and iteration speed
 * 5. Document scenarios where Map excels over Object
 * .0
 *
 * Business Value: Helps developers choose optimal data structure
 * Key Differences: Map allows any key type, maintains insertion order, better performance
 * Example: Storing DOM elements as keys, frequent add/remove operations
 */
function compareMapVsObject(): {
  mapPerformance: number;
  objectPerformance: number;
  recommendation: string;
} {
  // TODO: Create performance comparison between Map and Object
  // Hint: Use performance.now() to measure execution time
  // Hint: Test with 10,000+ operations for meaningful results
  // Hint: Compare: creation, insertion, lookup, deletion, iteration
  console.log('TODO: Implement performance comparison');
  return { mapPerformance: 0, objectPerformance: 0, recommendation: 'Not tested' };
}

/**
 * 3. Advanced Map Iteration Techniques
 * Demonstrate all ways to iterate over Map entries, keys, and values
 *
 * Implementation Steps:
 * 1. Use for...of with .entries() to get [key, value] pairs
 * 2. Use .forEach((value, key) => {}) for functional iteration
 * 3. Use for...of with .keys() to iterate over keys only
 * 4. Use for...of with .values() to iterate over values only
 * 5. Convert to Array using Array.from() or spread operator
 * 6. Use destructuring assignment for cleaner code
 *
 * Business Value: Essential for data processing and transformation
 * Performance: Direct iteration is faster than converting to arrays
 * Example: Processing user data, generating reports, data export
 */
function demonstrateMapIteration(userMap: Map<number, User>): {
  entriesArray: Array<[number, User]>;
  keysArray: number[];
  valuesArray: User[];
  processedData: string[];
} {
  // TODO: Implement all Map iteration methods
  // Hint: Use for...of loops and Array.from() for conversions
  // Hint: Demonstrate destructuring: for (const [id, user] of userMap.entries())
  const entriesArray = Array.from(userMap.entries());
  const keysArray = Array.from(userMap.keys());
  const valuesArray = Array.from(userMap.values());
  const processedData: string[] = [];

  for (const [id, user] of userMap.entries()) {
    processedData.push(`${id} - ${user.fullName}`);
  }

  const mapIterations = {
    entriesArray: entriesArray,
    keysArray: keysArray,
    valuesArray: valuesArray,
    processedData: [],
  };

  return mapIterations;
}

/**
 * 4. Word Frequency Counter with Map
 * Count word occurrences in text using Map for efficient tracking
 *
 * Implementation Steps:
 * 1. Split input text into words using .split() with regex
 * 2. Normalize words to lowercase for case-insensitive counting
 * 3. Use Map.get() with || 0 pattern for default values
 * 4. Increment count using Map.set(word, currentCount + 1)
 * 5. Filter out common stop words (optional enhancement)
 * 6. Sort results by frequency for top words analysis
 *
 * Business Value: Text analysis, SEO keyword analysis, content insights
 * Algorithm: O(n) time complexity where n is number of words
 * Example: Analyzing user feedback, blog content, search queries
 */
function countWordFrequencies(text: string): Map<string, number> {
  // TODO: Implement word frequency counter using Map
  // Hint: Use text.toLowerCase().split(/\s+/) to get words array
  // Hint: Use map.get(word) || 0 pattern for counting
  // Hint: Consider filtering out punctuation and empty strings
  text = text.replace(/\./g, ' ');
  const words = text.split(/\s+/);
  const wordMap = new Map<string, number>();
  words.forEach((word: string) => {
    const wordLower = word.toLowerCase();
    const wordCount = wordMap.get(wordLower) || 0;
    wordMap.set(wordLower, wordCount + 1);
  });

  return wordMap;
}

function getTopWords(
  frequencies: Map<string, number>,
  limit: number = 10,
): Array<[string, number]> {
  // TODO: Convert Map to sorted array of [word, count] pairs
  // Hint: Use Array.from() and .sort() with custom comparator
  // Hint: Sort by count descending: (a, b) => b[1] - a[1]
  const topWords: Array<[string, number]> = [];

  // frequencies.forEach((value, key) => {
  //   console.debug('value -> ', value);
  //   console.debug('key -> ', key);
  //   topWords.push([key, value]);
  // });

  for (const [key, value] of frequencies.entries()) {
    console.debug('key -> ', key);
    console.debug('value -> ', value);
    topWords.push([key, value]);
  }

  // for (const value of frequencies.values()) {
  //   console.debug('value only -> ', value);
  // }

  console.debug('topWords -> ', topWords);
  topWords.sort((a: [string, number], b: [string, number]) => {
    return b[1] - a[1];
  });
  console.debug('topWordsSorted -> ', topWords);
  return topWords;
}

/**
 * 5. In-Memory Cache Implementation
 * Build a simple cache using Map for fast data retrieval
 *
 * Implementation Steps:
 * 1. Create Cache class with private Map<K, V> property
 * 2. Implement set(key, value) method using Map.set()
 * 3. Implement get(key) method with Map.has() check first
 * 4. Add optional TTL (time-to-live) using Map<K, {value: V, expires: number}>
 * 5. Implement clear() and delete(key) methods
 * 6. Add size property using Map.size
 * 7. Add cache hit/miss statistics tracking
 *
 * Business Value: Improves application performance, reduces API calls
 * Use Cases: API response caching, computed value storage, session data
 * Example: Caching user profiles, expensive calculations, API responses
 */
class SimpleCache<K, V> {
  private cache = new Map<K, V>();
  private stats = { hits: 0, misses: 0 };

  set(key: K, value: V): void {
    // TODO: Implement cache set operation
    // Hint: Use this.cache.set(key, value)
    // Hint: Consider adding timestamp for TTL feature
    console.log(`TODO: Cache set - key: ${key}, value: ${value}`);
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    // TODO: Implement cache get operation with statistics
    // Hint: Check with this.cache.has(key) first
    // Hint: Update this.stats.hits or this.stats.misses
    console.log(`TODO: Cache get - key: ${key}`);
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    } else {
      this.stats.misses++;
    }

    return undefined;
  }

  getStats(): { hits: number; misses: number; hitRate: number } {
    // TODO: Calculate and return cache statistics
    // Hint: hitRate = hits / (hits + misses) * 100
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    return { hits: this.stats.hits, misses: this.stats.misses, hitRate };
  }

  clear(): void {
    // TODO: Clear cache and reset statistics
    console.log('TODO: Clear cache');
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }
}

/**
 * 6. Object-as-Keys: DOM Element Metadata Storage
 * Demonstrate Map's ability to use objects as keys for metadata storage
 *
 * Implementation Steps:
 * 1. Create Map<HTMLElement, ElementMetadata> for DOM element tracking
 * 2. Use actual DOM element references as keys (not IDs or classes)
 * 3. Store metadata like click counts, last interaction, custom properties
 * 4. Implement event handlers that update metadata via Map operations
 * 5. Use WeakMap for automatic garbage collection of removed elements
 * 6. Provide utility functions for bulk operations on element metadata
 *
 * Business Value: Component state management, analytics tracking, UI behavior
 * Advantage: Direct object reference mapping without string conversion
 * Example: Tracking button clicks, form field validation, component lifecycle
 */
interface ElementMetadata {
  clicks: number;
  lastClicked: Date | null;
  customData: Record<string, any>;
}

function createElementMetadataMap(): Map<HTMLElement, ElementMetadata> {
  // TODO: Create Map for storing DOM element metadata
  // Hint: Use Map<HTMLElement, ElementMetadata>()`
  // Hint: Consider using WeakMap for automatic cleanup
  const elementMetaData = new Map<HTMLElement, ElementMetadata>();
  return elementMetaData;
}

function trackElementInteraction(
  metadataMap: Map<HTMLElement, ElementMetadata>,
  element: HTMLElement,
  interactionType: string,
): void {
  // TODO: Update element metadata on interaction
  // Hint: Get existing metadata or create default object
  // Hint: Update relevant fields based on interaction type
  console.log(`TODO: Track ${interactionType} interaction for element`, element);
  const metaData = metadataMap.get(element) || {};
}

/**
 * 7. Group Array Data by Property using Map
 * Group array of objects by a specific property into Map structure
 *
 * Implementation Steps:
 * 1. Create Map<PropertyValue, ObjectArray> for grouping results
 * 2. Iterate through input array using for...of loop
 * 3. Extract grouping property value from each object
 * 4. Check if Map already has key for this property value
 * 5. Initialize empty array if key doesn't exist
 * 6. Push current object to appropriate group array
 * 7. Return Map with grouped data for further processing
 *
 * Business Value: Data analysis, reporting, categorization
 * Performance: O(n) time complexity, efficient grouping
 * Example: Group users by department, products by category, orders by status
 */
function groupUsersByProperty<RAMESH extends keyof User>(
  users: User[],
  property: RAMESH,
): Map<User[RAMESH], User[]> {
  // TODO: Group users by specified property using Map
  // Hint: Use users[property] to get grouping value
  // Hint: Initialize empty array if group doesn't exist
  // Hint: Use type-safe approach with keyof User
  const userGroupsMap = new Map<User[RAMESH], User[]>();

  users.forEach((user: User) => {
    const users: User[] = userGroupsMap.get(user[property]) || [];
    users.push(user);
    userGroupsMap.set(user[property], users);
  });

  return userGroupsMap;
}

function groupUsersByCustomCriteria(
  users: User[],
  criteriaFn: (user: User) => string,
): Map<string, User[]> {
  // TODO: Group users by custom criteria function
  // Hint: Use criteriaFn(user) to determine group key
  // Hint: More flexible than property-based grouping

  const userGroupsMap = new Map<string, User[]>();
  users.forEach((user: User) => {
    const userGroup = criteriaFn(user);
    const userArr = userGroupsMap.get(userGroup) || [];
    userArr.push(user);
    userGroupsMap.set(userGroup, userArr);
  });

  return userGroupsMap;
}

/**
 * 8. First Non-Repeated Character Algorithm
 * Find first character in string that appears exactly once
 *
 * Implementation Steps:
 * 1. Create Map<string, number> for character frequency counting
 * 2. First pass: iterate through string to build frequency map
 * 3. Use map.get(char) || 0 pattern to handle new characters
 * 4. Second pass: iterate through string again to find first unique
 * 5. Return first character with frequency of 1
 * 6. Return null if no unique characters found
 * 7. Consider case sensitivity and special character handling
 *
 * Business Value: String processing, data validation, algorithm optimization
 * Algorithm: Two-pass solution with O(n) time complexity
 * Example: Finding unique identifiers, data deduplication, text analysis
 */
function findFirstNonRepeatedChar(input: string): string | null {
  // TODO: Implement two-pass algorithm using Map
  // Hint: First pass builds frequency map
  // Hint: Second pass finds first char with count === 1
  // Hint: Consider case sensitivity requirements
  const characterFreqMap = new Map<string, number>();
  for (const char of input) {
    const charCount = characterFreqMap.get(char) || 0;
    characterFreqMap.set(char, charCount + 1);
  }

  for (const char of input) {
    const charFreq = characterFreqMap.get(char);
    if (charFreq === 1) {
      return char;
    }
  }

  return null;
}

function analyzeStringCharacters(input: string): {
  frequencies: Map<string, number>;
  firstUnique: string | null;
  mostFrequent: string | null;
  totalUnique: number;
} {
  // TODO: Comprehensive string character analysis
  // Hint: Combine frequency counting with additional statistics
  // Hint: Find most frequent character using Map iteration
  const frequenciesMap = new Map<string, number>();
  for (const char of input) {
    const freqCount = frequenciesMap.get(char) || 0;
    frequenciesMap.set(char, freqCount + 1);
  }

  let firstUniqueChar = null;
  let mostFrequentChar = null;
  const totalUniqueChars = Array.from(frequenciesMap.values()).filter(
    (fc: number) => fc == 1,
  ).length;

  const mostFrequentCharCount = Math.max(...Array.from(frequenciesMap.values()));
  for (const char of input) {
    const freqCount = frequenciesMap.get(char) || 0;

    if (freqCount === 1 && firstUniqueChar === null) {
      firstUniqueChar = char;
    }

    if (freqCount === mostFrequentCharCount) {
      mostFrequentChar = char;
    }
  }

  return {
    frequencies: frequenciesMap,
    firstUnique: firstUniqueChar,
    mostFrequent: mostFrequentChar,
    totalUnique: totalUniqueChars,
  };
}

/**
 * 9. LRU Cache Implementation with Map
 * Implement Least Recently Used cache using Map + Doubly Linked List
 *
 * Implementation Steps:
 * 1. Create DoublyLinkedNode class with key, value, prev, next properties
 * 2. Use Map<K, DoublyLinkedNode> for O(1) key lookup
 * 3. Maintain head and tail pointers for linked list operations
 * 4. On get(): move accessed node to head of list (most recent)
 * 5. On set(): add new node to head, evict tail if over capacity
 * 6. Update Map and linked list simultaneously for consistency
 * 7. Handle edge cases: empty cache, single item, capacity changes
 *
 * Business Value: Memory-efficient caching with automatic eviction
 * Algorithm: O(1) for both get and set operations
 * Example: Browser cache, database query cache, image cache
 */
class DoublyLinkedNode<K, V> {
  constructor(
    public key: K,
    public value: V,
    public prev: DoublyLinkedNode<K, V> | null = null,
    public next: DoublyLinkedNode<K, V> | null = null,
  ) {}
}

class LRUCache<K, V> {
  private capacity: number;
  private cache = new Map<K, DoublyLinkedNode<K, V>>();
  private head: DoublyLinkedNode<K, V> | null = null;
  private tail: DoublyLinkedNode<K, V> | null = null;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    // TODO: Implement LRU get operation
    // Hint: Check if key exists in Map
    // Hint: Move accessed node to head of linked list
    // Hint: Return node.value or undefined
    return undefined;
  }

  set(key: K, value: V): void {
    // TODO: Implement LRU set operation
    // Hint: If key exists, update value and move to head
    // Hint: If new key and at capacity, evict tail node
    // Hint: Add new node to head and update Map
  }

  private moveToHead(node: DoublyLinkedNode<K, V>): void {
    // TODO: Move existing node to head of linked list
    // Hint: Update prev/next pointers carefully
    // Hint: Handle edge cases for head/tail updates
  }

  private evictTail(): void {
    // TODO: Remove least recently used item (tail)
    // Hint: Remove from both Map and linked list
    // Hint: Update tail pointer to previous node
  }
}

/**
 * 10. Map Inversion with Duplicate Handling
 * Invert Map<K, V> to Map<V, K[]> handling duplicate values
 *
 * Implementation Steps:
 * 1. Create new Map<V, K[]> for inverted structure
 * 2. Iterate through original Map entries using .entries()
 * 3. For each [key, value] pair, use value as new key
 * 4. Check if inverted Map already has this new key
 * 5. Initialize empty array if key doesn't exist
 * 6. Push original key to array for this value
 * 7. Handle type safety with proper generics
 *
 * Business Value: Data relationship analysis, reverse lookups
 * Use Cases: User-to-roles mapping, category-to-products, tag-to-items
 * Example: From user->role to role->users[], product->category to category->products[]
 */
function invertMap<K, V>(originalMap: Map<K, V>): Map<V, K[]> {
  // TODO: Implement Map inversion with duplicate value handling
  // Hint: Use originalMap.entries() for iteration
  // Hint: Initialize empty array for new keys
  // Hint: Handle type safety with generics
  const invertedMap = new Map<V, K[]>();
  for (const [key, value] of originalMap.entries()) {
    const invertedValArr = invertedMap.get(value) || [];
    invertedValArr.push(key);
    invertedMap.set(value, invertedValArr);
  }
  console.debug('invertedMap --> ', invertedMap);
  return invertedMap;
}

function invertUserRoleMap(roleMap: Map<number, string>): Map<string, number[]> {
  // TODO: Specific implementation for user role inversion
  // Hint: Convert user->role mapping to role->users[] mapping
  // Hint: Useful for finding all users with specific role
  const invertedUserRoleMap = new Map<string, number[]>();

  for (const [key, value] of roleMap.entries()) {
    const valArr = invertedUserRoleMap.get(value) || [];
    valArr.push(key);
    invertedUserRoleMap.set(value, valArr);
  }

  return invertedUserRoleMap;
}

/**
 * Additional Advanced Map Operations
 */

/**
 * 11. Map Merge and Intersection Operations
 * Combine multiple Maps with conflict resolution strategies
 */
function mergeMaps<K, V>(
  map1: Map<K, V>,
  map2: Map<K, V>,
  conflictResolver: (value1: V, value2: V, key: K) => V,
): Map<K, V> {
  // TODO: Merge two Maps with custom conflict resolution
  // Hint: Iterate through both Maps and apply resolver for conflicts
  // Hint: Use conflictResolver function for duplicate keys
  return new Map();
}

function findMapIntersection<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
  // TODO: Find common keys between two Maps
  // Hint: Check if key exists in both Maps
  // Hint: Decide which value to keep (first Map, second Map, or merge)
  return new Map();
}

/**
 * 12. Map-based Data Pipeline
 * Create data transformation pipeline using Map operations
 */
function createDataPipeline<T, K, V>(
  data: T[],
  keyExtractor: (item: T) => K,
  valueTransformer: (item: T) => V,
  filters: Array<(key: K, value: V) => boolean> = [],
): Map<K, V> {
  // TODO: Build flexible data processing pipeline
  // Hint: Extract keys and transform values from input data
  // Hint: Apply filters to determine which items to include
  // Hint: Return final Map with processed data
  return new Map();
}

// Export all functions for use in components
export {
  createUserRoleMap,
  setUserRole,
  getUserRole,
  compareMapVsObject,
  demonstrateMapIteration,
  countWordFrequencies,
  getTopWords,
  SimpleCache,
  createElementMetadataMap,
  trackElementInteraction,
  groupUsersByProperty,
  groupUsersByCustomCriteria,
  findFirstNonRepeatedChar,
  analyzeStringCharacters,
  LRUCache,
  invertMap,
  invertUserRoleMap,
  mergeMaps,
  findMapIntersection,
  createDataPipeline,
};
