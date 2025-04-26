import { MatrixIndexType } from "./types";

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
