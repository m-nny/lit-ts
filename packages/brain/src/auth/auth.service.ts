import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentials, UsersPrismaService } from '../users.prisma/users.service';
import { AppUser } from './models/jwt.app-user';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersPrismaService, private jwtService: JwtService) {}

  async login(userCredentials: UserCredentials): Promise<string | null> {
    const appUser = await this.usersService.authorize(userCredentials);
    if (!appUser) {
      return null;
    }
    return this.jwtService.sign(appUser);
  }

  async verifyJwt(payload: string): Promise<AppUser | null> {
    try {
      const jwt = await this.jwtService.verifyAsync<AppUser>(payload);
      return jwt;
    } catch (e) {
      //FIXME(m-nny): add proper logger
      console.log(e, { payload });
      return null;
    }
  }
}
