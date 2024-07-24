import { HttpException } from '@nestjs/common';

export class OTPException extends HttpException {
  constructor(statusCode, success, message) {
    super(
      {
        status: statusCode,
        success: success,
        date: new Date(),
        message: message,
        // errorData: error,
        data: [],
      },
      statusCode,
    );
  }
}
