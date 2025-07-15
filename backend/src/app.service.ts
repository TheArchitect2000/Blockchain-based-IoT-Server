import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  deviceList: any[] = [];
  private dataFiles = [
    {
      fileName: '',
      content: null,
      filePath: path.join(__dirname, '..', 'src/data'),
    },
    {
      fileName: '',
      content: null,
      filePath: path.join(__dirname, '..', 'uploads/devices'),
    },
    /* {
      fileName: 'devices.json',
      content:
        '[{ "fileName": "ecard.png", "title": "E-Card", "type": "E-CARD" }, { "fileName": "multisensor.png", "title": "Multi Sensor", "type": "MULTI_SENSOR" }, { "fileName": "motionsensor.png", "title": "Motion Sensor", "type": "MOTION_SENSOR" }]',
      filePath: path.join(__dirname, '..', 'src/data', 'devices.json'),
    }, */
  ];

  async loadDeviceList() {
    const filePath = path.join(__dirname, '..', 'src/data', 'devices.json');

    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      this.deviceList = JSON.parse(fileContent).map((device) => ({
        ...device,
        url: `${process.env.HOST_PROTOCOL}${process.env.PANEL_URL}/${process.env.HOST_SUB_DIRECTORY}/uploads/devices/${device.fileName}`,
      }));
    } catch (error) {
      console.error('Error reading devices.json:');
    }
  }

  async createDataFiles() {
    for (const dataFile of this.dataFiles) {
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
            //console.log(`File ${filePath} already exists. Skipping creation.`);
          } catch (error) {
            if (error.code === 'ENOENT') {
              // File does not exist, so create it
              await fs.promises.writeFile(filePath, content);
              //console.log(`File ${filePath} created successfully.`);
            } else {
              throw error; // Re-throw unexpected errors
            }
          }
        } else {
          //console.log(`Folder ${directoryPath} created successfully.`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`);
      }
    }

    this.loadDeviceList();
  }

  getDeviceUrlByType(deviceType: string) {
    if (!this.deviceList || this.deviceList.length === 0) {
      console.log('Device list is empty or not loaded.');
      return null;
    }

    const device = this.deviceList.find((d) => d.type === deviceType);

    if (device) {
      return `${process.env.HOST_PROTOCOL}${process.env.PANEL_URL}/${process.env.HOST_SUB_DIRECTORY}/uploads/devices/${device.fileName}`;
    } else {
      console.log(`Device type "${deviceType}" not found.`);
      return null;
    }
  }
}
