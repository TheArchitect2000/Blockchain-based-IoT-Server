import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class StorxService {
  constructor(private jwtService: JwtService) {}

  private async jwtSign(): Promise<string> {
    const payload = {
      client_id: 'a5a0f06c-7651-4f71-95a5-44fa46ca6e8b',
      exp: Math.floor(Date.now() / 1000) + 5 * 60,
    };
    return this.jwtService.signAsync(payload, {
      secret: '$2a$10$4THkK2FfT2Y7AIbU0pBFPOpmKeTfrzs8On2Qe8L362D4DR8VI52gO',
    });
  }

  async constructUri(): Promise<string> {
    const jwtToken = await this.jwtSign();
    return `${process.env.STORX_AUTH_HOST}?client_id=${process.env.STORX_CLIENT_ID}&client_secret=${jwtToken}&redirect_uri=${process.env.STORX_CALLBACK_URI}&scope=read,write`;
  }

  async handleCallback(accessGrant: string): Promise<void> {
    console.log('Access Grant received:', accessGrant);
    // Here you can handle the access grant, e.g., store it in the database
  }

  async developerLogin() {
    const { data } = await axios.post(
      `${process.env.STORX_HOST}/api/v0/developer/auth/token`,
      {
        email: process.env.STORX_AUTH_EMAIL,
        password: process.env.STORX_AUTH_PASSWORD,
      },
    );
    return data;
  }

  /*
	{
  		access_key_id: 'jvdbfnaloekozsxj7sl23lqnobkq',
  		secret_key: 'j37ljdviecfb4qldccdx5kbadg7cq3ekyb6o76bawincsvchwl3bw',
  		endpoint: 'https://gateway.storx.io'
	}
	*/
}

// import {
//   S3Client,
//   CreateBucketCommand,
//   ListObjectsCommand,
//   GetObjectCommand,
//   PutObjectCommand,
//   DeleteObjectsCommand,
// } from '@aws-sdk/client-s3';

// let bucketProps = {
//   region: 'auto',
//   endpoint: '', //https://gateway.storx.io
//   credentials: {
//     accessKeyId: '', //jv3vsap36i6rnzctvpmw33zhg5qa
//     secretAccessKey: '', //jz3qahozyd7ukcg3i2omkt37ee75mjkjs575657v7qwzi7czgibjq
//   },
//   forcePathStyle: true,
// };

// let client;

// async function setBucketProps(
//   endPoint: string,
//   accessKeyId: string,
//   secretAccessKey: string,
// ) {
//   bucketProps = {
//     region: 'auto',
//     endpoint: endPoint, //https://gateway.storx.io
//     credentials: {
//       accessKeyId: accessKeyId, //jv3vsap36i6rnzctvpmw33zhg5qa
//       secretAccessKey: secretAccessKey, //jz3qahozyd7ukcg3i2omkt37ee75mjkjs575657v7qwzi7czgibjq
//     },
//     forcePathStyle: true,
//   };
//   client = new S3Client(bucketProps);
// }

// function getStorxBucket() {
//   return bucketProps;
// }

// const CreateBucket = async (bucketName) => {
//   try {
//     const command = new CreateBucketCommand({ Bucket: bucketName });
//     await client.send(command);
//     console.log('Bucket created successfully.\n');
//   } catch (error) {
//     //console.log(error.message);
//     console.log(`Store X Bucket: ${bucketName} Founded Successfully`);
//   }
//   return bucketName;
// };

// const EmptyBucket = async ({ bucketName }) => {
//   const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
//   const { Contents } = await client.send(listObjectsCommand);
//   const keys = Contents.map((c) => c.Key);

//   const deleteObjectsCommand = new DeleteObjectsCommand({
//     Bucket: bucketName,
//     Delete: { Objects: keys.map((key) => ({ Key: key })) },
//   });
//   await client.send(deleteObjectsCommand);
//   console.log(`${bucketName} emptied successfully.\n`);
// };

// const UploadFile = async ({
//   reader,
//   bucketName,
//   deviceID,
// }: {
//   reader: string;
//   bucketName: string;
//   deviceID: string;
// }) => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth() + 1;
//   const day = now.getDate();
//   const hour = now.getHours();
//   const timestamp = now.getTime();

//   const key = `${deviceID}/${year}/${month}/${day}/${hour}/${timestamp}.log`;

//   const params = {
//     Bucket: bucketName,
//     Key: key,
//     Body: reader, // Assuming reader is a readable stream or Buffer
//   };

//   try {
//     const data = await client.send(new PutObjectCommand(params));
//     console.log(`${key} uploaded successfully.`);
//     return { data: data, success: true };
//   } catch (err) {
//     console.error('Error uploading file:', err);
//     return { data: null, success: false };
//   }
// };

// const DownloadFiles = async ({
//   writer,
//   bucketName,
//   deviceID,
//   startTime,
//   endTime,
// }: {
//   writer: any[];
//   bucketName: string;
//   deviceID: string;
//   startTime: Date;
//   endTime: Date;
// }) => {
//   const startPath = `${deviceID}/${startTime.getFullYear()}/${
//     startTime.getMonth() + 1
//   }/${startTime.getDate()}/${startTime.getHours()}`;
//   const endPath = `${deviceID}/${endTime.getFullYear()}/${
//     endTime.getMonth() + 1
//   }/${endTime.getDate()}/${endTime.getHours()}`;

//   // Determine common prefix
//   const commonPrefix = startPath
//     .split('/')
//     .filter((part, i) => part === endPath.split('/')[i])
//     .join('/');

//   try {
//     const command = new ListObjectsCommand({
//       Bucket: bucketName,
//       Prefix: commonPrefix,
//     });
//     const { Contents } = await client.send(command);

//     if (Contents) {
//       for (const file of Contents) {
//         const obj = await client.send(
//           new GetObjectCommand({ Bucket: bucketName, Key: file.Key }),
//         );
//         const data = await obj.Body.transformToByteArray();
//         const jsonData = JSON.parse(new TextDecoder().decode(data));
//         writer.push({
//           key: file.Key,
//           data: jsonData,
//         });
//       }
//     }

//     console.log('Files downloaded successfully.');
//   } catch (err) {
//     console.error('Error downloading files:', err);
//     throw err;
//   }
// };

// const axios = require('axios');

// let developer_data = {
//   token: '',
//   expire: '',
// };

// function isExpired(expiresAt: string | Date): boolean {
//   const expiresAtDate = new Date(expiresAt);
//   const now = new Date();
//   const remainingTime = expiresAtDate.getTime() - now.getTime();
//   console.log('remaining time is:', remainingTime);
//   return remainingTime <= 0;
// }

// async function checkDeveloperToken() {
//   if (developer_data.token && developer_data.expire) {
//     if (isExpired(developer_data.expire) == false) {
//       console.log('Developer token is not expired');
//     } else {
//       return await developerLogin();
//     }
//   } else {
//     return await developerLogin();
//   }
// }

// async function developerLogin() {
//   const { data } = await axios.post(
//     `${process.env.STORX_HOST}/api/v0/developer/auth/token`,
//     {
//       email: 'prince.soamedi12334@gmail.com',
//       password: 'Prince@143$',
//     },
//   );
//   developer_data = {
//     token: data.token,
//     expire: data.expiresAt,
//   };

//   //console.log('Developer data is:', developer_data);

//   return developer_data;
// }

// export default {
//   getStorxBucket,
//   CreateBucket,
//   setBucketProps,
//   EmptyBucket,
//   UploadFile,
//   DownloadFiles,
//   developerLogin,
//   createUserAndGenerateStorXKey,
// };
