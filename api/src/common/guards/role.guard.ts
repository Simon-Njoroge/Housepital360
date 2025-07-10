import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decolator';
import { Request } from 'express';
import { UserRole } from 'src/user/entities/user.entity';
import { JWTPayload } from '../strategies/at.strategy';

interface UserRequest extends Request {
  user?: JWTPayload;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    if (!user || !user.role) {
      return false; // No user or role in request
    }

    const userRole = user.role as UserRole;

    return requiredRoles.includes(userRole);
  }
}
