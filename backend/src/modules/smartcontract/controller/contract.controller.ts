import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Patch,
  Delete,
  Request,
  Response,
  UseGuards,
  Param,
  Query,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import {
  publishProofDto,
  removeCommitmentDto,
  removeDeviceDto,
  removeServiceDto,
  RequestFaucetDto,
  storeCommitmentDto,
  verifyProofDto,
} from '../dto/contract-dto';
import { ContractService } from '../services/contract.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import mongoose from 'mongoose';

@ApiTags('Smart Contract')
@Controller('app/v1/contract')
export class contractController {
  constructor(
    private readonly contractService?: ContractService,
    private readonly userService?: UserService,
  ) {
    setTimeout(() => {
      this.contractService.syncAllServices();
      this.contractService.syncAllDevices();
    }, 4000);
  }

  @Post('/verify-zkp')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verifying the proof.',
    description: 'This api verifies then user proof code.',
  })
  async verifyProof(@Body() body: verifyProofDto, @Request() request) {
    console.log('We are in Verify Proof section', body);

    if (body.proof === null || body.proof === undefined || body.proof === '') {
      let errorMessage = 'proof is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.contractService.zpkProof(body.proof);
  }

  @Post('/store-commitment')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Storing the commitment.',
    description:
      'This api will store the user commitment file in smart contract.',
  })
  async storeCommitment(@Body() body: storeCommitmentDto, @Request() request) {
    console.log('We are in Store Commitment section', body);

    return this.contractService.storeCommitment({
      ...body,
      userId: String(request.user.userId),
    });
  }

  @Post('/remove-commitment')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Storing the commitment.',
    description:
      'This api will store the user commitment file in smart contract.',
  })
  async removeCommitment(
    @Body() body: removeCommitmentDto,
    @Request() request,
  ) {
    console.log('We are in Remove Commitment section', body);

    return this.contractService.removeCommitment(
      body.commitmentId,
      body.dbId,
      body.nodeId,
    );
  }

  @Get('/get-wallet-balance')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Balance of wallet.',
    description: 'This api returns balance of entered wallet.',
  })
  async getWalletBalance(@Request() request) {
    const userRes = await this.userService.getUserProfileByIdFromUser(
      request.user.userId || '',
    );

    const walletAddress = userRes.walletAddress || '';

    if (
      walletAddress === null ||
      walletAddress === undefined ||
      walletAddress === ''
    ) {
      let errorMessage = 'walletAddress is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.contractService.getWalletBalance(walletAddress);
  }

  @Get('/my-commitments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'user commitment saved in data base.',
    description:
      'This api returns commitment of a user that are saved in database.',
  })
  async getMyCommitments(@Request() request) {
    return this.contractService.getCommitmentsByUserId(request.user.userId);
  }

  @Get('/admin-wallet')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin wallet address.',
    description: 'This api returns wallet address of admin.',
  })
  async adminWalletAddress() {
    return this.contractService.adminWalletData();
  }

  @Get('/faucet-wallet')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Faucet wallet address.',
    description: 'This api returns wallet address of faucet account.',
  })
  async faucetWalletAddress() {
    return this.contractService.faucetWalletData();
  }

  @Post('/request-faucet')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Requesting faucet.',
    description:
      'This api give some faucet to user wallet address entered in website.',
  })
  async requestFaucet(@Request() request, @Body() body: RequestFaucetDto) {
    const userRes = await this.userService.getUserProfileByIdFromUser(
      request.user.userId || '',
    );

    let walletAddress = userRes.walletAddress || '';
    const faucetOwnerShip = body.ownerShipWalletAddress;

    if (body.type == 'ownership') {
      if (
        faucetOwnerShip === null ||
        faucetOwnerShip === undefined ||
        faucetOwnerShip === ''
      ) {
        let errorMessage = 'Ownership wallet address is not valid!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      }

      if (userRes.ownerShipWallets.includes(faucetOwnerShip)) {
        walletAddress = faucetOwnerShip
      }
    }

    if (
      walletAddress === null ||
      walletAddress === undefined ||
      walletAddress === ''
    ) {
      let errorMessage = `${body.type} wallet address is not valid!`;
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.contractService.requestFaucet(walletAddress);
  }

  @Post('/publish-proof')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Storing the commitment.',
    description:
      'This api will store the user commitment file in smart contract.',
  })
  async zkpPublishProof(@Body() body: publishProofDto, @Request() request) {
    console.log('We are in zkpPublishProof section', body);

    const objectId = String(new mongoose.Types.ObjectId());

    if (body.frontPublish) {
      return {
        objectId: objectId,
        nodeId: process.env.NODE_ID,
      };
    }

    const tx: any = await this.contractService.storeZKP(
      process.env.NODE_ID,
      objectId,
      body.deviceType,
      body.data.HV,
      body.data.FV,
      JSON.stringify(body.data),
      JSON.stringify(body.proof),
    );

    return String(tx.hash);
  }

  /* @Get('/fetch-service')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async fetchService() {
    return this.contractService.fetchAllServices();
  }

  @Post('/remove-service')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async removeService(@Body() body: removeServiceDto) {
    return this.contractService.removeService(body.nodeId, body.serviceId)
  }

  @Get('/fetch-device')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async fetchDevice() {
    return this.contractService.fetchAllDevices();
  }

  @Post('/remove-device')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async removeDevice(@Body() body: removeDeviceDto) {
    return this.contractService.removeSharedDevice(body.nodeId, body.deviceId)
  } */
}
