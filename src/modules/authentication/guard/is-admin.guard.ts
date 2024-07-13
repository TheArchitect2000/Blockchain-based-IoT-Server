import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(@Inject(UserService) private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const res = await this.userService.findAUserById(user.userId);

      if (res) {
        setTimeout(() => {
          console.log('User Datas Is:', res);
        }, 5000);
        return true;
      } else {
        throw new UnauthorizedException('You do not have admin privileges.');
      }
    } else {
      throw new UnauthorizedException('You do not have admin privileges.');
    }
  }
}
