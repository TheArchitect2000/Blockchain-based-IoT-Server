import { Injectable, Logger } from '@nestjs/common';

/**
 * SMS sending service.
 */

@Injectable()
export class SMSService {
  constructor(/* private readonly HttpService?: HttpService */) {}

  async sendSMS(mobile, message): Promise<any> {
    /* await this.HttpService.post(
      String(process.env.PARSGREENURL),
      {
        SmsCode: message,
        Mobile: mobile,
        TemplateId: 1,
      },
      {
        headers: {
          Authorization: String(process.env.PARSGREENTOKEN),
        },
      },
    )
      .toPromise()
      .then((Response) => {
        if (Response.status) {
          let FinalReult = null;
          return Logger.verbose(
            `Activation code sent successfully . Mobile : ${mobile} Code : ${message} Date : ${new Date()}`,
          );
        }
      })
      .catch((Error) => {
        return Logger.log(
          `Error sending Activation code : ${mobile} code : ${message} Date : ${new Date()} Error : ${Error}`,
        );
      }); */
  }
}
