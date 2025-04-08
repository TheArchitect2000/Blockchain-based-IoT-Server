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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MediaService } from '../services/media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceTypeEnum } from 'src/modules/utility/enums/resource-type.enum';
import { uploadFileDto } from '../dto/media-dto';
import { Types } from 'mongoose';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';

@ApiTags('Upload Media')
@Controller('app')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('v1/media/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
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
        file: {
          type: 'string',
          format: 'binary',
        },
        path: {
          type: 'string',
          description: 'Custom path within uploads directory (e.g. NFT/metadata)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload media file with optional custom path.' })
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
    @Body() body: uploadFileDto,
    @Request() request,
  ) {
    console.log('We are in upload media upload');

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
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Media Id is required and must be a valid ObjectId.',
      );
    }
    return await this.mediaService.getMediaById(mediaId);
  }
}
