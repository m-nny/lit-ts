import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ConfigWrapper } from '../config/config.wrapper';

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
  async checkPassword({ hashedPassword, plainPassword }: CheckPasswordArgs): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
