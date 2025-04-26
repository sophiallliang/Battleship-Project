import { convertToBoardString, getInitialBoardState } from "../algorithms/board_setup";
import { bombard, filterBoard, isAllShipDestroyed } from "../algorithms/game_action";
import { Game, User } from "../database/models";
import { LogLevels } from "../logger/constants";
import logger from "../logger/logger";
import { errorResp, fatalResp, okResp } from "../utils/formatResp";

export async function createGame(username: string, gamename: string) {
    try {
        let user = await User.findOne({ username });
        if (!user) {
            logger.log(`User ${username} is not found while creating game`, LogLevels.ERROR);
            return errorResp(`User ${username} is not found while creating game`);
        }
        let prevgame = await Game.findOne({
            name: gamename
        });
        if (prevgame) {
            logger.log(`Game ${gamename} already exist`, LogLevels.INFO);
            return errorResp(`Game ${gamename} already exist`);
        }
        let game = new Game({
            name: gamename,
            player_c: user._id,
            board_c: convertToBoardString(getInitialBoardState()),
            board_j: convertToBoardString(getInitialBoardState()),
            win_c: false,
            win_j: false,
            is_c_turn: true,
            start_time: String(Date.now())
        });
        await game.save();
        logger.log(`successfully created game for ${username} at time ${game.start_time}`, LogLevels.INFO);
        return okResp({ id: game._id, name: game.name });
    } catch (e) {
        logger.log("Fatal error in createGame()", LogLevels.FATAL);
        return fatalResp("Fatal error in createGame()");
    }
}

export async function joinGame(username: string, game_id: string) {
    try {
        let game = await Game.findById(game_id);
        if (!game) {
            logger.log(`Game ${game_id} is not found`, LogLevels.ERROR);
            return errorResp(`Game ${game_id} is not found`);
        }
        if (game.player_j) {
            logger.log(`Game ${game_id} is full`, LogLevels.ERROR);
            return errorResp(`Game ${game_id} is full`);
        }
        const user = await User.findOne({
            username
        });
        if (!user) {
            logger.log(`User ${username} is not found while trying to join game ${game_id}`, LogLevels.ERROR);
            return errorResp(`User ${username} is not found while trying to join game ${game_id}`);
        }
        if (String(user.id) === String(game.player_c)) { // cannot join a game that is host by self
            logger.log(`Cannot join game ${game_id} which is hosted by joiner`, LogLevels.ERROR);
            return errorResp(`Cannot join game ${game_id} which is hosted by joiner`);
        }
        game.player_j = user.id;
        let game_result = await game.save();
        logger.log(`Successfully joined game ${game_result.id}, ${game_result.name}`);
        return okResp({ id: game_result.id, name: game_result.name });
    } catch(e) {
        logger.log("Fatal error in joinGame()", LogLevels.FATAL);
        return fatalResp("Fatal error in joinGame()");
    }
    
}

