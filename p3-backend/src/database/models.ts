import { UserType, GameType, ScoreType } from "./types";
import { UserSchema, GameSchema, ScoreSchema } from "./schemas";
import { model } from "mongoose";
import { COLLECTION_NAME_GAME, COLLECTION_NAME_SCORE, COLLECTION_NAME_USER } from "./constants";

export const User = model<UserType>(COLLECTION_NAME_USER, UserSchema);
export const Game = model<GameType>(COLLECTION_NAME_GAME, GameSchema);
export const Score = model<ScoreType>(COLLECTION_NAME_SCORE, ScoreSchema);
