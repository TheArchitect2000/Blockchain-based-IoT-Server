import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from '../repository/subscription.repository';
import { v4 as uuidv4 } from 'uuid';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { UserService } from 'src/modules/user/services/user/user.service';
import { unsubscribe } from 'diagnostics_channel';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository?: SubscriptionsRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService?: UserService,
  ) {}

  async generateUserToken() {
    const token = uuidv4();
    return token;
  }

  async saveUserToken(token: string, userId: string) {
    return await this.subscriptionsRepository.saveToken({ token, userId });
  }

  async generateAndsaveUserToken(userId: string) {
    const userToken = await this.generateUserToken();
    const res = await this.saveUserToken(userToken, userId);
    return { token: userToken, query: res };
  }

  async validateToken(token: string) {
    const res = await this.subscriptionsRepository.checkTokenExist(token);
    if (res) {
      await this.subscriptionsRepository.deleteToken(token);
      return { status: true, userId: res.userId };
    } else {
      return { status: false };
    }
  }

  async unsubscribeEmailWithToken(token: string) {
    const isExist = await this.validateToken(token);

    if (isExist.status) {
      await this.userService.editUserByUser(isExist.userId, {
        unsubscribed: true,
      });
      return true;
    } else {
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'The link you used is invalid or has expired.',
      );
    }
  }

  async setEmailSubscriptionWithUserId(userId: string, subscribe: boolean) {
    try {
      await this.userService.editUserByUser(userId, {
        unsubscribed: !subscribe,
      });
    } catch (error) {
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'There was an error while setting user email subscription .',
      );
    }

    return true;
  }

  async checkUserUnsubscribed(userId: string): Promise<boolean> {
    const res = await this.userService.getUserProfileByIdFromUser(userId);
    console.log('Ghol res:', res);

    return res.unsubscribed ?? false;
  }
}
