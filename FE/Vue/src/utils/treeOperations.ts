import { type User } from '@/types';

// BST Node for user data structure
class UserTreeNode {
  user: User;
  leftNode: UserTreeNode | null;
  rightNode: UserTreeNode | null;

  constructor(user: User) {
    this.user = user;
    this.leftNode = null;
    this.rightNode = null;
  }
}

/**
 * 1. Find User by ID in BST
 * Searches for a user by ID in the BST using iterative approach
 */
function findUserInBST(root: UserTreeNode | null, userId: number): UserTreeNode | null {
  let currentNode = root;

  while (currentNode) {
    if (userId === currentNode.user.id) {
      return currentNode;
    } else if (userId < currentNode.user.id) {
      currentNode = currentNode.leftNode;
    } else {
      currentNode = currentNode.rightNode;
    }
  }

  return null;
}

/**
 * 2. In-Order Traversal (Get Sorted Users)
 * Returns all users in BST sorted by ID using in-order traversal
 */
function getInOrderTraversal(root: UserTreeNode | null): User[] {
  if (!root) return [];

  const result: User[] = [];

  // In-order traversal: left -> root -> right

  //Iterative Approach
  let currentNode: UserTreeNode | null | undefined = root;
  const stack = [];

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      //go as far left as possible pushing nodes into the stack
      stack.push(currentNode);
      currentNode = currentNode?.leftNode;
    }

    //when the null current node is found [no more left children] we backtrack
    currentNode = stack.pop(); //we pop the last added left node fron stack
    if (currentNode?.user) result.push(currentNode?.user);

    //Move to the right subtree
    currentNode = currentNode?.rightNode;
  }

  //Recursive Approach
  // if (root.leftNode) {
  //   result.push(...getInOrderTraversal(root.leftNode));
  // }

  // result.push(root.user);

  // if (root.rightNode) {
  //   result.push(...getInOrderTraversal(root.rightNode));
  // }

  return result;
}

/**
 * 3. Get Users by BST Level (BFS)
 * Returns users grouped by their level in the BST
 */
function getUsersByLevel(root: UserTreeNode | null): User[][] {
  if (!root) return [];

  const levels: User[][] = [];
  const queue: { node: UserTreeNode; level: number }[] = [{ node: root, level: 0 }];

  while (queue.length > 0) {
    const { node, level } = queue.shift()!;

    // Initialize level array if needed
    if (!levels[level]) {
      levels[level] = [];
    }

    levels[level].push(node.user);

    // Add children to queue
    if (node.leftNode) {
      queue.push({ node: node.leftNode, level: level + 1 });
    }
    if (node.rightNode) {
      queue.push({ node: node.rightNode, level: level + 1 });
    }
  }

  return levels;
}

/**
 * 4. Calculate BST Depth
 * Returns the maximum depth of the BST
 */
function getBSTDepth(root: UserTreeNode | null): number {
  if (!root) return 0;

  //Iterative Approach
  const stackLeft = [];
  const stackRight = [];
  let leftDepth = 0;
  let rightDepth = 0;

  //Go left
  let currentNodeLeft: UserTreeNode | null | undefined = root;
  while (currentNodeLeft !== null) {
    currentNodeLeft = currentNodeLeft.leftNode;
    stackLeft.push(currentNodeLeft);
  }

  leftDepth = stackLeft.length;

  //Go right
  let currentNodeRight: UserTreeNode | null | undefined = root;
  while (currentNodeRight !== null) {
    currentNodeRight = currentNodeRight.rightNode;
    stackRight.push(currentNodeRight);
  }

  rightDepth = stackRight.length;

  //Recursive Approach
  // const leftDepth = root.leftNode ? getBSTDepth(root.leftNode) : 0;
  // const rightDepth = root.rightNode ? getBSTDepth(root.rightNode) : 0;

  console.debug('leftDepth -> ', leftDepth); //5
  console.debug('rightDepth -> ', rightDepth); //10
  const maxDepth = Math.max(leftDepth, rightDepth);

  return maxDepth;
}

/**
 * 5. Build User BST by ID
 * Creates a BST from user data sorted by date of birth for better balance
 */
