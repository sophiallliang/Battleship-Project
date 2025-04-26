import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return <div className="home-container">
        <h1 className="home-center">Welcome to Battleship Game!</h1>
        <div className="home-center link-row"><Link className="link" to={"/create_game"}>Create a game</Link></div>
        <div className="home-center link-row"><Link className="link" to={"/games"}>Join a game</Link></div>
    </div>
}