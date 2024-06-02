// virtual-machine.service.ts

import { Injectable } from '@nestjs/common';
import { ServiceHandlerService } from '../services/service-handler.service';

@Injectable()
export class VirtualMachineServer {
  constructor(private readonly serviceHandlerService: ServiceHandlerService) {}

  async launch() {
    // Call the methods you need from serviceHandlerService here
    // For example:
    // this.serviceHandlerService.testBlocklyCode();
    // this.serviceHandlerService.testIsolatedVm();
  }
}
