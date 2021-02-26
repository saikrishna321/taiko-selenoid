import logger from './logger';
import { createSelenoidSession, deleteSelenoidSession } from './Api';
import fs from 'fs';
import path from 'path';

export const ID = 'selenoid';
let _openBrowser;
let sessionId;
let selenoidPort = 4444;
let selenoidHost = '127.0.0.1';
let defaultConfig = {
  desiredCapabilities: {
    browserName: 'chrome',
    browserVersion: '86.0',
    'selenoid:options': {
      sessionTimeout: '3m',
      enableVnc: true,
    },
  },
};

if (fs.existsSync(path.resolve(__dirname, '../selenoid.config.js'))) {
  let selenoidConfig = require('../selenoid.config');
  Object.assign(defaultConfig.desiredCapabilities['selenoid:options'], selenoidConfig);
  selenoidPort = selenoidConfig.selenoidPort ? selenoidConfig.selenoidPort : selenoidPort;
  selenoidHost = selenoidConfig.selenoidHost ? selenoidConfig.selenoidHost : selenoidHost;
}

export async function init(taiko, eventEmitter, descEvent, registerHooks) {
  _openBrowser = taiko.openBrowser;
  registerHooks({
    preConnectionHook: (target, options) => {
      return {
        target: `ws://${selenoidHost}:${selenoidPort}/devtools/${sessionId}/page/${target}`,
        options,
      };
    },
  });
}

export async function openBrowser() {
  const { data } = await createSelenoidSession(
    `http://${selenoidHost}:${selenoidPort}/wd/hub/session`,
    defaultConfig,
  );
  sessionId = data.sessionId;
  logger.info('Selenoid Session created successfully!!', JSON.stringify(defaultConfig));
  await _openBrowser({
    host: `${selenoidHost}`,
    port: `${selenoidPort}`,
    local: true,
    target: `/devtools/${sessionId}/browser`,
    alterPath: path => {
      return path.includes('protocol') ? `/devtools/${sessionId}${path}` : path;
    },
  });
  return sessionId;
}

export async function closeBrowser() {
  if (sessionId) {
    logger.info('Attempting to close browser...');
    logger.info('Taiko Browser closed');
    await deleteSelenoidSession(
      `http://${selenoidHost}:${selenoidPort}/wd/hub/session/${sessionId}`,
    );
    logger.info('Selenoid Session closed');
  }
}

module.exports = {
  ID,
  init,
  openBrowser,
  closeBrowser,
};
