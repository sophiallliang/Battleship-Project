import { BoardStateType, MatrixIndexType } from "../types";

// convert linear index to matrix index
export function LtoM(i_in: number, colSize: number): MatrixIndexType {
    return {
        i: i_in / colSize,
        j: i_in % colSize
    };
}

export function MtoL(i_in: number, j_in: number, colSize: number): number {
    return i_in * colSize + j_in;
}

function validCell(boardStates: number[], colSize: number, i: number, j: number) {
    const rowSize: number = Math.floor(boardStates.length / colSize);
    return i >= 0 && i < rowSize
        && j >= 0 && j < colSize
        && boardStates[MtoL(i, j, colSize)] === 0;
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
                boardStates[MtoL(c.i, c.j, colSize)] = 1;
            }
            return purpose;
        }
    }
}

function convertMarrtoLarr(arr: MatrixIndexType[], colSize: number): number[] {
    const result: number[] = [];
    for (let ele of arr) {
        result.push(MtoL(ele.i, ele.j, colSize));
    }
    return result;
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

export function getInitialBoardState(): BoardStateType {
    const boardState = [];
    for (let i = 0; i < 100; ++i) {
        boardState.push(0);
    }
    const ships: number[][] = randomPlaceShips(boardState, 10);
    return {
        currState: boardState,
        ships
    };
}

export function checkWin(boardState: number[]): boolean {
    return !boardState.includes(1);
}

export function mapStrBoardToArrBoard(strboard: string) : number[] {
    let result = [];
    for (let ele of strboard) {
        result.push(Number(ele));
    }
    return result;
}

export function mapArrBoardToStrBoard(arrboard: number[]): string {
    return arrboard.join('');
}