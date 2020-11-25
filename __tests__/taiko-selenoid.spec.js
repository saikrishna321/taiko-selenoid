const { goto, openBrowser, text, click, closeBrowser } = require('taiko');

const assert = require('assert');

describe('Taiko Selenoid Example', () => {
  before(async () => {
    await openBrowser();
  });
  it('Connect to Selendoid with CRI', async () => {
    await goto('https://taiko.dev/');
    await click('Documentation');
    await click('API Reference');
    const elementPresent = await text('Browser actions').exists();
    assert.ok(elementPresent, true);
  });

  after(async () => {
    await closeBrowser();
  });
});
