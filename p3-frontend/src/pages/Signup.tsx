import { useState } from "react";
import Input from "../components/Input"
import NBButton from "../components/NBButton"
import "./Signup.css"
import "./authstyle.css"
import { HOST, SIGNUP_ENDPOINT } from "../api_config";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { generateFetchOption } from "../utils/fetchutils";

export default function Signup() {

    const [iusername, setIUsername] = useState<string>("");
    const [ipassword, setIPassword] = useState<string>("");
    const [iemail, setIEmail] = useState<string>("");
    const [iretypepassword, setIRetypepassword] = useState<string>("");

    const [uerrormsg, setUErrormsg] = useState<string>("");
    const [emerrormsg, setEmErrormsg] = useState<string>("");
    const [perrormsg, setPErrormsg] = useState<string>("");
    const [rperrormsg, setRPErrormsg] = useState<string>("");
    const [submiterrormsg, setSubmitErrormsg] = useState<string>("");
    
    const navigate: NavigateFunction = useNavigate();

    const checkUsernameFormat = (username: string) => {
        if (username.length === 0) {
            return "Username cannot be empty";
        }
        return "";
    }

    const checkPasswordFormat = (password: string) => {
        if (password.length < 8 || password.length > 20) {
            return "password length must between 8~20";
        }
        if (!(/[a-zA-Z]/.test(password))) {
            return "password must contain at least 1 letter";
        }
        if (!(/[0-9]/.test(password))) {
            return "password must contain at least 1 number";
        }
        return "";
    }

    const checkEmailFormat = (email: string) => {
        if (email.length > 0 && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            return "invalid email format";
        }
        return "";
    }

    const checkRtPasswordFormat = (rtpassword: string) => {
        if (rtpassword !== ipassword) {
            return "Password must match";
        }
        return "";
    }


    const onUsernameInputChange = (newUsername: string) => {
        setIUsername(newUsername);
        if (newUsername.length > 0) {
            setUErrormsg(checkUsernameFormat(newUsername));
        } else {
            setUErrormsg("");
        }
    }

    const onEmailInputChange = (newEmail: string) => {
        setIEmail(newEmail);
        if (newEmail.length > 0) {
            setEmErrormsg(checkEmailFormat(newEmail));
        } else {
            setEmErrormsg("");
        }
    }

    const onPasswordInputChange = (newPassword: string) => {
        setIPassword(newPassword);
        if (newPassword.length > 0) {
            setPErrormsg(checkPasswordFormat(newPassword));
        } else {
            setPErrormsg("");
        }
    }

    const onRetypePasswordInputChange = (newRetypePassword: string) => {
        setIRetypepassword(newRetypePassword);
        if (newRetypePassword.length > 0) {
            setRPErrormsg(checkRtPasswordFormat(newRetypePassword));
        } else {
            setRPErrormsg("");
        }
    }

    const onSubmitButtonClicked = () => {
        let usernamemsg: string = checkUsernameFormat(iusername);
        let emailmsg: string = checkEmailFormat(iemail);
        let passwordmsg: string = checkPasswordFormat(ipassword);
        let rtpasswordmsg: string = checkRtPasswordFormat(iretypepassword);
        setUErrormsg(usernamemsg);
        setEmErrormsg(emailmsg);
        setPErrormsg(passwordmsg);
        setRPErrormsg(rtpasswordmsg);

        if (usernamemsg || emailmsg || passwordmsg || rtpasswordmsg) { return; }
        
        setSubmitErrormsg("Signin up...")
        const options = generateFetchOption("post", undefined,{
            username: iusername,
            password: ipassword,
            email: (iemail ? iemail : undefined)
        });
        console.log(options);
        
        fetch(`${HOST}${SIGNUP_ENDPOINT}`, options)
        .then(resp => resp.json())
        .then(data => {
            if (data.status === 'error') {
                setSubmitErrormsg(data.message);
            } else {
                setSubmitErrormsg("Signup success! Redirecting to signin page");
                setTimeout(() => {
                    navigate("/login");
                    window.location.reload();
                }, 1500);
            }
        })
        .catch(err => {
            alert(err);
        })
    }

    return (
        <div className="auth-page-container">
            <h1>Sign up</h1>
            <div className="auth-group">
                <div className="auth-label">Create a username: <span className="auth-req-star">*</span></div>
                <Input value={iusername} onChange={(e: any) => onUsernameInputChange(e.target.value)}/>
                <div className="auth-error-message">
                    { uerrormsg }
                </div>
            </div>
            <div className="auth-group">
                <div className="auth-label">Enter your email:</div>
                <Input value={iemail} onChange={(e: any) => onEmailInputChange(e.target.value)} />
                <div className="auth-error-message">
                    {emerrormsg}
                </div>
            </div>
            <div className="auth-group">
                <div className="auth-label">Create a password: <span className="auth-req-star">*</span></div>
                <Input type="password" value={ipassword} onChange={(e: any) => onPasswordInputChange(e.target.value)} />
                <div className="auth-error-message">
                    {perrormsg}
                </div>
            </div>
            <div className="auth-group">
                <div className="auth-label">Retype password: <span className="auth-req-star">*</span></div>
                <Input type="password" value={iretypepassword} onChange={(e: any) => onRetypePasswordInputChange(e.target.value)} />
                <div className="auth-error-message">
                    {rperrormsg}
                </div>
            </div>
            <div className="auth-group">
                <NBButton color="rgb(74, 136, 217)" clickHandler={() => onSubmitButtonClicked()}>
                    Submit
                </NBButton>
                <div className="auth-error-message">
                    {submiterrormsg}
                </div>
            </div>
            
        </div>
    )
}