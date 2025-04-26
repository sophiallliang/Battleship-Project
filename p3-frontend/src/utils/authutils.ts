import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// check if unexpired and valid jwt cookie exist.
export function isTokenValid() {
    try {
        const token = Cookies.get("token");
        if (!token) {
            return false;
        }
        let decoded_token = jwtDecode(token);
        if (!decoded_token) {
            throw new Error("fail to decode token")
        }
        // @ts-ignore
        if (!decoded_token.username) { 
            throw new Error("Invalid token: does not contain valid username");
        }
        const currentTime = Date.now() / 1000;
        if (decoded_token.exp && decoded_token.exp > currentTime) { // token valid
            return true;
        } else {
            throw new Error("token expired");
        }
    } catch (e) {
        console.log("token invalid");
        Cookies.remove("token");
        return false;
    }
}

// prereq: isTokenValid()
// get the username in auth token
export function getUsernameInToken() {
    const token = Cookies.get("token");
    let decoded_token = jwtDecode(token as string);
    // @ts-ignore
    return decoded_token.username;
}

export function getIdInToken() {
    const token = Cookies.get("token");
    let decoded_token = jwtDecode(token as string);
    // @ts-ignore
    return decoded_token.id;
}