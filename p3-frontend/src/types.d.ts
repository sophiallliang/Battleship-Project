export type NBButtonPropType = {
    children: React.ReactNode,
    color: string,
    contentColor?: string
    clickHandler: () => void,
    [key: string]: any
};

export type InputPropType = {
    [key: string]: any
};

export type GamesTablePropType = {
    gamesData: GamesDataType,
    joinable: boolean,
    visitText: string
};

export type HighScoreTableDataEntryType = {
    username: string,
    email: string,
    wins: number,
    losses: number
};

export type HighScoreTableDataType = HighScoreTableDataEntryType[];

export type GamesDataEntryType = {
    id: string,
    name: string,
    player_c: {
        id: string,
        username: string
    },
    player_j: {
        id: string,
        username: string
    } | null,
    game_status: string,
    start_time: string,
    end_time: string | null,
    winner: string | null
};

export type GamesDataType = GamesDataEntryType[];

export type BoardStateType = {
    currState: number[],
    ships: number[][]
}

export type MatrixIndexType = {
    i: number,
    j: number
};
