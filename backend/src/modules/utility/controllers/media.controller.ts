import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Param,
  Request,
  HttpException,
  HttpStatus,
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
import { GereralException } from '../exceptions/general.exception';
import { MediaService } from '../services/media.service';
import { Types } from 'mongoose';
import { ResourceTypeEnum } from '../enums/resource-type.enum';

@ApiTags('Manage Medias')
@Controller('')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('v1/media/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
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
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'upload media file.' })
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
    @Body() body: uploadFileDto,
    @Request() request,
  ) {
    try {
      const uploadResult = await this.mediaService.insertMedia(
        type,
        body,
        request.user.userId,
        file,
      );

      return uploadResult;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while uploading the file.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return false;
    }
  }

  @Get('v1/media/get-by-id/:mediaId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a media by id.',
    description: 'Get a media by media id. This api requires a media id.',
  })
  async getMediaById(@Param('mediaId') mediaId: string) {
    if (!Types.ObjectId.isValid(mediaId)) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Media Id is required and must be a valid ObjectId.',
      );
    }
    return await this.mediaService.getMediaById(mediaId);
  }
}
