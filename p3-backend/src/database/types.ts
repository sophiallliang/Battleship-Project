import { Types } from "mongoose"

export interface UserType extends Document {
    username: string,
    password: string,
    email?: string | null
}

export interface GameType extends Document {
    name: string,
    player_c: Types.ObjectId,
    player_j?: Types.ObjectId | null,
    board_c: string,
    board_j: string,
    win_c: boolean,
    win_j: boolean,
    is_c_turn: boolean,
    start_time?: string | null,
    end_time?: string | null
}

export interface ScoreType extends Document {
    user: Types.ObjectId,
    wins: number,
    losses: number
}
