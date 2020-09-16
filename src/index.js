import axios from 'axios';
const fs = require('fs');

export const ID = 'selenoid';
console.log('-----');
let _openBrowser;
let _closeBrowser;
let sessionId;
let selenoidUrl = '127.0.0.1';

export async function init(taiko, eventEmitter) {
  _openBrowser = taiko.openBrowser;
  _closeBrowser = taiko.closeBrowser;
}

export async function openBrowser() {
  const { data } = await axios.post(
    `http://${selenoidUrl}:4444/wd/hub/session`,
    {
      desiredCapabilities: {
        browserName: 'chrome',
        browserVersion: '84.0',
        'selenoid:options': {
          sessionTimeout: '3m',
          enableVnc: true
        }
      }
    }
  );
  sessionId = data.sessionId;
  console.log('***', sessionId);
  const jsonProtocol = await axios.get(
    `ws://${selenoidUrl}:4444/devtools/${sessionId}/json/protocol`
  );
  fs.writeFileSync('localProtocol.json', JSON.stringify(jsonProtocol.data));
  await _openBrowser({
    host: '127.0.0.1',
    port: 4444,
    target: `/devtools/${sessionId}/page`,
    protocol: require('../localProtocol.json')
  });
}

export async function closeBrowser() {
  await _closeBrowser();
}

module.exports = {
  ID,
  init,
  openBrowser,
  closeBrowser
};
