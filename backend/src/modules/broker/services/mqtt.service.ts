import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
const aedes = require('aedes')();
import * as fs from 'fs';
import axios from 'axios';
import { DeviceEventsEnum } from '../enums/device-events.enum';
import { ContractService } from 'src/modules/smartcontract/services/contract.service';
import { DeviceService } from 'src/modules/device/services/device.service';

const triggerData = {};

function shouldTrigger(id: string, hours: number): boolean {
  const now = Date.now();
  if (triggerData[id]) {
    const lastTriggerTime = triggerData[id];
    const hoursSinceLastTrigger = (now - lastTriggerTime) / (1000 * 60 * 60);
    if (hoursSinceLastTrigger >= hours) {
      triggerData[id] = now; // Update the time
      return true;
    } else {
      return false;
    }
  } else {
    // First time this ID is used
    triggerData[id] = now;
    return true;
  }
}

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(
    private readonly contractService?: ContractService,
    private readonly deviceService?: DeviceService,
  ) {}

  async onModuleInit() {
    console.log('Initialization of MqttService...');
    await this.brokerStart();
  }

  async brokerStart() {
    const host = 'https://' + process.env.HOST_NAME_OR_IP;

    const options = {
      key: fs.readFileSync('assets/certificates/webprivate.pem'),
      cert: fs.readFileSync('assets/certificates/webpublic.pem'),
    };

    // 1. Start MQTT over TLS (port 8883)
    const mqttsServer = require('tls').createServer(options, aedes.handle);
    mqttsServer.listen(8883, function () {
      console.log(
        '\nMQTT server over TLS / MQTTS started and listening on port 8883\n',
      );
    });

    // 2. Start WebSocket over TLS (port 8081)
    const https = require('https');
    const wssServer = https.createServer(options, aedes.handle);
    wssServer.listen(8081, function () {
      console.log(
        '\nMQTT over WebSockets (WSS) started and listening on port 8081\n',
      );
    });

    // Event handling (subscribe, client connect, publish, etc.)
    aedes.on('subscribe', async function (subscriptions, client) {
      console.log(
        'MQTT client \x1b[32m' +
          (client ? client.id : client) +
          '\x1b[0m subscribed to topics: ' +
          subscriptions.map((s) => s.topic).join('\n'),
        'from broker',
        aedes.id,
      );
    });

    aedes.on('unsubscribe', function (subscriptions, client) {
      console.log(
        'MQTT client \x1b[32m' +
          (client ? client.id : client) +
          '\x1b[0m unsubscribed from topics: ' +
          subscriptions.join('\n'),
        'from broker',
        aedes.id,
      );
    });

    aedes.on('client', async function (client) {
      console.log(
        'Client Connected: \x1b[33m' +
          (client ? client.id : client) +
          '\x1b[0m to broker',
        aedes.id,
      );

      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Ignore self-signed cert errors if necessary

      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CONNECTED,
        })
        .then((response) => {
          //console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    aedes.on('clientDisconnect', function (client) {
      console.log(
        'Client Disconnected: \x1b[31m' +
          (client ? client.id : client) +
          '\x1b[0m to broker',
        aedes.id,
      );

      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.DISCONNECTED,
        })
        .then((response) => {
          //console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    aedes.on('publish', async (packet, client) => {
      console.log('Published packet: ', packet);

      if (packet && packet.payload) {
        const payload = packet.payload.toString();
        console.log('Publish payload:', payload);

        if (client) {
          console.log('Message from client:', client.id);

          let parsedPayload;
          try {
            parsedPayload = JSON.parse(payload);
          } catch (e) {
            console.error(e);
            return {};
          }

          if (parsedPayload.data?.proof) {
            const { proof, ...dataWithoutProof } = parsedPayload.data;
            await this.contractService.storeZKP(
              String(process.env.NODE_ID),
              String(client.id),
              dataWithoutProof.Door ? 'MULTI_SENSOR' : 'E_CARD',
              String(dataWithoutProof.HV),
              String(dataWithoutProof.FV),
              JSON.stringify(dataWithoutProof),
              JSON.stringify(proof),
            );
          }

          if (shouldTrigger(String(parsedPayload.from), 6)) {
            const deviceData =
              await this.deviceService.getDeviceInfoByEncryptedId(
                String(parsedPayload.from),
                '',
                true,
              );

            await this.deviceService.editDevice(
              {
                deviceId: String(deviceData._id),
                hardwareVersion: Number(String(parsedPayload.data.HV)),
                firmwareVersion: Number(String(parsedPayload.data.FV)),
              } as any,
              'root',
              true,
            );
          }

          axios
            .post(host + '/app/v1/broker-mqtt-log/log-device-data', {
              deviceEncryptedId: parsedPayload.from,
              event: DeviceEventsEnum.PUBLISHED,
              data: parsedPayload.data,
              senderDeviceEncryptedId: client.id,
            })
            .then(function (response) {
              //console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    });
  }
}
