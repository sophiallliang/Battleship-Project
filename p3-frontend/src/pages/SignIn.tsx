import { useState } from "react";
import Input from "../components/Input";
import "./Signin.css";
import "./authstyle.css";
import NBButton from "../components/NBButton";
import { HOST, SIGNIN_ENDPOINT } from "../api_config";
import Cookies from "js-cookie";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { generateFetchOption } from "../utils/fetchutils";

export default function SignIn() {
    const [iusername, setIUsername] = useState<string>("");
    const [ipassword, setIPassword] = useState<string>("");
    const [errormsg, setErrormsg] = useState<string>("");

    const navigate: NavigateFunction = useNavigate();
    
    const onUsernameInputChange = (newInput: string) => {
        setErrormsg("");
        setIUsername(newInput);
    }

    const onPasswordInputChange = (newInput: string) => {
        setErrormsg("");
        setIPassword(newInput);
    }

    const onSubmitButtonClicked = () => {
        if (!iusername) {
            setErrormsg("Please enter your username");
            return;
        }
        if (!ipassword) {
            setErrormsg("Please enter your password");
            return;
        }
        setErrormsg("Logging in...")
        const options = generateFetchOption("post", undefined, {
            username: iusername,
            password: ipassword
        });
        fetch(`${HOST}${SIGNIN_ENDPOINT}`, options)
        .then(resp => resp.json())
        .then(data => {
            if (data.status === "error") {
                setErrormsg(data.message)
            } else {                
                console.log(data.message.token);
                Cookies.set("token", data.message.token);
                setErrormsg("Successfully login, redirecting to home page...");
                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 1500);
            }
        })
        .catch((err) => {
            alert(err);
        })
    }

    return (
        <div className="auth-page-container">
            <h1>Log In</h1>
            <div className="auth-group">
                <div className="auth-label">Username: </div>
                <Input value={iusername} onChange={(e: any) => onUsernameInputChange(e.target.value)} />
            </div>
            <div className="auth-group">
                <div className="auth-label">Password: </div>
                <Input type="password" value={ipassword} onChange={(e: any) => onPasswordInputChange(e.target.value)} />
            </div>
            <div className="auth-group">
                <NBButton color="rgb(74, 136, 217)" clickHandler={() => onSubmitButtonClicked()}>
                    Submit
                </NBButton>
            </div>
            <div className="auth-group auth-error-message">
                { errormsg }
            </div>
        </div>
        // <Input onChange={(e: any) => { console.log(e.target.value); }} />
    )
}