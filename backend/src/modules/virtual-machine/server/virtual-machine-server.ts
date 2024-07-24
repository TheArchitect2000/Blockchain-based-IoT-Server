import { VirtualMachineHandlerService } from '../services/service-handler.service';

class VirtualMachineServer {
  constructor(
    private readonly virtualMachineHandlerService?: VirtualMachineHandlerService,
  ) {
    this.virtualMachineHandlerService = new VirtualMachineHandlerService();
  }

  async launch() {
    // this.serviceHandlerService.testBlocklyCode();
    // this.serviceHandlerService.testIsolatedVm();
  }
}

let virtualMachineServer = new VirtualMachineServer();
virtualMachineServer.launch();
