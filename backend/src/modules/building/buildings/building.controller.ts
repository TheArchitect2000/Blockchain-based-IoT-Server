import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BuildingService } from './building.service';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import {
  CreateBuildingRequestBodyDto,
  EditBuildingRequestBodyDto,
} from '../dto/building.dto';
import { UserService } from 'src/modules/user/services/user/user.service';

@ApiTags('Building')
@Controller('app/v1/building')
export class BuildingController {
  constructor(
    private service: BuildingService,
    private readonly userService?: UserService,
  ) {}

  async isAdmin(userId: string) {
    const profile = (await this.userService.getUserProfileByIdFromUser(
      userId,
    )) as any;
    if (
      !profile ||
      !profile?.roles[0]?.name ||
      profile?.roles.some((role) => role.name === 'super_admin') == false
    ) {
      return false;
    } else {
      return true;
    }
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creating new building',
    description:
      'Adding new building that includes floors and units with devices',
  })
  async createNewBuilding(
    @Body() body: CreateBuildingRequestBodyDto,
    @Request() request,
  ) {
    return this.service.addNewBuilding(body, request.user.userId);
  }

  @Patch('/edit-by-build-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit building',
    description: 'Edit an building that includes floors and units with devices',
  })
  async editBuildingByBuildId(
    @Body() body: EditBuildingRequestBodyDto,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    return this.service.editBuildingByBuildId(
      body.buildId,
      body.data,
      isAdmin,
      request.user.userId,
    );
  }

  @Get('/get-all-buildings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'All buildings',
    description: 'This API returns all created buildings with details',
  })
  async getAllBuildings(@Request() request) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }
    return this.service.getAllBuildings();
  }

  @Get('/get-buildings-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'All user buildings',
    description: 'This API returns all created buildings of an user',
  })
  async getAllBuildingsByUserId(
    @Request() request,
    @Param('userId') userId: string,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return this.service.getAllBuildingsByUserId(userId);
  }

  @Get('/get-building-by-build-id/:buildId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'All user buildings',
    description: 'This API returns all created buildings of an user',
  })
  async getBuildingByBuildId(
    @Request() request,
    @Param('buildId') buildId: string,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    return this.service.getBuildingByBuildId(
      buildId,
      isAdmin,
      request.user.userId,
    );
  }

  @Delete('delete-by-build-id/:buildId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Deletes building by it's id.",
    description: 'This api requires build id.',
  })
  async deleteBuildingByBuildId(
    @Param('buildId') buildId: string,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    return this.service.deleteBuildingByBuildId(
      buildId,
      isAdmin,
      request.user.userId,
    );
  }
}