export async function doGameAction(username: string, game_id: string, action: number) {
    try {
        let game = await Game.findById(game_id);
        if (!game) {
            logger.log(`Game ${game_id} is not found`, LogLevels.ERROR);
            return errorResp(`Game ${game_id} is not found`);
        }
        if (!game.player_j) {
            logger.log(`Action forbidden, Game ${game_id} has only 1 player`, LogLevels.ERROR);
            return errorResp(`Action forbidden, Game ${game_id} has only 1 player`);
        }
        if (game.win_c || game.win_j) {
            logger.log(`Action forbidden, the game ${game_id} is ended`, LogLevels.ERROR);
            return errorResp(`Action forbidden, the game ${game_id} is ended`);
        }
        const user = await User.findOne({
            username
        });
        if (!user) {
            logger.log(`User ${username} is not found while doing game action`, LogLevels.ERROR);
            return errorResp(`User ${username} is not found while doing game action`);
        }
        let isCreator = String(user._id) === String(game.player_c);
        let isJoiner = String(user._id) === String(game.player_j);
        if (isCreator) { // modify joiner board
            if (!game.is_c_turn) {
                logger.log(`Action forbidden, not player ${user._id} turn`, LogLevels.ERROR);
                return errorResp(`Action forbidden, not player ${user._id} turn`);
            }
            const newJBoard: string = bombard(game.board_j, action);
            game.board_j = newJBoard;
            game.is_c_turn = !game.is_c_turn;
            game.win_c = isAllShipDestroyed(newJBoard);
            if (game.win_c) {
                game.end_time = String(Date.now());
            }
            let game_result = await game.save();
            logger.log(`User ${username} bombards its opponents board at position ${action}`);
            if (game_result.win_c) {
                logger.log(`Game ends at time ${game_result.end_time}`);
            }
            return okResp({
                new_opponent_board: filterBoard(game_result.board_j),
                win: game_result.win_c
            });
        } else if (isJoiner) { // modify creator board
            if (game.is_c_turn) {
                logger.log(`Action forbidden, not player ${user._id} turn`, LogLevels.ERROR);
                return errorResp(`Action forbidden, not player ${user._id} turn`);
            }
            const newCBoard: string = bombard(game.board_c, action);
            game.board_c = newCBoard;
            game.is_c_turn = !game.is_c_turn;
            game.win_j = isAllShipDestroyed(newCBoard);
            if (game.win_j) {
                game.end_time = String(Date.now());
            }
            let game_result = await game.save();
            logger.log(`User ${username} bombards its opponents board at position ${action}`);
            if (game_result.win_j) {
                logger.log(`Game ends at time ${game_result.end_time}`);
            }
            return okResp({
                new_opponent_board: filterBoard(game_result.board_c),
                win: game_result.win_j
            });
        } else {
            logger.log(`User ${username} is not in this game`, LogLevels.ERROR);
            return errorResp(`User ${username} is not in this game`);
        }
    } catch (e) {
        logger.log("Fatal error in doGameAction()", LogLevels.FATAL);
        return fatalResp("Fatal error in doGameAction()");
    }
}

export async function getGameState(game_id: string, username: string|null=null) {
    try {
        let game = await Game.findById(game_id).populate("player_c", "username").populate("player_j", "username");
        if (!game) {
            logger.log(`Game ${game_id} is not found`, LogLevels.ERROR);
            return errorResp(`Game ${game_id} is not found`);
        }
        let user = null;
        if (username) {
            user = await User.findOne({
                username
            });
            if (!user) {
                logger.log(`User ${username} is not found while getting game info`, LogLevels.ERROR);
                return errorResp(`User ${username} is not found while getting game info`);
            }
        }

        const board_c_res = String(user?._id) === String(game.player_c._id) ?
            game.board_c : filterBoard(game.board_c);
        const board_j_res = String(user?._id) === String(game.player_j?._id) ?
            game.board_j : filterBoard(game.board_j);
        logger.log(`Successfully fetch game state for game ${game_id}`, LogLevels.INFO);
        return okResp({
            game_id: game.id,
            player_c: game.player_c,
            player_j: game.player_j,
            board_c: board_c_res,
            board_j: board_j_res,
            win_c: game.win_c,
            win_j: game.win_j,
            is_c_turn: game.is_c_turn
        });
    } catch (e) {
        logger.log("Fatal error in getGameState()", LogLevels.FATAL);
        return fatalResp("Fatal error in getGameState()");
    }
}

export async function getAllGameInfo(username: string|null=null) {
    try{
        let games = await Game.find({}, "name player_c player_j win_c win_j is_c_turn start_time end_time")
        .populate("player_c", "username")
        .populate("player_j", "username");
        if (!username) {
            games = games.filter(e => Boolean(e.player_j));
        }
        logger.log("Successfully get all game infos", LogLevels.INFO);
        return okResp(games);
        
    } catch(e) {
        logger.log("Fatal error in getAllGameInfo()", LogLevels.FATAL);
        return fatalResp("Fatal error in getAllGameInfo()");
    }
}