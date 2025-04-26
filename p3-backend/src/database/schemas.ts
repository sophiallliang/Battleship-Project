import { Schema, Document, Types } from "mongoose";
import { GameType, ScoreType, UserType } from "./types";
import { COLLECTION_NAME_USER } from "./constants";

export const UserSchema: Schema = new Schema<UserType>({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    }
});

export const GameSchema: Schema = new Schema<GameType>({
    name: {
        type: String,
        required: true
    },
    player_c: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_NAME_USER,
        required: true
    },
    player_j: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_NAME_USER,
        default: null
    },
    board_c: {
        type: String,
        required: true
    },
    board_j: {
        type: String,
        required: true
    },
    win_c: {
        type: Boolean,
        required: true
    },
    win_j: {
        type: Boolean,
        required: true
    },
    is_c_turn: {
        type: Boolean,
        required: true
    },
    start_time: {
        type: String,
        default: null
    },
    end_time: {
        type: String,
        default: null
    }
});

export const ScoreSchema: Schema = new Schema<ScoreType>({
    user: {
        type: Schema.Types.ObjectId,
        ref: COLLECTION_NAME_USER,
        unique: true,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    }
});