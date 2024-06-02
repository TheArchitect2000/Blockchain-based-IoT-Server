import { Controller } from '@nestjs/common';
import { ServiceHandlerService } from '../services/service-handler.service';

@Controller('')
export class ServiceHandlerController {
  constructor(private readonly serviceHandlerService: ServiceHandlerService) {}
}
