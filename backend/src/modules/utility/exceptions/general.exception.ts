import { HttpException } from '@nestjs/common';

export class GereralException extends HttpException {
  constructor(statusCode, message) {
    super(
      {
        statusCode: statusCode,
        success: false,
        date: new Date(),
        message: message,
        // data:data
      },
      statusCode,
    );
  }
}
