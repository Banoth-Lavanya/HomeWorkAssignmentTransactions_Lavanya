const levels = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
  };
  
  const log = (level, message, ...optionalParams) => {
    const timestamp = new Date().toISOString();
    switch (level) {
      case levels.INFO:
        console.info(`[INFO] [${timestamp}] ${message}`, ...optionalParams);
        break;
      case levels.WARN:
        console.warn(`[WARN] [${timestamp}] ${message}`, ...optionalParams);
        break;
      case levels.ERROR:
        console.error(`[ERROR] [${timestamp}] ${message}`, ...optionalParams);
        break;
      default:
        console.log(`[LOG] [${timestamp}] ${message}`, ...optionalParams);
    }
  };
  
  const logger = {
    info: (message, ...optionalParams) => log(levels.INFO, message, ...optionalParams),
    warn: (message, ...optionalParams) => log(levels.WARN, message, ...optionalParams),
    error: (message, ...optionalParams) => log(levels.ERROR, message, ...optionalParams),
  };
  
  export default logger;