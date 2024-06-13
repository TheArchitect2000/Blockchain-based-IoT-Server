import { VirtualMachineHandlerService } from '../services/service-handler.service';

class VirtualMachineServer {
  constructor(private readonly virtualMachineHandlerService?: VirtualMachineHandlerService) {
    this.virtualMachineHandlerService = new VirtualMachineHandlerService();
  }
}
