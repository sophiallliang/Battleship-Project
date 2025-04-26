import { NBButtonPropType } from "../types";
import "./NBButton.css"
export default function NBButton(
    { children, color, contentColor, clickHandler, ...props }: NBButtonPropType
) {
    return <button className="nb-button" 
    style={{backgroundColor: color, color: contentColor || "white"}}
    onClick={clickHandler}
    {...props}>
        { children }
    </button>
}