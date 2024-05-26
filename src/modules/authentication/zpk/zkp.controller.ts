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
  import { AuthenticationService } from './authentication.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { verifyProofDto } from 'src/modules/service/data-transfer-objects/verify-proof.dto';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';

  @ApiTags('Manage Zpk')
  @Controller('app')
  export class zpkController {
   
  
  @Post('v1/service/proof')
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

    return false;
  }
  }
  