import { InputPropType } from "../types"
import "./Input.css"

export default function Input({ ...props }: InputPropType) {
    return <input type={ props.type || "text" } className="input-field" { ...props }/>
}