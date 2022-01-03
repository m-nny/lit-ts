import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ConfigWrapper } from '../config/config.wrapper';
import {
  HashedUser,
  PlainUser,
  UpdateHasedUser,
  UpdatePlainUser,
  UserCredentials,
} from './models/plain-users.type';

export type CheckPasswordArgs = {
  plainPassword: string;
  hashedPassword: string;
};

@Injectable()
export class BcryptService {
  private config;
  constructor({ config }: ConfigWrapper) {
    this.config = config.bcrypt;
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const hashed = await bcrypt.hash(plainPassword, this.config.saltOrRounds);
    return hashed;
  }
  async checkPassword({
    hashedPassword,
    plainPassword,
  }: CheckPasswordArgs): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async checkUser(
    { plainPassword }: UserCredentials,
    { hashedPassword }: HashedUser
  ): Promise<boolean> {
    return this.checkPassword({ plainPassword, hashedPassword });
  }

  async hashUser({ plainPassword, ...user }: PlainUser): Promise<HashedUser> {
    const hashedPassword = await this.hashPassword(plainPassword);
    return {
      ...user,
      hashedPassword,
    };
  }
  async hashUsers(users: PlainUser[]): Promise<HashedUser[]> {
    const items = await Promise.all(users.map((item) => this.hashUser(item)));
    return items;
  }
  async hashUserPatch({
    plainPassword,
    ...user
  }: UpdatePlainUser): Promise<UpdateHasedUser> {
    let hashedPassword;
    if (plainPassword !== undefined) {
      hashedPassword = await this.hashPassword(plainPassword);
    }
    return {
      ...user,
      hashedPassword,
    };
  }
}
