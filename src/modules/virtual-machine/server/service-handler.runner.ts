import { ServiceHandlerService } from '../services/service-handler.service';

class VirtualMachineServer {
  constructor(private readonly serviceHandlerService?: ServiceHandlerService) {
    this.serviceHandlerService = new ServiceHandlerService();
  }
}
