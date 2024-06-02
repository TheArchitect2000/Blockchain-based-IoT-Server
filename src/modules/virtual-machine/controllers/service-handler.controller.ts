// src/modules/virtual-machine/controllers/service-handler.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ServiceHandlerService } from '../services/service-handler.service';
import { VirtualMachineServer } from '../server/virtual-machine-server';

@Controller('service-handler')
export class ServiceHandlerController {
  constructor(
    private readonly serviceHandlerService: ServiceHandlerService,
    private readonly virtualMachineServer: VirtualMachineServer
  ) {}

  @Get('launch-vm')
  async launchVirtualMachine() {
    return this.virtualMachineServer.launch();
  }
}
