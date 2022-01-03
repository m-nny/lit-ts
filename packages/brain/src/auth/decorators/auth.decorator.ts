import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AppRoleGuard } from '../guards/roles.guard';
import { AppUserRole } from '../models/jwt.app-user';
import { RolesRequired } from './roles.decorator';

export const RequireAuth = (...roles: AppUserRole[]) =>
  applyDecorators(RolesRequired(...roles), UseGuards(JwtGuard, AppRoleGuard));
