import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionModel } from '../model/subscriptions.model'; // Ensure this is the correct path
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { SaveSubscriptionDTO } from '../dto/subscriptions.dto';
import { DeleteResult } from 'mongoose';

@Injectable()
export class SubscriptionsRepository {
  private result;
  private selectCondition: 'userId token';

  constructor(
    @InjectModel('Subscription')
    private readonly subscriptionModel: SubscriptionModel,
  ) {}

  async saveToken(data: SaveSubscriptionDTO) {
    await this.subscriptionModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while commitment insertion!';
        console.log(error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async checkTokenExist(token: string) {
    return await this.subscriptionModel
      .findOne({ token: token })
      .where({})
      .populate([])
      .select(this.selectCondition);
  }

  async deleteToken(token: string): Promise<DeleteResult> {
    return await this.subscriptionModel
      .deleteOne({ token: token })
      .where({})
      .populate([]);
  }
}
