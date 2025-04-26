import { BoardCellState } from "./constants";

export function bombard(board: string, bombPoint: number): string {
    let modifiedBoard: string[] = board.split("");
    if (modifiedBoard[bombPoint] === String(BoardCellState.EMPTY)) {
        modifiedBoard[bombPoint] = String(BoardCellState.EMPTY_HIT);
    } else if (modifiedBoard[bombPoint] === String(BoardCellState.SHIP)) {
        modifiedBoard[bombPoint] = String(BoardCellState.SHIP_HIT);
    }
    return modifiedBoard.join("");
}

// filter a board to the state that opponent is supposed to see
export function filterBoard(board: string): string {
    let result = [];
    for (let c of board) {
        if (c === String(BoardCellState.SHIP)) {
            result.push(String(BoardCellState.EMPTY));
        } else {
            result.push(c);
        }
    }
    return result.join("");
}

export function isAllShipDestroyed(board: string): boolean {
    for (let ele of board) {
        if (ele === String(BoardCellState.SHIP)) {
            return false;
        }
    }
    return true;
}