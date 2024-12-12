import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
const aedes = require('aedes')();
import * as fs from 'fs';
import axios from 'axios';
import { DeviceEventsEnum } from '../enums/device-events.enum';
import { ContractService } from 'src/modules/smartcontract/services/contract.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { createServer } from 'tls';
const wsStream = require('websocket-stream');

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
    const mqttPorts = {
      mqtt: 1883, // TCP Port: 1883
      mqtts: 8883, // SSL/TLS Port: 8883
      ws: 8080, // WebSocket unencrypted
      wss: 8081, // WebSocket encrypted
    };

    const tlsOptions = {
      key: fs.readFileSync('/etc/nginx/ssl/privkey.pem'),
      cert: fs.readFileSync('/etc/nginx/ssl/fullchain.pem'),
    };

    const tlsServer = createServer(tlsOptions, aedes.handle);

    tlsServer.listen(mqttPorts.mqtts, function () {
      console.log(
        `MQTT over TLS / MQTTS started and listening on port ${mqttPorts.mqtts}`,
      );
    });

    const httpServer = require('https').createServer(tlsOptions);

    wsStream.createServer({ server: httpServer }, aedes.handle);

    httpServer.listen(mqttPorts.wss, function () {
      console.log('websocket server listening on port ', mqttPorts.wss);
    });

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
          '\x1b[0m unsubscribed to topics: ' +
          subscriptions.join('\n'),
        'from broker',
        aedes.id,
      );
    });

    const host = 'https://' + process.env.HOST_NAME_OR_IP;

    // fired when a client connects
    aedes.on('client', async function (client) {
      console.log(
        'Client Connected: \x1b[33m' +
          (client ? client.id : client) +
          '\x1b[0m',
        'to broker',
        aedes.id,
      );

      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      //const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CONNECTED,
        })

        .then(function (response) {
          // handle success
          //console.log(response);
        })
        .catch(function (error) {
          // handle error
          //console.log(error);
        })
        .finally(function () {
          // always executed
        });
    });

    //   aedes.on("client", await this.saveDeviceEvent);

    // fired when a client disconnects
    aedes.on('clientDisconnect', function (client) {
      console.log(
        'Client Disconnected: \x1b[31m' +
          (client ? client.id : client) +
          '\x1b[0m',
        'to broker',
        aedes.id,
      );

      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.DISCONNECTED,
        })
        .then(function (response) {
          // handle success
          // console.log(response);
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
        })
        .finally(function () {
          // always executed
        });
    });

    aedes.on('clientError', function (client, err) {
      console.log('client error', client.id, err.message, err.stack);

      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CLIENTERROR,
        })
        .then(function (response) {
          // handle success
          // console.log(response);
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
        })
        .finally(function () {
          // always executed
        });
    });

    aedes.on('connectionError', function (client, err) {
      console.log('connection error', client, err.message, err.stack);

      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CONNECTIONERROR,
        })
        .then(function (response) {
          // handle success
          // console.log(response);
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
        })
        .finally(function () {
          // always executed
        });
    });

    aedes.on('publish', async (packet, client) => {
      console.log('Published packet: ', packet);

      console.log('Published packet payload: ', packet.payload.toString());

      if (packet && packet.payload) {
        console.log('publish packet:', packet.payload.toString());
      }

      if (client) {
        console.log('message from client', client.id);

        let payload = packet.payload.toString();
        if (payload.includes('from')) {
          let parsedPayload;
          try {
            parsedPayload = JSON.parse(payload);
          } catch (e) {
            console.error(e);
            // Return a default object, or null based on use case.
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
                deviceId: String(deviceData?._id),
                hardwareVersion: Number(String(parsedPayload.data.HV)),
                firmwareVersion: Number(String(parsedPayload.data.FV)),
              } as any,
              'root',
              true,
            );
            console.log(
              `HV and FV of device with id: ${deviceData._id} updated successfully.`,
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
              // handle success
              // console.log(response);
            })
            .catch(function (error) {
              // handle error
              // console.log(error);
            })
            .finally(function () {
              // always executed
            });

          if (client.id !== parsedPayload.from) {
            // last commented code
            console.log(
              '\x1b[33m \nWe are trying to republish node data... \x1b[0m',
            );

            aedes.publish({
              topic: parsedPayload.from,
              payload: payload,
            });
          }
        }
      }
    });

    aedes.on('subscribe', function (subscriptions, client) {
      if (client) {
        console.log('subscribe from client', subscriptions, client.id);
      }

      axios
        .post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.SUBSCRIBED,
        })
        .then(function (response) {
          // handle success
          // console.log(response);
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
        })
        .finally(function () {
          // always executed
        });
    });

    aedes.on('client', function (client) {
      console.log('new client', client.id);
    });
  }
}
