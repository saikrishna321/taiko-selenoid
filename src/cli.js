#!/usr/bin/env node
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
var spawn = require('child_process').spawn;
import { info } from './logger';

class SelenoidSetup {
  async downloadCM() {
    console.log('Configuration Manager Downloadin...');
    const { stdout, stderr } = await exec(
      'curl -s https://aerokube.com/cm/bash | bash'
    );
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    console.log('Configuration Manager Downloaded!!');
  }

  async selenoidSetup() {
    const ls = spawn('./cm', [
      'selenoid',
      'configure',
      '--browsers',
      'chrome:86.0',
      '-f'
    ]);
    ls.stdout.on('data', function(data) {
      info('stdout: ' + data.toString());
    });

    ls.stderr.on('data', function(data) {
      console.log('stderr: ' + data.toString());
    });

    ls.on('exit', function(code) {
      console.log('child process exited with code ' + code.toString());
    });
  }

  async dot() {
    console.log('CM Help@@@');
    console.log('CM Help@@@---');
  }
}

(async () => {
  const se = new SelenoidSetup();
  await se.downloadCM();
  await se.selenoidSetup();
})();
