const { openBrowser, goto, title } = require('taiko');
import axios from 'axios';
const CDP = require('chrome-remote-interface');
const puppeteer = require('puppeteer');

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
            sessionTimeout: '3m',
            enableVnc: true,
          },
        },
      }
    );
    sessionId = data.sessionId;
  });
  it('Connect to Selendoid with Puppeteer', async () => {
    let browser = await puppeteer.connect({
      browserWSEndpoint: `ws://${selenoidUrl}:4444/devtools/${sessionId}`,
    });
    const pages = await browser.pages();
    console.log(pages);
  });

  it('Connect to Selendoid with CRI', async () => {
    const options = {
      target: `ws://${selenoidUrl}:4444/devtools/${sessionId}`,
    };
    CDP(options, (client) => {
      console.log('Connected!');
      client.close();
    }).on('error', (err) => {
      console.error(err);
    });
  });
});
