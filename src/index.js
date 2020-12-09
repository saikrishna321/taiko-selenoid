import axios from 'axios';

export const ID = 'selenoid';
let _openBrowser;
let _closeBrowser;
let sessionId;
let selenoidHost = '127.0.0.1';
let selenoidPort = 4444;

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
  const { data } = await axios.post(`http://${selenoidHost}:${selenoidPort}/wd/hub/session`, {
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
  await _closeBrowser();
  await axios.delete(`http://${selenoidHost}:${selenoidPort}/wd/hub/session/${sessionId}`);
}

module.exports = {
  ID,
  init,
  openBrowser,
  closeBrowser,
};
