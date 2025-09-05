export interface User {
  id: number;
  username: string;
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  salary: number;
  isTopPerformer?: boolean;
  userRole?: 'Admin' | 'Editor' | 'Viewer';
}
