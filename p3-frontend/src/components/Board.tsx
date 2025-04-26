import { useContext } from "react";
import { BoardContext } from "../contexts/BoardContext";
import "./Board.css";
import BoardCell from "./BoardCell";

// board state: 0->empty, 1->ship, 2->empty hit, 3->ship hit
export default function Board() {
    const { boardState, showShip, colSize } = useContext(BoardContext);
    const colCount: number = colSize, rowCount: number = boardState.length / colCount;
    
    return <div className="board" style={{
        gridTemplateRows: `repeat(${rowCount}, ${rowCount}fr)`,
        gridTemplateColumns: `repeat(${colCount}, ${colCount}fr)`
    }}>
        {
            // @ts-ignore
            boardState.map((val: number, k1: number) => { return <BoardCell key={k1} cellState={val} showShip={showShip} cellId={k1}/>})
        }
    </div>
}