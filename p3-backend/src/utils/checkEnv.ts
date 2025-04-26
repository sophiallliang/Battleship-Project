import { exit } from "process";
import { LogLevels } from "../logger/constants";
import logger from "../logger/logger";

export default function checkEnv(): void {
    if (!process.env.MONGODB_URL) {
        logger.log("environment MONGODB_URL does not exist", LogLevels.FATAL);
        exit(1);
    } else if (!process.env.JWT_SECRET) {
        logger.log("environment JWT_SECRET does not exist", LogLevels.FATAL);
        exit(1);
    }
}