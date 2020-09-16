const {
  openBrowser,
  goto,
  title,
  screenshot,
  closeBrowser,
  waitFor,
} = require('taiko');
import axios from 'axios';
const fs = require('fs');

describe('Taiko Selenoid Example', () => {
  let sessionId;
  let selenoidUrl = '127.0.0.1';

  before('Get selenoid Session ID', async () => {
    const { data } = await axios.post(
      `http://${selenoidUrl}:4444/wd/hub/session`,
      {
        desiredCapabilities: {
          browserName: 'chrome',
          browserVersion: '84.0',
          'selenoid:options': {
            sessionTimeout: '1m',
            enableVnc: true,
          },
        },
      }
    );
    sessionId = data.sessionId;
    console.log(sessionId);
    const jsonProtocol = await axios.get(
      `ws://${selenoidUrl}:4444/devtools/${sessionId}/json/protocol`
    );
    fs.writeFileSync('localProtocol.json', JSON.stringify(jsonProtocol.data));
  });

  it('Connect to Selendoid with CRI', async () => {
    await openBrowser({
      host: '127.0.0.1',
      port: 4444,
      target: `/devtools/${sessionId}/page`,
      local: true,
      protocol: require('../localProtocol.json'),
    });
    await goto('google.com');
    await screenshot();
    await waitFor(10000);
    console.log(await title());
    await closeBrowser();
  });
});
