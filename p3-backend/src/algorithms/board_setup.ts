import { BOARD_SIZE, BoardCellState } from "./constants";
import { MtoL } from "./indexing";
import { BoardStateType, MatrixIndexType } from "./types";

function validCell(boardStates: number[], colSize: number, i: number, j: number) {
    const rowSize: number = Math.floor(boardStates.length / colSize);
    return i >= 0 && i < rowSize
        && j >= 0 && j < colSize
        && boardStates[MtoL(i, j, colSize)] === 0;
}

function convertMarrtoLarr(arr: MatrixIndexType[], colSize: number): number[] {
    const result: number[] = [];
    for (let ele of arr) {
        result.push(MtoL(ele.i, ele.j, colSize));
    }
    return result;
}

// return the ship that is being generated
function randomPlaceShip(boardStates: number[], colSize: number, shipLength: number): MatrixIndexType[] {
    const rowSize: number = Math.floor(boardStates.length / colSize);
    const vertical: boolean = Math.random() > 0.5;
    while (true) {
        const base: MatrixIndexType = {
            i: Math.floor(Math.random() * rowSize),
            j: Math.floor(Math.random() * colSize)
        };
        let purpose: MatrixIndexType[] = [base];
        for (let l = 1; l < shipLength; ++l) {
            purpose.push(vertical ?
                { i: base.i - l, j: base.j } :
                { i: base.i, j: base.j - l }
            );
        }
        let valid = true;
        for (let c of purpose) {
            if (!validCell(boardStates, colSize, c.i, c.j)) {
                valid = false;
                break;
            }
        }
        if (valid) {
            for (let c of purpose) {
                boardStates[MtoL(c.i, c.j, colSize)] = BoardCellState.SHIP;
            }
            return purpose;
        }
    }
}

export function randomPlaceShips(boardStates: number[], colSize: number): number[][] {
    const ships: number[][] = [
        convertMarrtoLarr(randomPlaceShip(boardStates, colSize, 5), colSize),
        convertMarrtoLarr(randomPlaceShip(boardStates, colSize, 4), colSize),
        convertMarrtoLarr(randomPlaceShip(boardStates, colSize, 3), colSize),
        convertMarrtoLarr(randomPlaceShip(boardStates, colSize, 3), colSize),
        convertMarrtoLarr(randomPlaceShip(boardStates, colSize, 2), colSize),
    ];
    return ships;
}

export function getEmptyBoard(): number[] {
    const boardState = [];
    for (let i = 0; i < BOARD_SIZE; ++i) {
        boardState.push(BoardCellState.EMPTY);
    }
    return boardState;
}

export function getInitialBoardState(): BoardStateType {
    const boardState: number[] = getEmptyBoard();
    const ships: number[][] = randomPlaceShips(boardState, 10);
    return {
        currState: boardState,
        ships
    };
}

export function convertToBoardString(boardState: BoardStateType): string {
    return boardState.currState.join("");
}

