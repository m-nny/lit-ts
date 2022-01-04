export type AppUser = {
  username: string;
  roles: AppUserRole[];
};

export enum AppUserRole {
  Admin = 'ADMIN',
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR',
}
