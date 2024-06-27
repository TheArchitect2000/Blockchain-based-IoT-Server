import { Injectable } from '@nestjs/common';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * Blockly service.
 */

@Injectable()
export class BlocklyService {
  async testBlocklyCode() {
    let code =
      "if ((4*3) == 13) {console.log('equations is correct!.')} else {console.log('equations is not correct!.')}";

    try {
      eval(code);
    } catch (e) {}
  }

  async testFunction1() {
    console.log('We are in testFunction1.');
  }

  async createService(counts) {
    console.log(
      '\x1b[5m',
      '\x1b[33m',
      '\nCreating Isolated Service... ',
      '\x1b[0m',
    );
    /* const isolate = new ivm.Isolate({ memoryLimit: 128 }); // The default is 128MB and the minimum is 8MB.
    const context = isolate.createContextSync();
    const jail = context.global;
    jail.setSync('global', jail.derefInto());
    try {
      // await context.evalClosureSync(`global._var1 = 50;`);
      await context.evalClosureSync(`global._var1 = ${counts};`);
      const result = await context.evalSync('(function() { return _var1 })()');
      console.log('result: ', await result);
    } catch (e) {}

    isolate.dispose(); */
  }

  async testIsolatedVm() {
    let code1 = `if ((4*3) == 13) {console.log('equations is correct!.');} else {console.log('equations is not correct!.');}`;
    let code2 = `(function() { return 'Isolate VM is running!'; })()`;
    let code3 = `++count;`;
    let code4 = `function() {return "Hello!"}`;

    try {
      console.log(
        '\x1b[5m',
        '\x1b[33m',
        '\nTesting Isolated Service... ',
        '\x1b[0m',
      );

      //console.log('ivm is: ', ivm);

      console.time('run');
      // let isolate = new ivm.Isolate;
      /* const isolate = new ivm.Isolate({ memoryLimit: 128 }); // The default is 128MB and the minimum is 8MB.
      const context = isolate.createContextSync();
      const script = isolate.compileScriptSync(code3); */

      //context.evalSync('let count = 0;'); // For let code3 = `++count;`;
      //
      //console.log('isolate is: ', isolate);
      //console.log('context is: ', context);
      //console.log('script is: ', script);
      //
      //console.log(script.runSync(context));
      //console.log(script.runSync(context));
      //console.timeEnd('run');
      //
      //const context2 = isolate.createContextSync();
      //const script2 = isolate.compileScriptSync(code3);

      //context2.evalSync('let count = 5;'); // For let code3 = `++count;`;
      //
      //console.log('isolate is: ', isolate);
      //console.log('context is: ', context2);
      //console.log('script is: ', script2);
      //
      //console.log(script2.runSync(context2));
      //console.log(script2.runSync(context2));

      /**
       * Another example.
       */
      /* console.log(
        '\x1b[34m Isolate heap statistics: \x1b[0m',
        await isolate.getHeapStatistics(),
      );
      const context3 = isolate.createContextSync(); */
      // const script3 = isolate.compileScriptSync(code4);
      /* const jail3 = context3.global;
      jail3.setSync('global', jail3.derefInto());
      jail3.setSync('log', function (...args) {
        console.log(...args);
      }); */

      try {
        // script3.runSync(context3);
        /*  await context3.evalClosureSync(
          `global._STORE = { theme: { name: 'education' } };`,
        );
        await context3.evalClosureSync(`global._var1 = 50;`);
        await context3.evalClosureSync(`global._var2 = 'String Test';`);
 */
        /*   const foo = await context3.evalSync(
                "(function() { return '${global._STORE.theme.name}' })()"
                ).result; */
        /*  const foo1 = await context3.evalSync(
          '(function() { return _STORE.theme.name })()',
        );

        const foo2 = await context3.evalSync('(function() { return _var1 })()');

        const foo3 = await context3.evalSync('(function() { return _var2 })()');

        const foo4 = await context3.evalSync(
          '(function() { if (5 == 4) { return true } else { return false }})()',
        );

        const foo5 = await context3.evalSync(
          "(function() { if (5 == 4) { return true } else { log('This is function call.'); return false }})()",
        );
 */
        /*  console.log('foo1', await foo1);
        console.log('foo2', await foo2);
        console.log('foo3', await foo3);
        console.log('foo4', await foo4);
        console.log('foo5', await foo5); */
      } catch (error) {
        console.log('Error is: ', error);
      }

      console.log('\x1b[32m --------------------------------- \x1b[0m');
      console.log('\x1b[32m Isolated Service Test Successful. \x1b[0m');
      console.log('\x1b[32m --------------------------------- \x1b[0m');
    } catch (e) {}

    for (let i = 0; i < 5; i++) {
      await this.createService(i);
    }
  }
}
