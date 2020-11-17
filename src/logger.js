const logToConsole = (level, message, ...optionalParams) => {
  const msg = `${new Date().toISOString()} [${level}] ${[
    message,
    ...optionalParams
  ].join()}`;
  // eslint-disable-next-line no-console
  console.log(msg);
};

export default {
  info: (message, ...optionalParams) =>
    logToConsole('INFO', message, optionalParams),
  log: (message, ...optionalParams) =>
    logToConsole('INFO', message, optionalParams),
  warn: (message, ...optionalParams) =>
    logToConsole('WARN', message, optionalParams),
  error: (message, ...optionalParams) =>
    logToConsole('ERROR', message, optionalParams)
};
