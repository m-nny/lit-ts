import { SetMetadata } from '@nestjs/common';
import { AppUserRole } from '../models/jwt.app-user';

export const ROLES_KEY = 'auth/roles';

export const RolesRequired = (...roles: AppUserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
