"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    serviceName;
    logLevel;
    constructor(serviceName, logLevel = LogLevel.INFO) {
        this.serviceName = serviceName;
        this.logLevel = logLevel;
    }
    shouldLog(level) {
        const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
    log(level, message, metadata) {
        if (!this.shouldLog(level)) {
            return;
        }
        const logEntry = {
            level,
            message,
            timestamp: new Date(),
            service: this.serviceName,
            metadata,
        };
        const logString = JSON.stringify(logEntry);
        switch (level) {
            case LogLevel.ERROR:
                console.error(logString);
                break;
            case LogLevel.WARN:
                console.warn(logString);
                break;
            case LogLevel.INFO:
                console.info(logString);
                break;
            case LogLevel.DEBUG:
                console.debug(logString);
                break;
        }
    }
    error(message, metadata) {
        this.log(LogLevel.ERROR, message, metadata);
    }
    warn(message, metadata) {
        this.log(LogLevel.WARN, message, metadata);
    }
    info(message, metadata) {
        this.log(LogLevel.INFO, message, metadata);
    }
    debug(message, metadata) {
        this.log(LogLevel.DEBUG, message, metadata);
    }
    withSaga(sagaId, correlationId) {
        const logger = new Logger(this.serviceName, this.logLevel);
        logger.log = (level, message, metadata) => {
            this.log(level, message, { ...metadata, sagaId, correlationId });
        };
        return logger;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map