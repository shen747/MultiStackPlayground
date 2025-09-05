import { type User } from '@/types';
const BASE_URL = '';

const demoUsers: User[] = [
  {
    id: 1,
    username: 'john_doe',
    fullName: 'John Doe',
    gender: 'male',
    dateOfBirth: new Date('1990-03-15'),
    salary: 75000, // Mid Level
  },
  {
    id: 2,
    username: 'jane_smith',
    fullName: 'Jane Smith',
    gender: 'female',
    dateOfBirth: new Date('1988-07-22'),
    salary: 125000, // Executive Level
  },
  {
    id: 3,
    username: 'mike_johnson',
    fullName: 'Mike Johnson',
    gender: 'male',
    dateOfBirth: new Date('1995-11-08'),
    salary: 55000, // Entry Level
  },
  {
    id: 4,
    username: 'sarah_wilson',
    fullName: 'Sarah Wilson',
    gender: 'female',
    dateOfBirth: new Date('1985-01-30'),
    salary: 110000, // Executive Level
  },
  {
    id: 5,
    username: 'david_brown',
    fullName: 'David Brown',
    gender: 'male',
    dateOfBirth: new Date('1991-09-12'),
    salary: 71000, // Mid Level
  },
  {
    id: 6,
    username: 'emily_davis',
    fullName: 'Emily Davis',
    gender: 'female',
    dateOfBirth: new Date('1996-05-18'),
    salary: 48000, // Entry Level
  },
  {
    id: 7,
    username: 'chris_miller',
    fullName: 'Chris Miller',
    gender: 'male',
    dateOfBirth: new Date('1982-12-03'),
    salary: 135000, // Executive Level
  },
  {
    id: 8,
    username: 'lisa_garcia',
    fullName: 'Lisa Garcia',
    gender: 'female',
    dateOfBirth: new Date('1997-08-25'),
    salary: 52000, // Entry Level
  },
  {
    id: 9,
    username: 'alex_martinez',
    fullName: 'Alex Martinez',
    gender: 'male',
    dateOfBirth: new Date('1989-04-14'),
    salary: 88000, // Senior Level
  },
  {
    id: 10,
    username: 'amanda_taylor',
    fullName: 'Amanda Taylor',
    gender: 'female',
    dateOfBirth: new Date('1986-10-07'),
    salary: 84000, // Senior Level
  },
  {
    id: 11,
    username: 'ryan_anderson',
    fullName: 'Ryan Anderson',
    gender: 'male',
    dateOfBirth: new Date('1998-02-28'),
    salary: 45000, // Entry Level
  },
  {
    id: 12,
    username: 'jessica_thomas',
    fullName: 'Jessica Thomas',
    gender: 'female',
    dateOfBirth: new Date('1990-06-11'),
    salary: 73000, // Mid Level
  },
  {
    id: 13,
    username: 'kevin_white',
    fullName: 'Kevin White',
    gender: 'male',
    dateOfBirth: new Date('1980-03-20'),
    salary: 150000, // Executive Level
  },
  {
    id: 14,
    username: 'nicole_harris',
    fullName: 'Nicole Harris',
    gender: 'female',
    dateOfBirth: new Date('1992-12-15'),
    salary: 66000, // Mid Level
  },
  {
    id: 15,
    username: 'brandon_clark',
    fullName: 'Brandon Clark',
    gender: 'male',
    dateOfBirth: new Date('1987-08-09'),
    salary: 91000, // Senior Level
  },
  {
    id: 16,
    username: 'stephanie_lewis',
    fullName: 'Stephanie Lewis',
    gender: 'female',
    dateOfBirth: new Date('1999-04-02'),
    salary: 42000, // Entry Level
  },
  {
    id: 17,
    username: 'jason_walker',
    fullName: 'Jason Walker',
    gender: 'male',
    dateOfBirth: new Date('1978-11-27'),
    salary: 180000, // Executive Level (CEO)
  },
  {
    id: 18,
    username: 'michelle_hall',
    fullName: 'Michelle Hall',
    gender: 'female',
    dateOfBirth: new Date('1991-07-13'),
    salary: 74000, // Mid Level
  },
  {
    id: 19,
    username: 'daniel_young',
    fullName: 'Daniel Young',
    gender: 'male',
    dateOfBirth: new Date('1996-01-05'),
    salary: 52000, // Entry Level
  },
  {
    id: 20,
    username: 'rachel_king',
    fullName: 'Rachel King',
    gender: 'female',
    dateOfBirth: new Date('1989-09-18'),
    salary: 81000, // Senior Level
  },
  {
    id: 21,
    username: 'matthew_wright',
    fullName: 'Matthew Wright',
    gender: 'male',
    dateOfBirth: new Date('1981-05-24'),
    salary: 165000, // Executive Level (CTO)
  },
  {
    id: 22,
    username: 'lauren_lopez',
    fullName: 'Lauren Lopez',
    gender: 'female',
    dateOfBirth: new Date('1994-10-31'),
    salary: 59000, // Entry Level
  },
  {
    id: 23,
    username: 'joshua_hill',
    fullName: 'Joshua Hill',
    gender: 'male',
    dateOfBirth: new Date('1990-02-16'),
    salary: 76000, // Mid Level
  },
  {
    id: 24,
    username: 'megan_green',
    fullName: 'Megan Green',
    gender: 'female',
    dateOfBirth: new Date('1979-06-08'),
    salary: 145000, // Executive Level (CFO)
  },
  {
    id: 25,
    username: 'tyler_adams',
    fullName: 'Tyler Adams',
    gender: 'male',
    dateOfBirth: new Date('1995-12-21'),
    salary: 56000, // Entry Level
  },
  // Adding younger employees (under 25)
  {
    id: 26,
    username: 'zoe_chen',
    fullName: 'Zoe Chen',
    gender: 'female',
    dateOfBirth: new Date('2001-03-15'),
    salary: 45000, // Entry Level
  },
  {
    id: 27,
    username: 'ethan_patel',
    fullName: 'Ethan Patel',
    gender: 'male',
    dateOfBirth: new Date('2000-08-22'),
    salary: 48000, // Entry Level
  },
  {
    id: 28,
    username: 'maya_kumar',
    fullName: 'Maya Kumar',
    gender: 'female',
    dateOfBirth: new Date('2002-01-30'),
    salary: 42000, // Entry Level
  },
  {
    id: 29,
    username: 'lucas_wong',
    fullName: 'Lucas Wong',
    gender: 'male',
    dateOfBirth: new Date('2001-11-08'),
    salary: 46000, // Entry Level
  },
  {
    id: 30,
    username: 'sophia_zhang',
    fullName: 'Sophia Zhang',
    gender: 'female',
    dateOfBirth: new Date('2000-06-18'),
    salary: 47000, // Entry Level
  },
  {
    id: 31,
    username: 'aiden_singh',
    fullName: 'Aiden Singh',
    gender: 'male',
    dateOfBirth: new Date('2002-04-14'),
    salary: 43000, // Entry Level
  },
  {
    id: 32,
    username: 'lily_nguyen',
    fullName: 'Lily Nguyen',
    gender: 'female',
    dateOfBirth: new Date('2001-09-12'),
    salary: 44000, // Entry Level
  },
  {
    id: 33,
    username: 'noah_kim',
    fullName: 'Noah Kim',
    gender: 'male',
    dateOfBirth: new Date('2002-07-13'),
    salary: 41000, // Entry Level
  },
  {
    id: 34,
    username: 'emma_liu',
    fullName: 'Emma Liu',
    gender: 'female',
    dateOfBirth: new Date('2000-12-03'),
    salary: 45000, // Entry Level
  },
  {
    id: 35,
    username: 'oliver_tan',
    fullName: 'Oliver Tan',
    gender: 'male',
    dateOfBirth: new Date('2001-05-24'),
    salary: 46000, // Entry Level
  },
  {
    id: 36,
    username: 'ava_shah',
    fullName: 'Ava Shah',
    gender: 'female',
    dateOfBirth: new Date('2002-10-07'),
    salary: 42000, // Entry Level
  },
  {
    id: 37,
    username: 'william_cho',
    fullName: 'William Cho',
    gender: 'male',
    dateOfBirth: new Date('2001-02-28'),
    salary: 44000, // Entry Level
  },
  {
    id: 38,
    username: 'isabella_wu',
    fullName: 'Isabella Wu',
    gender: 'female',
    dateOfBirth: new Date('2000-11-27'),
    salary: 45000, // Entry Level
  },
  {
    id: 39,
    username: 'james_huang',
    fullName: 'James Huang',
    gender: 'male',
    dateOfBirth: new Date('2002-08-09'),
    salary: 43000, // Entry Level
  },
  // Adding more experienced employees
  {
    id: 40,
    username: 'victoria_ross',
    fullName: 'Victoria Ross',
    gender: 'female',
    dateOfBirth: new Date('1988-04-02'),
    salary: 92000, // Senior Level
  },
  {
    id: 41,
    username: 'nathan_cooper',
    fullName: 'Nathan Cooper',
    gender: 'male',
    dateOfBirth: new Date('1983-11-27'),
    salary: 140000, // Executive Level
  },
  {
    id: 42,
    username: 'samantha_reed',
    fullName: 'Samantha Reed',
    gender: 'female',
    dateOfBirth: new Date('1991-07-13'),
    salary: 78000, // Mid Level
  },
  {
    id: 43,
    username: 'eric_morgan',
    fullName: 'Eric Morgan',
    gender: 'male',
    dateOfBirth: new Date('1986-01-05'),
    salary: 115000, // Executive Level
  },
  {
    id: 44,
    username: 'hannah_phillips',
    fullName: 'Hannah Phillips',
    gender: 'female',
    dateOfBirth: new Date('1989-09-18'),
    salary: 86000, // Senior Level
  },
  {
    id: 45,
    username: 'andrew_bennett',
    fullName: 'Andrew Bennett',
    gender: 'male',
    dateOfBirth: new Date('1984-05-24'),
    salary: 125000, // Executive Level
  },
  {
    id: 46,
    username: 'grace_coleman',
    fullName: 'Grace Coleman',
    gender: 'female',
    dateOfBirth: new Date('1992-10-31'),
    salary: 72000, // Mid Level
  },
  {
    id: 47,
    username: 'jack_peterson',
    fullName: 'Jack Peterson',
    gender: 'male',
    dateOfBirth: new Date('1987-02-16'),
    salary: 95000, // Senior Level
  },
  {
    id: 48,
    username: 'olivia_barnes',
    fullName: 'Olivia Barnes',
    gender: 'female',
    dateOfBirth: new Date('1985-06-08'),
    salary: 105000, // Senior Level
  },
  {
    id: 49,
    username: 'daniel_price',
    fullName: 'Daniel Price',
    gender: 'male',
    dateOfBirth: new Date('1990-12-21'),
    salary: 82000, // Senior Level
  },
  {
    id: 50,
    username: 'sophie_ward',
    fullName: 'Sophie Ward',
    gender: 'female',
    dateOfBirth: new Date('1993-08-15'),
    salary: 68000, // Mid Level
  },
];

export const fetchUserData = async (userId: number): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const demoUser: User | undefined = demoUsers.find((user: User) => user.id === userId);

  if (!demoUser) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return demoUser;
};

export const fetchUsers = async (): Promise<User[]> => {
  //   const resposne = await fetch(`${BASE_URL}/users`);
  //   if (!resposne.ok) throw new Error('Failed to fetch users');
  //   const data = await resposne.json();

  await new Promise((resolve) => setTimeout(resolve, 500));

  return demoUsers.map((apiUser: User) => ({
    id: apiUser.id,
    username: apiUser.username,
    fullName: apiUser.fullName,
    gender: apiUser.gender,
    dateOfBirth: apiUser.dateOfBirth,
    salary: apiUser.salary,
  }));
};
