import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';
import { join } from 'path';
import { Inject, Logger } from '@nestjs/common';
import { TestService } from './modules/broker/services/test.service';
import { MqttLogService } from './modules/broker/services/mqtt-log.service';
import { readFileSync } from 'fs';
import { SyslogService } from './modules/logging/syslog.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const syslog = app.get(SyslogService);

  console.log = (...args) => {
    const msg = args
      .map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
      .join(' ');
    syslog.log(msg);
  };

  const config = new DocumentBuilder()
    .setTitle('FidesInnova')
    .setDescription('The FidesInnova API description')
    .setVersion('4.0.0')
    .addTag('FidesInnova')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('app/api', app, document);

  app.useStaticAssets(join(__dirname, '../uploads'));

  const hostName = process.env.PANEL_URL || '';
  const adminHostName = process.env.ADMIN_URL || '';

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        `https://${hostName}`,
        `https://${adminHostName}`,
        'https://explorer.fidesinnova.io',
        'http://localhost:4000',
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.HOST_PORT);
  console.log(
    '\x1B[32m \nApplication successfully started on port \x1B[0m',
    process.env.HOST_PORT,
  );

  let mqttLogService: MqttLogService = new MqttLogService();
  let testService: TestService = new TestService(mqttLogService);
  testService.printMsg();
  testService.callDeviceModule();

  // Run MQTT Server.
  const mqttServerRunner = require('./modules/broker/server/mqtt-server');

  // Run Blockly Server.
  const blocklyServerRunner = require('./modules/blockly/server/blockly-server');
}
bootstrap();
