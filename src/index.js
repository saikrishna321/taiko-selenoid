import logger from './logger';
import { createSelenoidSession, deleteSelenoidSession } from './Api';

export const ID = 'selenoid';
let _openBrowser;
let _closeBrowser;
let sessionId;
let selenoidHost = '127.0.0.1';
let selenoidPort = 4444;
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

Object.assign(defaultConfig.desiredCapabilities['selenoid:options'], selenoidConfig);

export async function init(taiko, eventEmitter, descEvent, registerHooks) {
  _openBrowser = taiko.openBrowser;
  _closeBrowser = taiko.closeBrowser;
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
  logger.info('Selenoid Session created successfully!!');
  await _openBrowser({
    host: `${selenoidHost}`,
    port: `${selenoidPort}`,
    local: true,
    target: `/devtools/${sessionId}/browser`,
    alterPath: path => {
      return path.includes('protocol') ? `/devtools/${sessionId}${path}` : path;
    },
  });
}

export async function closeBrowser() {
  if (sessionId) {
    logger.info('Attempting to close browser...');
    await _closeBrowser();
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
