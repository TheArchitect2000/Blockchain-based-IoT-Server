import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/services/user/user.service';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { GereralException } from '../exceptions/general.exception';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  /* canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
 */

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePermissions = this.reflector.get<string[]>( // gets the permissions in an array format
      'permissions',
      context.getHandler(),
    );

    console.log('routePermissions: ', routePermissions);

    let userRoles: any = null;
    let rolePermissions: any = null;
    let userPermissions: string[] = [];

    let hasPermission: boolean;

    console.log('hasPermission', hasPermission);

    let userId: any = null;
    let user: any = [];

    if (context.getArgs()[0].user !== undefined) {
      console.log(
        'context.getArgs()[0].user.userId',
        context.getArgs()[0].user.userId,
      );
      userId = context.getArgs()[0].user.userId;

      await this.userService
        .findAUserById(userId)
        .then((data) => {
          user = data;

          userRoles = user.roles;

          userRoles.forEach((roleItem) => {
            rolePermissions = roleItem.permissions;
            rolePermissions.forEach((permissionItem) => {
              userPermissions.push(permissionItem.name);
            });
          });

          console.log('userPermissions: ---> ', userPermissions);

          const checkPermission = () =>
            routePermissions.every((routePermission) =>
              userPermissions.includes(routePermission),
            );

          hasPermission = checkPermission();
          console.log('hasPermission1: ', hasPermission);

          console.log('checkPermission(): ', checkPermission());
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a user!';
          throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    console.log('hasPermission2: ', hasPermission);

    return hasPermission;
  }
}
