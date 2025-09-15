import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { StorxRepository } from '../repositories/storx.repository';
import { InsertStorxDto } from '../data-transfer-objects/insert-storx.dto';

@Injectable()
export class StorxService {
  constructor(
    private jwtService: JwtService,
    private readonly storxRepository: StorxRepository,
  ) {}

  private async jwtSign(
    clientId: string,
    clientSecret: string,
  ): Promise<string> {
    const payload = {
      client_id: clientId,
      exp: Math.floor(Date.now() / 1000) + 5 * 60,
    };
    return this.jwtService.signAsync(payload, {
      secret: clientSecret,
    });
  }

  async constructUri(): Promise<string> {
    const credentials = await this.requestCredential();
    const jwtToken = await this.jwtSign(
      credentials.client_id,
      credentials.client_secret,
    );
    return `${process.env.STORX_AUTH_HOST}?client_id=${credentials.client_id}&client_secret=${jwtToken}&redirect_uri=${process.env.STORX_CALLBACK_URI}&scope=read,write`;
  }

  async saveCredentials(body: InsertStorxDto, userId: string) {
    try {
      const accessData = await this.requestAcceess(body.accessGrant);

      await this.storxRepository.insertStorx({
        ...body,
        accessKeyId: accessData.access_key_id,
        secretKey: accessData.secret_key,
        endpoint: accessData.endpoint,
        userId,
      });
    } catch (error) {
      throw new GeneralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, error);
    }
  }

  async getCredentials(userId: string) {
    return this.storxRepository.getStorxByUserId(userId);
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

  async requestCredential() {
    // try {
    //   const { data, status } = await axios.post(
    //     `${process.env.STORX_HOST}/api/v0/developer/auth/oauth2/clients`,
    //     {
    //       name: process.env.STORX_NAME,
    //       redirect_uris: process.env.STORX_CALLBACK_URI,
    //     },
    //   );
    //   if (status === 401) {
    //     await this.developerLogin();
    //     return this.requestCredential();
    //   }
    //   return data;
    // } catch (error) {
    //   throw new GeneralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, error);
    // }

    return {
      client_id: process.env.STORX_CLIENT_ID,
      client_secret: process.env.STORX_CLIENT_SECRET,
    };
  }

  async requestAcceess(accessGrant: string) {
    try {
      const { data } = await axios.post(
        `${process.env.STORX_STG_AUTH_URL}/v1/access`,
        {
          access_grant: accessGrant,
          public: false,
        },
      );
      return data;
    } catch (error) {
      throw new GeneralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, error);
    }
  }
}
