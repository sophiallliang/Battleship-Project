import { NavigateFunction, useNavigate } from "react-router-dom"
import NBButton from "./NBButton"
import "./ProfileStatus.css"
import { useEffect, useState } from "react";
import { getUsernameInToken, isTokenValid } from "../utils/authutils";
import { CaretDownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
export default function ProfileStatus() {
    const navigate: NavigateFunction = useNavigate();
    const [tokenValid, setTokenValid] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleSignout = () => {
        Cookies.remove("token");
        navigate("/");
        window.location.reload();
    }

    useEffect(() => {
        const tokenIsValid = isTokenValid();
        if (tokenIsValid) {
            setTokenValid(true);
            setUsername(getUsernameInToken());
        }
    }, []);

    return (
        tokenValid ? 
        <div className = 'profile-status'>
            <div>{username}</div>
            <CaretDownOutlined onClick={() => { setShowDropdown(prev => !prev)}}/>
            <div className="profile-dropdown" style={{ display: showDropdown ? "block" : "none"}}>
                <div className="profile-dropdown-item" onClick={ handleSignout }>Sign out</div>
            </div>
        </div> :
        <div className='profile-status'>
            <NBButton clickHandler={() => { navigate("/login") }} color="rgb(36, 182, 36)">
                Log in
            </NBButton> 
            <NBButton clickHandler={() => { navigate("/register") }} color="rgb(66, 154, 205)">
                Sign up
            </NBButton> 
        </div>
    )
}