import { useEffect, useState } from "react";
import "./AllGames.css";
import { getUsernameInToken, isTokenValid } from "../utils/authutils";
import Cookies from "js-cookie";
import { GETALLGAMEINFO_ENDPOINT, HOST } from "../api_config";
import { generateFetchOption } from "../utils/fetchutils";
import { GamesDataEntryType, GamesDataType } from "../types";
import NBButton from "../components/NBButton";
import GamesTable from "../components/GamesTable";

export default function AllGames() {
    const [username, setUsername] = useState<string>("");
    const [gamesData, setGamesData] = useState<GamesDataType>([]);

    useEffect(() => {
        let token = null;
        if (isTokenValid()){
            setUsername(getUsernameInToken());
            token = Cookies.get("token");
        }
        const options = generateFetchOption("get", token ?? undefined);
        fetch(`${HOST}${GETALLGAMEINFO_ENDPOINT}`, options)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            const gamesdata_in: GamesDataType = data.message.map((ele: any) => {
                let gamestatus = "open";
                if (ele.player_j) {
                    if (ele.win_c || ele.win_j) {
                        gamestatus = "completed";
                    } else {
                        gamestatus = "active";
                    }
                }
                let winner = null;
                if (ele.win_c) {
                    winner = ele.player_c.username;
                } else if (ele.win_j) {
                    winner = ele.player_j?.username;
                }
                return {
                    id: ele._id,
                    name: ele.name,
                    player_c: {
                        id: ele.player_c._id,
                        username: ele.player_c.username
                    },
                    player_j: (ele.player_j ? {
                        id: ele.player_j._id,
                        username: ele.player_j.username
                    } : null),
                    game_status: gamestatus,
                    start_time: ele.start_time,
                    end_time: ele.end_time || null,
                    winner: winner
                }
            });
            console.log(gamesdata_in);
            
            setGamesData(gamesdata_in);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    if (!username) {
        return (
            <div className="allgames-page-container">
                <h1>Active Games</h1>
                <GamesTable joinable={false} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                    return ele.game_status === 'active'
                })} visitText="Visit"/>
                {/* <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Host</th>
                            <th>Joiner</th>
                            <th>Start time</th>
                            <th>End time</th>
                            <th>Status</th>
                            <th>Winner</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            gamesData.filter((ele: GamesDataEntryType) => {
                                return ele.game_status === 'active'
                            }).map((ele: GamesDataEntryType, idx: number) => <tr key={idx}>
                                <td>{ele.name}</td>
                                <td>{ele.player_c.username}</td>
                                <td>{ele.player_j?.username || ""}</td>
                                <td>{ele.start_time || ""}</td>
                                <td>{ele.end_time || ""}</td>
                                <td>{ele.game_status}</td>
                                <td>{ele.winner || ""}</td>
                                <td>
                                    <NBButton color="rgb(45, 154, 255)" clickHandler={() => {
                                        console.log("click");
                                    }}>
                                        Visit
                                    </NBButton>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table> */}
                <h1>Completed Games</h1>
                <GamesTable joinable={false} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                    return ele.game_status === "completed";
                })} visitText="Visit"/>
            </div>
        )
    } 
    return (
        <div className="allgames-page-container">
            <h1>Open Games</h1>
            <GamesTable joinable={true} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                return ele.game_status === "open" && ele.player_c.username !== username;
            })} visitText="Visit"/>
            <h1>My Open Games</h1>
            <GamesTable joinable={false} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                return ele.game_status === "open" && ele.player_c.username === username;
            })} visitText="Join"/>
            <h1>My Active Games</h1>
            <GamesTable joinable={false} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                return ele.game_status === "active" 
                && (ele.player_c.username === username || ele.player_j?.username === username);
            })} visitText="Join"/>
            <h1>My Completed Games</h1>
            <GamesTable joinable={false} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                return ele.game_status === "completed" 
                && (ele.player_c.username === username || ele.player_j?.username === username);
            })} visitText="Join"/>
            <h1>Other Games</h1>
            <GamesTable joinable={false} gamesData={gamesData.filter((ele: GamesDataEntryType) => {
                return (ele.game_status === "active" || ele.game_status === "completed") 
                && ele.player_c.username !== username && ele.player_j?.username !== username;
            })} visitText="Visit"/>
        </div>
        
    );
}