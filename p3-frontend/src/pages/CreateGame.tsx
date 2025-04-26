import { use, useEffect, useState } from "react"
import Input from "../components/Input"
import "./authstyle.css"
import NBButton from "../components/NBButton";
import { CREATEGAME_ENDPOINT, HOST } from "../api_config";
import { generateFetchOption } from "../utils/fetchutils";
import { isTokenValid } from "../utils/authutils";
import Cookies  from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function CreateGame() {
    const [igameName, setIGameName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loggedin, setLoggedin] = useState<boolean>(true);

    useEffect(() => {
        if (!isTokenValid()) {
            setLoggedin(false);
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
    }, []);

    const onGamenameInputChange = (newGameName: string) => {
        setIGameName(newGameName);
    }

    const navigate = useNavigate();

    const onSubmitButtonClicked = () => {
        if (!igameName) {
            setError("Please enter a game name");
            return;
        }
        let token = null;
        if (isTokenValid()) {
            token = Cookies.get("token");
        } else {
            setError("Please login first");
            return;
        }
        const options = generateFetchOption('post', token, {
            "gamename": igameName
        });
        fetch(`${HOST}${CREATEGAME_ENDPOINT}`, options)
        .then(resp => resp.json())
        .then(data => {
            setError("Game created. Redirecting to game...");
            setTimeout(() => {
                navigate(`/game/${data.message.id}`)
            }, 1500);
        })
        .catch(err => {
            alert(err);
        })
    }

    if (!loggedin) {
        return <div className="auth-error-message">You need to login first...</div>
    }
    return(
        <div className="auth-page-container">
            
            <h1>Create new game</h1>
            <div className="auth-group">
                <div className="auth-label">Enter a name for the new game: <span className="auth-req-star">*</span></div>
                <Input value={igameName} onChange={(e: any) => onGamenameInputChange(e.target.value)}/>
            </div>
            <div className="auth-group">
                <NBButton color="rgb(74, 136, 217)" clickHandler={() => onSubmitButtonClicked()}>
                    Create
                </NBButton>
                <div className="auth-error-message">
                    {error}
                </div>
            </div>
        </div>
    )
}