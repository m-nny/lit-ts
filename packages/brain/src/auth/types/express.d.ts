import { AppUser } from '../models/jwt.app-user';

declare module 'express' {
  export interface Request {
    user?: AppUser;
  }
}
