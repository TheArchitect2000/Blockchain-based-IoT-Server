import { BlocklyService } from '../services/blockly.service';

class BlocklyServer {
  constructor(private readonly blocklyService?: BlocklyService) {
    this.blocklyService = new BlocklyService();
  }

  async launch() {
    this.blocklyService.testBlocklyCode();
    this.blocklyService.testIsolatedVm();
  }
}

// let blocklyServer = new BlocklyServer();
// blocklyServer.launch();
