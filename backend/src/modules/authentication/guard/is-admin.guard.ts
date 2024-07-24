import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(@Inject(UserService) private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const res = (await this.userService.findAUserById(user.userId)) as any;

      if (
        !res ||
        !res?.roles[0]?.name ||
        res?.roles[0]?.name != 'super_admin'
      ) {
        throw new ForbiddenException('You do not have admin privileges.');
      } else {
        return true;
      }
    } else {
      throw new ForbiddenException('User not found.');
    }
  }
}
