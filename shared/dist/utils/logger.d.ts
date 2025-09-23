export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: Date;
    service?: string;
    sagaId?: string;
    correlationId?: string;
    metadata?: Record<string, any>;
}
export declare class Logger {
    private serviceName;
    private logLevel;
    constructor(serviceName: string, logLevel?: LogLevel);
    private shouldLog;
    private log;
    error(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    debug(message: string, metadata?: Record<string, any>): void;
    withSaga(sagaId: string, correlationId?: string): Logger;
}
//# sourceMappingURL=logger.d.ts.map