import { Score } from "../database/models";
import { LogLevels } from "../logger/constants";
import logger from "../logger/logger";
import { fatalResp, okResp } from "../utils/formatResp";

export async function getAllScores() {
    try{ 
        const scoreByUser = await Score.find({}).populate('user', 'username email');
        logger.log("Successfully get scores of all users", LogLevels.INFO);
        return okResp(scoreByUser);
    } catch(e) {
        logger.log("Fatal error in getAllScores()", LogLevels.FATAL);
        return fatalResp("Fatal error in getAllScores()");
    }
}