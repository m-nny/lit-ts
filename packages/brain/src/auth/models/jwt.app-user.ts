import { UserEntity } from '../../users.prisma/models/users.entity';

export type AppUser = {
  username: string;
  role: AppUserRole;
};

export enum AppUserRole {
  Admin = 'ADMIN',
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR',
}

export const AppUserFrom = ({ username, role }: UserEntity): AppUser => ({ username, role: role as AppUserRole });
