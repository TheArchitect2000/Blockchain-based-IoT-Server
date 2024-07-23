import { Inject } from '@nestjs/common';
import { TestService } from '../services/test.service';

class TestServer {
  constructor(
    @Inject(TestService)
    private readonly testService?: TestService,
  ) {}

  async testPrint() {
    this.testService.callDeviceModule();
    this.testService.printMsg();
  }
}
