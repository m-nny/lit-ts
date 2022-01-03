import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

export const RequireAuth = () => applyDecorators(UseGuards(AuthGuard));
