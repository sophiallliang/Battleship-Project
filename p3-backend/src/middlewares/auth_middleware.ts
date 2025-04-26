import { LogLevels } from "../logger/constants";
import logger from "../logger/logger";
import { errorResp } from "../utils/formatResp";
import jwt from "jsonwebtoken";

export function authorizeJwt(req: any, res: any, next: any) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        logger.log(`Access denied. No token provided.`, LogLevels.ERROR);
        return res.status(403).json(errorResp('Access denied. No token provided.'));
    }

    // @ts-ignore
    jwt.verify(token, process.env.JWT_SECRET, (err, payload: any) => {
        if (err) {
            logger.log(`Access denied, token invalid`, LogLevels.ERROR);
            return res.status(403).json(errorResp("Access denied, token invalid"));
        }
        logger.log(`User ${payload.username} authorized.`, LogLevels.INFO);
        req.body.username = payload?.username;
        next();
    })
}

export function softAuthorizeJwt(req: any, res: any, next: any) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        logger.log(`Access in guest mode`, LogLevels.INFO);
        req.body.username = undefined;
        next();
    } else {
        // @ts-ignore
        jwt.verify(token, process.env.JWT_SECRET, (err, payload: any) => {
            if (err) {
                logger.log(`Access in guest mode`, LogLevels.INFO);
                req.body.username = undefined;
                next();
            } else {
                logger.log(`User ${payload.username} authorized.`, LogLevels.INFO);
                req.body.username = payload?.username;
                next();
            }
        })
    }
}