import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ContractModel } from '../model/contract.model';

@Injectable()
export class ContractRepository {
  private result;
  private selectCondition: 'userId manufacturerName deviceType hardwareVersion firmwareVersion lines commitmentData createdAt transactionId';

  constructor(
    @InjectModel('contract')
    private readonly contractModel?: ContractModel,
  ) {}

  async saveCommitment(data) {
    await this.contractModel
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

  async getCommitmentByCommitmentIdAndNodeId(
    commitmentId: string,
    nodeId: string,
  ) {
    console.log('we are in getCommitmentByCommitmentIdAndNodeId repository!');

    return await this.contractModel
      .findOne({ _id: commitmentId, nodeId: nodeId })
      .where({})
      .populate([])
      .select(this.selectCondition);
  }

  async deleteCommitmentByCommitmentIdAndNodeId(
    commitmentId: string,
    nodeId: string,
  ) {
    console.log(
      'we are in deleteCommitmentByCommitmentIdAndNodeId repository!',
    );

    return await this.contractModel
      .deleteOne({ _id: { $eq: commitmentId }, nodeId: { $eq: nodeId } })
      .where({});
  }

  async getCommitmentsByUserId(userId: string) {
    console.log('we are in getCommitmentsByUserId repository!');

    return await this.contractModel
      .find({ userId: userId })
      .where({})
      .populate([])
      .select(this.selectCondition);
  }
}
