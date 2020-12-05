import axios from 'axios';

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
  await _closeBrowser();
  await axios.delete(`http://${selenoidUrl}:4444/wd/hub/session/${sessionId}`);
}

module.exports = {
  ID,
  init,
  openBrowser,
  closeBrowser,
};
