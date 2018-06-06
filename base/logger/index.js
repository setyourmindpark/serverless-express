const winston = require('winston');
exports.getLogger = getLogger;

function getLogger() {
    const { level } = config.setting.logger;

    const logger = new (winston.Logger)({
        level: level,                       // error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5        
        transports: [
            new (winston.transports.Console)({ json: false }),
        ]
    });
    return logger;
}
