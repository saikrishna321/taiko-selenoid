#!/usr/bin/env node
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
var spawn = require('child_process').spawn;
const chalk = require('chalk');
const log = console.log;

class SelenoidSetup {
  async downloadCM() {
    log(chalk.greenBright('Configuration Manager Not Found.'));
    log(chalk.greenBright('Configuration Manager Downloadin...'));
    const { stdout, stderr } = await exec('curl -s https://aerokube.com/cm/bash | bash');
    log('stdout:', stdout);
    log('stderr:', stderr);
    this.selenoidSetup();
  }
  async selenoidSetup() {
    log(chalk.greenBright('Configure Browser Version to 86.0'));
    try {
      await exec('docker rm $(docker ps -q -f status=exited)');
    } catch (e) {
      logger.error(e);
    }
    const ls = spawn('./cm', ['selenoid', 'configure', '--browsers', 'chrome:86.0', '-f']);
    ls.stdout.on('data', function(data) {
      log(chalk.blue(data.toString()));
    });
    ls.on('error', async () => await this.downloadCM());
    ls.stderr.on('data', function(data) {
      log(chalk.cyan(data.toString()));
    });

    ls.on('exit', this.startSelenoid);
  }

  startSelenoid() {
    log(chalk.greenBright('Starting Selenoid....'));
    const ls = spawn('./cm', ['selenoid', 'start', '--vnc']);
    ls.stdout.on('data', function(data) {
      console.log(chalk.blue(data.toString()));
    });

    ls.stderr.on('data', function(data) {
      console.log(chalk.cyan(data.toString()));
    });
    ls.on('exit', () => {
      log(chalk.greenBright('Starting Selenoid UI'));
      const ls = spawn('./cm', ['selenoid-ui', 'start']);
      ls.stdout.on('data', function(data) {
        log(chalk.blueBright(data.toString()));
      });

      ls.stderr.on('data', function(data) {
        log(chalk.gray(data.toString()));
      });
    });
  }
}

(async () => {
  const se = new SelenoidSetup();
  await se.selenoidSetup();
})();
