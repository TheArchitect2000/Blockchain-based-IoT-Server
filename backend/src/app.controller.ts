import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UserPermissionService } from './modules/user/services/user-permission/user-permission.service';
import { UserRoleService } from './modules/user/services/user-role/user-role.service';
import { UserService } from './modules/user/services/user/user.service';
import { ErrorTypeEnum } from './modules/utility/enums/error-type.enum';
import { GeneralException } from './modules/utility/exceptions/general.exception';
import { JwtAuthGuard } from './modules/authentication/guard/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('app')
export class AppController {
  private result;
  private deviceList: any[] = [];

  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly userPermissionService: UserPermissionService,
    private readonly userRoleService: UserRoleService,
  ) {
    setTimeout(() => {
      this.initializeApplication();
      this.createDataFiles();
    }, 2000);
  }

  async createDataFiles() {
    const dataFiles = [
      {
        fileName: 'devices.json',
        content:
          '[{ "url": "ecard.png", "title": "E-Card", "type": "E-CARD" }, { "url": "motionsensor.png", "title": "Motion Sensor", "type": "MULTI_SENSOR" }]',
        filePath: path.join(__dirname, '..', 'src/data', 'devices.json'),
      },
      {
        fileName: '',
        content: null,
        filePath: path.join(__dirname, '..', 'uploads/devices'), // Example of creating an empty folder
      },
    ];

    for (const dataFile of dataFiles) {
      const { filePath, content } = dataFile;
      const directoryPath =
        content === null ? filePath : path.dirname(filePath); // Determine directory path

      try {
        // Ensure the directory exists
        await fs.promises.mkdir(directoryPath, { recursive: true });

        if (content !== null) {
          try {
            // Check if the file already exists
            await fs.promises.access(filePath, fs.constants.F_OK);
            console.log(`File ${filePath} already exists. Skipping creation.`);
          } catch (error) {
            if (error.code === 'ENOENT') {
              // File does not exist, so create it
              await fs.promises.writeFile(filePath, content);
              console.log(`File ${filePath} created successfully.`);
            } else {
              throw error; // Re-throw unexpected errors
            }
          }
        } else {
          console.log(`Folder ${directoryPath} created successfully.`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`);
      }
    }

    this.loadDeviceList();
  }

  async loadDeviceList() {
    const filePath = path.join(__dirname, '..', 'src/data', 'devices.json');

    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      this.deviceList = JSON.parse(fileContent).map((device) => ({
        ...device,
        url: `${process.env.HOST_PROTOCOL}${process.env.HOST_NAME_OR_IP}/${process.env.HOST_SUB_DIRECTORY}/uploads/devices/${device.url}`,
      }));
    } catch (error) {
      console.error('Error reading devices.json:');
    }
  }

  async initializeApplication() {
    await this.userPermissionService
      .insertDefaultPermissions()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while inserting default permissions!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    await this.userRoleService
      .insertDefaultRoles()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while inserting default roles!';
        console.log(error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('/v1/theme')
  /* @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() */
  @ApiOperation({
    summary: 'get mobile theme colors.',
    description: '',
  })
  async getThemeColors() {
    return {
      logo: process.env.THEME_LOGO,
      text: process.env.THEME_TEXT,
      background: process.env.THEME_BACKGROUND,
      box: process.env.THEME_BOX,
      button: process.env.THEME_BUTTON,
    };
  }

  @Get('/v1/devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get device list.',
    description: '',
  })
  async getDevices() {
    return this.deviceList;
  }
}
