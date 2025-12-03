import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './modules/seeder/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Seeder');

  try {
    logger.log('Initializing NestJS application...');
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    logger.log('Getting SeederService...');
    const seederService = app.get(SeederService);

    logger.log('Starting database seeding process...');
    await seederService.seed();

    logger.log('Seeding completed successfully!');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding:', error);
    process.exit(1);
  }
}

bootstrap();

