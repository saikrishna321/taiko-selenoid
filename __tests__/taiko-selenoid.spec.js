const { goto, title, write, waitFor, openBrowser, closeBrowser } = require('taiko');

const assert = require('assert');

describe('Taiko Selenoid Example', () => {
  before(async () => {
    await openBrowser({ headless: false });
  });
  it('Connect to Selendoid with CRI', async () => {
    await goto('google.com');
    await waitFor(5000);
    await write('somoething');
    assert.ok(await title(), 'Google');
  });

  after(async () => {
    await closeBrowser();
  });
});
