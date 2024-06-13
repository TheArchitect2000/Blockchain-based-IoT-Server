import { MqttService } from '../services/mqtt.service';

class MqttServer {
  //   private mqttService: MqttService;

  constructor(
    private readonly mqttService?: MqttService,
  ) {
    this.mqttService = new MqttService();
  }

  async launch() {
    // this.mqttService.brokerStart();
  }
}


let mqttServer = new MqttServer();
mqttServer.launch();
