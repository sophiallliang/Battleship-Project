import { useContext, useState } from "react";
import "./BoardCell.css";
import { BoardContext } from "../contexts/BoardContext";

export const BGLIGHTBLUE = "rgb(134, 200, 231)";
export const BGGREEN = "rgb(95, 186, 97)"
export const BGRED = "rgb(187, 133, 133)"
export const BLACK = "rgb(0, 0, 0)";
export const RED = "rgb(255, 0, 0)";
export const GREEN = "rgb(0, 116, 2)";

export const BGLIGHTBLUE_HOVER = "rgb(70, 180, 232)";
export const BGGREEN_HOVER = "rgb(52, 187, 54)"
export const BGRED_HOVER = "rgb(185, 64, 64)"
export type BoardCellPropType = {
    cellState: 0 | 1 | 2 | 3,
    showShip: boolean,
    cellId: number
};

// board state: 0->empty, 1->ship, 2->empty hit, 3->ship hit
export default function BoardCell({ cellState, showShip, cellId } : BoardCellPropType) {
    const { handleClick } = useContext(BoardContext);
    const [ hovered, setHovered ] = useState<boolean>(false);
    let cellContent = "";
    let bgColor = "";
    let color = "";

    if (cellState === 0) {
        cellContent = "";
        bgColor = !showShip && hovered ? BGLIGHTBLUE_HOVER :BGLIGHTBLUE;
        color = BGLIGHTBLUE;
    } else if (cellState === 1) {
        cellContent = showShip ? "⚫" : "";
        bgColor = !showShip && hovered ? BGLIGHTBLUE_HOVER : BGLIGHTBLUE;
        color = BLACK;
    } else if (cellState === 2) {
        cellContent = "✔";
        bgColor = !showShip && hovered? BGGREEN_HOVER : BGGREEN;
        color = GREEN;
    } else {
        cellContent = "X";
        bgColor = !showShip && hovered ? BGRED_HOVER : BGRED;
        color = RED;
    }

    return <div className="cell-container">
        <div className="cell" 
        style={{
            backgroundColor: bgColor,
            color: color,
            cursor: !showShip ? "pointer": "default"
        }}
        onClick={() => handleClick(cellId)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        >
            { cellContent }
        </div>
    </div>
}