import { Score, User } from "../database/models";
import { UserType } from "../database/types";
import { LogLevels } from "../logger/constants";
import logger from "../logger/logger";
import bcrypt from "bcrypt";
import { PWD_HASH_SALT_ROUNDS } from "./constants";
import formatResp, { errorResp, fatalResp, okResp } from "../utils/formatResp";
import { STATUS_ERROR, STATUS_OK } from "../utils/constants";
import { RespType } from "../utils/types";
import jwt from "jsonwebtoken";

export async function signup(username: string, password: string, email?: string): Promise<RespType> {
    try {
        const existingUser: UserType | null = await User.findOne({
            username
        });
        if (existingUser) {
            logger.log(`signup() found existing user ${username}`, LogLevels.INFO);
            return errorResp(`user ${username} already exist, please change a username`);
        }
        const hashedPassword: string = await bcrypt.hash(password, PWD_HASH_SALT_ROUNDS);
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });
        const newUserResult = await newUser.save();
        logger.log(`new user ${username} is registered.`, LogLevels.INFO);
        // @ts-ignore
        newUserResult.password = undefined;
        const newScore = new Score({
            user: newUserResult._id,
            wins: 0,
            losses: 0
        });
        await newScore.save();
        logger.log(`new score board for ${username} is created`, LogLevels.INFO);
        return okResp(newUserResult);
    } catch(e) {
        logger.log("Fatal error in signup()", LogLevels.FATAL);
        logger.log(e, LogLevels.FATAL);
        return fatalResp("Fatal error in signup()");
    }
}

export async function signin(username: string, password: string): Promise<RespType> {
    try {
        const user = await User.findOne({
            username
        });
        if (!user) {
            logger.log(`user ${username} does not exist`, LogLevels.INFO);
            return errorResp(`user ${username} does not exist`);
        }
        const valid: boolean = await bcrypt.compare(password, user.password);
        if (valid) {
            const token = jwt.sign({ username, id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
            logger.log(`user ${username} login successful`, LogLevels.INFO);
            return okResp({ token });
        } else {
            logger.log(`user ${username} password wrong`, LogLevels.INFO);
            return errorResp("password incorrect.");
        }
    } catch (e) {
        logger.log("Fatal error in signin()", LogLevels.FATAL);
        logger.log(e, LogLevels.FATAL);
        return fatalResp("Fatal error in signin()");
    }
}