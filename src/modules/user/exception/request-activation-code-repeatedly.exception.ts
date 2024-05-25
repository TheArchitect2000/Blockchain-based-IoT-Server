import { HttpException } from '@nestjs/common';

export class requestActivationCodeRepeatedlyException extends HttpException {
  constructor(WaitingTime) {
    super(
      {
        status: 409,
        success: false,
        date: new Date(),
        message:
          'You cannot request activation code repeatedly. Please wait a few minutes.',
        data: {
          waitingTime: WaitingTime,
        },
      },
      409,
    );
  }
}
