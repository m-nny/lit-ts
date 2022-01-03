import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentials } from '../users/models/plain-users.type';
import { BcryptService } from '../users/users.bcrypt';
import { UsersService } from '../users/users.service';
import { AppUser } from './models/jwt.app-user';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcrypt: BcryptService
  ) {}

  private async validateUserCredentials(
    userCredentials: UserCredentials
  ): Promise<AppUser | null> {
    const hashedUser = await this.usersService.findOne(
      userCredentials.username
    );
    if (!hashedUser) {
      return null;
    }
    const isPasswordCorrect = await this.bcrypt.checkUser(
      userCredentials,
      hashedUser
    );
    if (!isPasswordCorrect) {
      return null;
    }
    return hashedUser.toAppUser();
  }

  async login(userCredentials: UserCredentials): Promise<string | null> {
    const appUser = await this.validateUserCredentials(userCredentials);
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
