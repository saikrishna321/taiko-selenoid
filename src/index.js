import logger from './logger';
import { createSelenoidSession, deleteSelenoidSession } from './Api';
import fs from 'fs';
import path from 'path';

export const ID = 'selenoid';
let _openBrowser;
let sessionId;
export let defaultConfig = {
  desiredCapabilities: {
    browserName: 'chrome',
    browserVersion: '88.0',
    'selenoid:options': {
      sessionTimeout: '3m',
      enableVnc: true,
      selenoidHost: '127.0.0.1',
      selenoidPort: 4444,
    },
  },
};

export const setSelenoidConfig = (options) => {
  if (fs.existsSync(path.resolve(__dirname, '../selenoid.config.js'))) {
    let selenoidConfig = require('../selenoid.config');
    Object.assign(defaultConfig.desiredCapabilities['selenoid:options'], selenoidConfig);
  }
  if (Object.keys(options).length > 0) {
    for (const key in options) {
      if ((Object.prototype.hasOwnProperty.call(defaultConfig.desiredCapabilities['selenoid:options'], key)) && 
      (typeof defaultConfig.desiredCapabilities['selenoid:options'][key] !== typeof options[key])) {
          throw new Error(
            `Invalid value for ${key}. Expected ${typeof defaultConfig.desiredCapabilities['selenoid:options'][
            key
            ]} received ${typeof options[key]}`,
          );
        }
      else {
        defaultConfig.desiredCapabilities['selenoid:options'][key] = options[key];
      }
    }
  };
}

setSelenoidConfig({});

export async function init(taiko, eventEmitter, descEvent, registerHooks) {
  _openBrowser = taiko.openBrowser;
  registerHooks({
    preConnectionHook: (target, options) => {
      return {
        target: `ws://${defaultSelenoidConfig.selenoidHost}:${defaultSelenoidConfig.selenoidPort}/devtools/${sessionId}/page/${target}`,
        options,
      };
    },
  });
}
export async function openBrowser() {
  const selenoidHost = defaultConfig.desiredCapabilities['selenoid:options'].selenoidHost;
  const selenoidPort = defaultConfig.desiredCapabilities['selenoid:options'].selenoidPort;
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
  const selenoidHost = defaultConfig.desiredCapabilities['selenoid:options'].selenoidHost;
  const selenoidPort = defaultConfig.desiredCapabilities['selenoid:options'].selenoidPort;
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
  defaultConfig,
  init,
  openBrowser,
  closeBrowser,
  setSelenoidConfig,
};