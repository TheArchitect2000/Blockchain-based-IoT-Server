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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { uploadFileDto } from '../data-transfer-objects/upload-file.dto';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { ResourceTypeEnum } from '../enums/resource-type.enum';
import { GereralException } from '../exceptions/general.exception';
import { MediaService } from '../services/media.service';
import { Types } from 'mongoose';

@ApiTags('Manage Medias')
@Controller('')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('v1/media/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'upload media file.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    enum: ResourceTypeEnum,
    enumName: 'type',
    description: 'Media Type',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // type: { type: 'string' },
        file: {
          // this field name must be the same as FileInterceptor name parameter
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
    @Body() body: uploadFileDto,
    @Request() request,
  ) {
    return await this.mediaService.insertMedia(
      type,
      body,
      request.user.userId,
      file,
    );
  }

  @Get('v1/media/get-by-id/:mediaId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a media by id.',
    description: 'Get a media by media id. This api requires a media id.',
  })
  async getMediaById(@Param('mediaId') mediaId: string) {
    if (
      mediaId === null ||
      mediaId === undefined ||
      mediaId === '' ||
      Types.ObjectId.isValid(String(mediaId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Media Id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.mediaService.getMediaById(mediaId);
  }
}
