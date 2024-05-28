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
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { verifyProofDto } from '../dto/zkp-dto';
import { ZkpService } from '../services/zkp.service';

  @ApiTags('Manage ZKP')
  @Controller('app')
  export class zkpController {
    private verfiyProof;
    constructor (private readonly zkpRequestService?: ZkpService) {
      this.verfiyProof = zkpRequestService.zpkProof
    }

  @Post('v1/zkp/verifier')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verifying the proof.',
    description:
      'This api verifies then user proof code.',
  })
  async verifyProof(@Body() body: verifyProofDto, @Request() request) {
    console.log('We are in Verify Proof section', body);

    if (
      body.proof === null ||
      body.proof === undefined ||
      body.proof === ''
    ) {
      let errorMessage = 'proof is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.verfiyProof(body.proof);
  }
  }
  