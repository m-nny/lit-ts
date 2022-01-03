export type AppUser = {
  username: string;
  roles: AppUserRole[];
};

export enum AppUserRole {
  admin = 'ADMIN',
  student = 'STUDENT',
}