function buildUserBST(users: User[]): UserTreeNode | null {
  if (!users || users.length === 0) return null;

  // Sort by date of birth to avoid creating a linear tree
  const sortedUsers = users.sort((a: User, b: User) => {
    if (a.dateOfBirth && b.dateOfBirth) {
      const dateOfBirthA = a.dateOfBirth.getTime();
      const dateOfBirthB = b.dateOfBirth.getTime();
      return dateOfBirthA - dateOfBirthB;
    }
    return 0;
  });

  // Create root node
  const root = new UserTreeNode(sortedUsers[0]);

  // Insert remaining users into BST
  for (let i = 1; i < sortedUsers.length; i++) {
    let currentNode = root;

    while (true) {
      const newUser = sortedUsers[i];

      if (newUser.id < currentNode.user.id) {
        // Go left
        if (currentNode.leftNode === null) {
          currentNode.leftNode = new UserTreeNode(newUser);
          break;
        } else {
          currentNode = currentNode.leftNode;
        }
      } else if (newUser.id > currentNode.user.id) {
        // Go right
        if (currentNode.rightNode === null) {
          currentNode.rightNode = new UserTreeNode(newUser);
          break;
        } else {
          currentNode = currentNode.rightNode;
        }
      } else {
        // Equal IDs - skip duplicate
        break;
      }
    }
  }

  return root;
}

/**
 * 6. Get BST Node Children
 * Returns left and right children of a BST node
 */
function getBSTNodeChildren(root: UserTreeNode | null, userId: number): User[] {
  const node = findUserInBST(root, userId);
  if (!node) return [];

  const children: User[] = [];
  if (node.leftNode) children.push(node.leftNode.user);
  if (node.rightNode) children.push(node.rightNode.user);

  return children;
}

/**
 * 7. Count BST Subtree Nodes
 * Returns the total number of nodes in a subtree
 */
function countSubtreeNodes(root: UserTreeNode | null, userId: number): number {
  const node = findUserInBST(root, userId);
  if (!node) return 0;

  function countNodes(node: UserTreeNode | null): number {
    if (!node) return 0;
    return 1 + countNodes(node.leftNode) + countNodes(node.rightNode);
  }

  return countNodes(node) - 1; // Exclude the node itself
}

/**
 * 8. Find Users by Salary Range in BST
 * Traverses BST and filters users by salary range
 */
function findUsersBySalaryRange(
  root: UserTreeNode | null,
  minSalary: number,
  maxSalary: number,
): User[] {
  if (!root) return [];

  const result: User[] = [];

  function traverse(node: UserTreeNode | null) {
    if (!node) return;

    // Check if current user is in salary range
    if (node.user.salary >= minSalary && node.user.salary <= maxSalary) {
      result.push(node.user);
    }

    // Traverse left and right subtrees
    traverse(node.leftNode);
    traverse(node.rightNode);
  }

  traverse(root);
  return result;
}

/**
 * 9. Validate BST Structure
 * Checks if the tree maintains BST property
 */
function validateBSTStructure(root: UserTreeNode | null): boolean {
  function validate(node: UserTreeNode | null, min: number, max: number): boolean {
    if (!node) return true;

    if (node.user.id <= min || node.user.id >= max) {
      return false;
    }

    return (
      validate(node.leftNode, min, node.user.id) && validate(node.rightNode, node.user.id, max)
    );
  }

  return validate(root, -Infinity, Infinity);
}

/**
 * 10. Generate BST Report
 * Creates a comprehensive report of the BST structure
 */
function generateBSTReport(root: UserTreeNode | null): {
  totalNodes: number;
  bstDepth: number;
  isValidBST: boolean;
  salaryDistribution: { [key: string]: number };
} {
  if (!root) {
    return {
      totalNodes: 0,
      bstDepth: 0,
      isValidBST: true,
      salaryDistribution: {},
    };
  }

  const allUsers = getInOrderTraversal(root);
  const salaryDistribution: { [key: string]: number } = {};

  // Group by salary bands
  allUsers.forEach((user) => {
    let band: string;
    if (user.salary < 60000) {
      band = 'Entry Level (<$60k)';
    } else if (user.salary < 80000) {
      band = 'Mid Level ($60k-$80k)';
    } else if (user.salary < 100000) {
      band = 'Senior Level ($80k-$100k)';
    } else {
      band = 'Executive Level ($100k+)';
    }

    salaryDistribution[band] = (salaryDistribution[band] || 0) + 1;
  });

  return {
    totalNodes: allUsers.length,
    bstDepth: getBSTDepth(root),
    isValidBST: validateBSTStructure(root),
    salaryDistribution,
  };
}

// Export all BST functions and classes
export {
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
};
