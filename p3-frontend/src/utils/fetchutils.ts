// fetch(`${HOST}${SIGNIN_ENDPOINT}`, {
//             method: 'post',
//             body: JSON.stringify({
//                 username: iusername,
//                 password: ipassword
//             }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
export function generateFetchOption(method: string, authToken?: string, body?: any) {
    let result = { 
        method,
        headers: {
            'Content-Type': "application/json",
        }
    }
    if (authToken) {
        //@ts-ignore
        result.headers['Authorization'] = `Bearer ${authToken}`
    }
    if (body) {
        //@ts-ignore
        result.body = JSON.stringify(body);
    }
    return result;
}