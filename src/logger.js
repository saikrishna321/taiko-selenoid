const chalk = require('chalk');
const colors = new Map();
colors
  .set('INFO', chalk.bold.blueBright)
  .set('ERROR', chalk.bold.red)
  .set('DEBUG', chalk.bold.magenta)
  .set('WARN', chalk.bold.yellow);
const logToConsole = (level, message, ...optionalParams) => {
  if (process.env.TAIKO_SELENOID_LOGGER === 'true') {
    const msg = `[${level}] ${[message, ...optionalParams].join()}`;
    console.log(colors.get(level)(msg));
  }
};
export default {
  info: (message, ...optionalParams) => logToConsole('INFO', message, optionalParams),
  debug: (message, ...optionalParams) => logToConsole('DEBUG', message, optionalParams),
  warn: (message, ...optionalParams) => logToConsole('WARN', message, optionalParams),
  error: (message, ...optionalParams) => logToConsole('ERROR', message, optionalParams),
};
