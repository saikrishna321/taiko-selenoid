import axios from 'axios';
import logger from './logger';

export const ID = 'selenoid';
let _openBrowser;
let _closeBrowser;
let sessionId;
let selenoidUrl = '127.0.0.1';

export async function init(taiko, eventEmitter, descEvent, registerHooks) {
  _openBrowser = taiko.openBrowser;
  _closeBrowser = taiko.closeBrowser;
  registerHooks({
    preConnectionHook: (target, options) => {
      return {
        target: `ws://127.0.0.1:4444/devtools/${sessionId}/page/${target}`,
        options,
      };
    },
  });
}

export async function openBrowser() {
  const { data } = await axios.post(`http://${selenoidUrl}:4444/wd/hub/session`, {
    desiredCapabilities: {
      browserName: 'chrome',
      browserVersion: '86.0',
      'selenoid:options': {
        sessionTimeout: '3m',
        enableVnc: true,
      },
    },
  });
  sessionId = data.sessionId;
  if (sessionId) logger.info('Selenoid Session created successfully!!');
  await _openBrowser({
    host: '127.0.0.1',
    port: 4444,
    local: true,
    target: `/devtools/${sessionId}/browser`,
    alterPath: path => {
      return path.includes('protocol') ? `/devtools/${sessionId}${path}` : path;
    },
  });
}

export async function closeBrowser() {
  logger.info('Attempting to close browser...');
  _closeBrowser();
  logger.info('Taiko Browser closed');
  await axios.delete(`http://${selenoidUrl}:4444/wd/hub/session/${sessionId}`);
  logger.info('Selenoid Session closed');
}

module.exports = {
  ID,
  init,
  openBrowser,
  closeBrowser,
};
