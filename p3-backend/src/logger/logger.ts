import { CMD_LOG_LEVELS, LOG_LABELS, LogLevels } from "./constants";

class Logger {

    minLogLevel: LogLevels = LogLevels.INFO;
    defaultLogLevel: LogLevels = LogLevels.INFO;

    constructor(minLogLevel_in?: LogLevels, defaultLogLevel_in?: LogLevels) {
        if (minLogLevel_in) {
            this.changeMinLogLevel(minLogLevel_in);
        }
        if (defaultLogLevel_in) {
            this.changeDefaultLogLevel(defaultLogLevel_in);
        }
    }

    changeMinLogLevel(minLogLevel_in: LogLevels) {
        this.minLogLevel = minLogLevel_in;
    }

    changeDefaultLogLevel(defaultLogLevel_in: LogLevels) {
        this.defaultLogLevel = defaultLogLevel_in;
    }

    log(message: any, logLevel?: LogLevels) {
        if (!logLevel) {
            logLevel = this.defaultLogLevel;
        }
        if (logLevel >= this.minLogLevel) {
            console.log(`[${LOG_LABELS[logLevel]}] ${message}`);
        }
    }
}

function generateLogger() {
    let i = 2;
    let minLogLevel: LogLevels = LogLevels.INFO;
    let defaultLogLevel: LogLevels = LogLevels.INFO;
    while (i < process.argv.length) {
        if (process.argv[i] === "--minloglevel") {
            ++i;
            minLogLevel = CMD_LOG_LEVELS[process.argv[i] as keyof typeof CMD_LOG_LEVELS];
            if (minLogLevel === undefined) {
                console.log("[FATAL] failed to parse minloglevel");                
                process.exit(1);
            }
        }
        if (process.argv[i] === "--defaultloglevel") {
            ++i;
            defaultLogLevel = CMD_LOG_LEVELS[process.argv[i] as keyof typeof CMD_LOG_LEVELS];
            if (defaultLogLevel === undefined) {
                console.log("[FATAL] failed to parse defaultloglevel");
                process.exit(1);
            }
        }
        ++i;
    }
    return new Logger(minLogLevel, defaultLogLevel);
}

const logger = generateLogger();

export default logger;
