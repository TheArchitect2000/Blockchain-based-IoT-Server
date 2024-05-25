import { ServiceHandlerService } from '../services/service-handler.service';

class VirtualMachineServer {
  constructor(private readonly serviceHandlerService?: ServiceHandlerService) {
    this.serviceHandlerService = new ServiceHandlerService();
  }

  async launch() {
    // this.serviceHandlerService.testBlocklyCode();
    // this.serviceHandlerService.testIsolatedVm();
  }
}

let virtualMachineServer = new VirtualMachineServer();
virtualMachineServer.launch();
