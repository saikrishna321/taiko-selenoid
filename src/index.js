import axios from 'axios';
const fs = require('fs');

export const ID = 'selenoid';
let _openBrowser;
let _closeBrowser;
let sessionId;
let selenoidUrl = '127.0.0.1';

export async function init(taiko) {
  _openBrowser = taiko.openBrowser;
  _closeBrowser = taiko.closeBrowser;
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
  const jsonProtocol = await axios.get(
    `ws://${selenoidUrl}:4444/devtools/${sessionId}/json/protocol`,
  );
  fs.writeFileSync('localProtocol.json', JSON.stringify(jsonProtocol.data));
  await _openBrowser({
    host: '127.0.0.1',
    port: 4444,
    target: `/devtools/${sessionId}/page`,
    protocol: require('../localProtocol.json'),
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
