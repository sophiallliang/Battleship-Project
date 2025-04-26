export enum LogLevels {
    INFO = 0,
    WARNING = 1,
    ERROR = 2,
    FATAL = 3
};

export const LOG_LABELS = {
    [LogLevels.INFO]: "INFO",
    [LogLevels.WARNING]: "WARNING",
    [LogLevels.ERROR]: "ERROR",
    [LogLevels.FATAL]: "FATAL"
};

export const CMD_LOG_LEVELS = {
    info: LogLevels.INFO,
    warning: LogLevels.WARNING,
    error: LogLevels.ERROR,
    fatal: LogLevels.FATAL
};

