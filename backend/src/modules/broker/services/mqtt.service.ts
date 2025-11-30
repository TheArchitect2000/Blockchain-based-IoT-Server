import { Injectable, OnModuleInit } from '@nestjs/common';
const aedes = require('aedes')();
import * as fs from 'fs';
import axios from 'axios';
import { DeviceEventsEnum } from '../enums/device-events.enum';
import { ContractService } from 'src/modules/smartcontract/services/contract.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { createServer } from 'tls';
import { LogService } from 'src/modules/logging/log.service';
const wsStream = require('websocket-stream');

const triggerData = {};

function shouldTrigger(id: string, hours: number): boolean {
  const now = Date.now();

  if (triggerData[id]) {
    const lastTriggerTime = triggerData[id];
    const hoursSinceLastTrigger = (now - lastTriggerTime) / (1000 * 60 * 60);

    if (hoursSinceLastTrigger >= hours) {
      triggerData[id] = now;
      return true;
    } else {
      return false;
    }
  } else {
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

  private deviceCache: Map<string, any> = new Map();

  async getDeviceType(device: string) {
    if (this.deviceCache.has(device)) {
      return this.deviceCache.get(device);
    }

    const deviceData = await this.deviceService.getDeviceInfoByEncryptedId(
      String(device),
      '',
      true,
    );

    this.deviceCache.set(device, deviceData);

    return deviceData;
  }

  async onModuleInit() {
    await this.brokerStart();
  }

  async brokerStart() {
    const mqttPorts = {
      mqtt: 1883,
      mqtts: process.env.MQTT_BROKER_PORT || 8883,
      ws: 8080,
      wss: process.env.MQTT_WEBSOCKET_PORT || 8081,
    };

    // Try to load TLS certificates, but don't crash if they're missing/expired
    let tlsOptions: { key: Buffer; cert: Buffer } | null = null;

    try {
      const keyPath = '/etc/nginx/ssl/privkey.pem';
      const certPath = '/etc/nginx/ssl/fullchain.pem';

      // Check if files exist
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        tlsOptions = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        };
        LogService.log('MQTT: TLS certificates loaded successfully');
      } else {
        LogService.log(
          'MQTT: TLS certificate files not found, starting without TLS',
        );
      }
    } catch (error) {
      console.error('MQTT: Failed to load TLS certificates:', error.message);
      LogService.log(`MQTT: Failed to load TLS certificates: ${error.message}`);
      LogService.log('MQTT: Starting without TLS (non-secure mode)');
    }

    // Start non-secure MQTT server (always available)
    const mqttServer = require('net').createServer(aedes.handle);
    mqttServer.listen(mqttPorts.mqtt, function () {
      LogService.log(`MQTT started and listening on port ${mqttPorts.mqtt}`);
    });

    // Start non-secure WebSocket server
    const wsServer = require('http').createServer();
    wsStream.createServer({ server: wsServer }, aedes.handle);
    wsServer.listen(mqttPorts.ws, function () {
      LogService.log(
        `MQTT over WebSocket started and listening on port ${mqttPorts.ws}`,
      );
    });

    // Start secure servers only if certificates are available
    if (tlsOptions) {
      try {
        const tlsServer = createServer(tlsOptions, aedes.handle);

        tlsServer.on('error', (err) => {
          console.error('MQTT TLS Server Error:', err.message);
          LogService.log(`MQTT TLS Server Error: ${err.message}`);
        });

        tlsServer.listen(mqttPorts.mqtts, function () {
          LogService.log(
            `MQTT over TLS / MQTTS started and listening on port ${mqttPorts.mqtts}`,
          );
        });
      } catch (error) {
        console.error('MQTT: Failed to start TLS server:', error.message);
        LogService.log(`MQTT: Failed to start TLS server: ${error.message}`);
      }

      try {
        const httpServer = require('https').createServer(tlsOptions);

        httpServer.on('error', (err) => {
          console.error('MQTT HTTPS Server Error:', err.message);
          LogService.log(`MQTT HTTPS Server Error: ${err.message}`);
        });

        wsStream.createServer({ server: httpServer }, aedes.handle);

        httpServer.listen(mqttPorts.wss, function () {
          LogService.log(
            `MQTT over WebSocket Secure / WSS started and listening on port ${mqttPorts.wss}`,
          );
        });
      } catch (error) {
        console.error('MQTT: Failed to start WSS server:', error.message);
        LogService.log(`MQTT: Failed to start WSS server: ${error.message}`);
      }
    }

    aedes.on('subscribe', async function (subscriptions, client) {
      LogService.log(
        `MQTT client ${
          client ? client.id : client
        } subscribed to topics: ${subscriptions
          .map((s) => s.topic)
          .join(', ')}`,
      );
    });

    aedes.on('unsubscribe', function (subscriptions, client) {
      LogService.log(
        `MQTT client ${
          client ? client.id : client
        } unsubscribed to topics: ${subscriptions.join(', ')}`,
      );
    });

    const host = 'https://' + process.env.NODE_NAME;

    // Axios will use system's trusted CA certificates by default
    // If NODE_NAME points to a domain with valid Let's Encrypt cert, this will work
    aedes.on('client', async function (client) {
      LogService.log(`New MQTT client connected: ${
        client ? client.id : client
      } to broker,
        ${aedes.id}`);

      try {
        await axios.post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CONNECTED,
        });
      } catch (error) {
        console.error(
          'Failed to log device connection event: ' + error.message,
        );
      }
    });

    aedes.on('clientDisconnect', async function (client) {
      LogService.log(`MQTT client disconnected: ${
        client ? client.id : client
      } to broker,
        ${aedes.id}`);

      try {
        await axios.post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.DISCONNECTED,
        });
      } catch (error) {
        console.error(
          'Failed to log device disconnection event:',
          error.message,
        );
      }
    });

    aedes.on('clientError', async function (client, err) {
      LogService.log(
        `MQTT client error: ${client ? client.id : client} - Error: ${
          err.message
        }`,
      );

      try {
        await axios.post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CLIENTERROR,
        });
      } catch (error) {
        console.error('Failed to log client error event:', error.message);
      }
    });

    aedes.on('connectionError', async function (client, err) {
      LogService.log(
        `MQTT connection error: ${client} - Error: ${err.message}`,
      );

      try {
        await axios.post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.CONNECTIONERROR,
        });
      } catch (error) {
        console.error('Failed to log connection error event:', error.message);
      }
    });

    aedes.on('publish', async (packet, client) => {
      if (client) {
        let payload = packet.payload.toString();
        if (payload.includes('from')) {
          let parsedPayload;
          try {
            parsedPayload = JSON.parse(payload);
          } catch (e) {
            console.error('Failed to parse payload:', e);
            return;
          }

          if (parsedPayload.data?.proof) {
            const { proof, ...dataWithoutProof } = parsedPayload.data;
            const deviceData = await this.getDeviceType(parsedPayload.from);
            await this.contractService.storeZKP(
              String(process.env.NODE_NAME),
              String(parsedPayload.from),
              JSON.stringify(proof),
              JSON.stringify(dataWithoutProof),
            );
          }

          if (shouldTrigger(String(parsedPayload.from), 6)) {
            try {
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
            } catch (error) {
              console.error('Error updating device HV and FV:', error);
            }
          }

          try {
            await axios.post(host + '/app/v1/broker-mqtt-log/log-device-data', {
              deviceEncryptedId: parsedPayload.from,
              event: DeviceEventsEnum.PUBLISHED,
              data: parsedPayload.data,
              senderDeviceEncryptedId: client.id,
            });
          } catch (error) {
            console.error('Failed to log device data:', error.message);
          }

          if (client.id !== parsedPayload.from) {
            aedes.publish({
              topic: parsedPayload.from,
              payload: payload,
            });
          }
        }
      }
    });

    aedes.on('subscribe', async function (subscriptions, client) {
      try {
        await axios.post(host + '/app/v1/broker-mqtt-log/log-device-event', {
          deviceEncryptedId: client.id,
          event: DeviceEventsEnum.SUBSCRIBED,
        });
      } catch (error) {
        console.error('Failed to log subscription event:', error.message);
      }
    });

    aedes.on('client', function (client) {
      LogService.log(`new client connected: ${client.id}`);
    });
  }
}
