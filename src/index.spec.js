const expect = require('chai').expect;
const config = require('./index');
describe('Config tests', () => {
    let newConfig;
    it('should update the config', () => {
        newConfig = {
            sessionTimeout: '3m',
            enableVnc: true,
            selenoidHost: '127.0.0.1',
            selenoidPort: 3000,
            enableVideo: true,
        };
        expect(config.defaultConfig.desiredCapabilities['selenoid:options']).not.deep.equal(newConfig);
        config.setSelenoidConfig(newConfig);
        expect(config.defaultConfig.desiredCapabilities['selenoid:options']).to.deep.equal(newConfig);
    });

    it('should update the valid config', () => {
        newConfig = {
            sessionTimeout: '3m',
            enableVnc: true,
            selenoidHost: '127.0.0.1',
            selenoidPort: 3000,
            enableVideo: true,
            newKey: 'value'
        };
        expect(config.defaultConfig.desiredCapabilities['selenoid:options']).not.deep.equal(newConfig);
        config.setSelenoidConfig(newConfig);
        expect(config.defaultConfig.desiredCapabilities['selenoid:options']).to.deep.equal(newConfig);
    });

    it('should throw error when invalid type of port number is given', () => {
        const expectedMessage = new RegExp(
            'Invalid value for selenoidPort. Expected number received string',
        );
        expect(() =>
            config.setSelenoidConfig({
                selenoidPort: 'invalid config value',
            }),
        ).to.throw(expectedMessage);
    });
    it('should throw error when invalid type of host is given', () => {
        const expectedMessage = new RegExp(
            'Invalid value for selenoidHost. Expected string received number',
        );
        expect(() =>
            config.setSelenoidConfig({
                selenoidHost: 1234,
            }),
        ).to.throw(expectedMessage);
    });
});