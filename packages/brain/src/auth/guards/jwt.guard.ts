import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { Request as ExpressRequest } from 'express';
import { AppUser } from '../models/jwt.app-user';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = this.getRequest(context);
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      if (!token) {
        return false;
      }
      const user = await this.authService.verifyJwt(token);
      if (!user) {
        return false;
      }
      req.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }

  getRequest = getExpressRequestFromContext;
}

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): AppUser | undefined => {
    const req = getExpressRequestFromContext(context);
    return req.user;
  }
);

export function getExpressRequestFromContext(
  context: ExecutionContext
): ExpressRequest {
  if ((context.getType() as any) === 'graphql') {
    const ctx = GqlExecutionContext.create(context).getContext();
    const req: ExpressRequest = ctx.req;
    return req;
  }
  return context.switchToHttp().getRequest<ExpressRequest>();
}

//export function getFastifyRequestFromContext(context: ExecutionContext) {
//if ((context.getType() as any) === 'graphql') {
//const ctx = GqlExecutionContext.create(context).getContext();
////const req: Express. = ctx.req;
//return req;
//}
////return context.switchToHttp().getRequest<FastifyRequest>();
//}
