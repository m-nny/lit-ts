import { AppUser } from '../models/jwt.app-user';

declare global {
  namespace Express {
    export interface Request {
      user?: AppUser;
    }
  }
}
