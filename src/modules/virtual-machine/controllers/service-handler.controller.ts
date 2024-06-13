import { Controller } from '@nestjs/common';
import { VirtualMachineHandlerService } from '../services/service-handler.service';

@Controller('')
export class ServiceHandlerController {
  constructor(private readonly virtualMachineHandlerService: VirtualMachineHandlerService) {}
}
