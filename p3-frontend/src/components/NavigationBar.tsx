import { Link } from "react-router-dom";
import "./NavigationBar.css"

export default function NavigationBar() {
    return <div className='navigation-bar'>
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/games">All Games</Link>
        <Link className="nav-link" to="/create_game">New Game</Link>
        <Link className="nav-link" to="/rules">Rules</Link>
        <Link className="nav-link" to="/high-scores">High Scores</Link>
    </div>
}