<h1 align="center">
	<br>
	<img src="Tselenoidlogo.png" alt="TaikoSelenoidy">
	<br>
	<br>
	<br>
</h1>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9c4d4065b26f463da165afe7efca1f4e)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=saikrishna321/taiko-selenoid&utm_campaign=Badge_Grade) ![Node.js CI](https://github.com/saikrishna321/taiko-selenoid/workflows/Node.js%20CI/badge.svg?branch=master)

A plugin to run taiko tests in Selenoid cluster

### Usage

Add ```TAIKO_PLUGIN=taiko-selenoid``` to your env

```javascript
const {
  openBrowser,
  closeBrowser,
} = require('taiko');

const assert = require('assert');

describe('Selenoid Tests', async () => {
  beforeEach('Before Launch', async () => {
    await openBrowser(); // Will create a Selenoid Session and OpenBrowser
  });

  afterEach('Close Browser', async () => {
    await closeBrowser(); // Will close the browser and Selenoid Session
  });
  
  it('Taiko Selenoid Test', async () => {
    await goto('google.com');
    await write('Taiko.js');
  });
});

```
