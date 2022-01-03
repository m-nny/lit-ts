import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigWrapper } from '../config/config.wrapper';

@Injectable()
export class JwtModuleConfig implements JwtOptionsFactory {
  private config;
  constructor({ config }: ConfigWrapper) {
    this.config = config;
  }
  createJwtOptions(): JwtModuleOptions {
    return {
      ...this.config.jwt,
    };
  }
}
