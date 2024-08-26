import { HttpException, HttpStatus } from '@nestjs/common';

export class GeneralException extends HttpException {
  constructor(statusCode: number, message: string, data?: any) {
    super(
      {
        statusCode: statusCode,
        success: false,
        date: new Date(),
        message: message,
        data: data || null,
      },
      statusCode,
    );
  }
}
