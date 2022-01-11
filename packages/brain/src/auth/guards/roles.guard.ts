import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AppUserRole } from '../models/jwt.app-user';
import { getExpressRequestFromContext } from './jwt.guard';

@Injectable()
export class AppRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<AppUserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = getExpressRequestFromContext(context);
    if (!user || !user.role) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }
}
