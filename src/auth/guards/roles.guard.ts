import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../services';
import { ROLES_KEY } from '../decorators';
import { RoleEnum } from '../../constants';
import { PayloadToken } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<RoleEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // * Si no establecen roles, entonces no se necesita autenticación
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;

    return this.authService.validateRoleInUser(user, roles);
  }
}
