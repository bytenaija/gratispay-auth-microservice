import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomDecorator } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export interface IGiveAwayUser {
  userId: string;
  userName: string;
  bearerToken: string;
  customerId?: string;
}

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = (bypass = true): CustomDecorator =>
  SetMetadata(IS_PUBLIC_KEY, bypass);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
