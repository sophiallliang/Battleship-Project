import { useNavigate } from "react-router-dom";
import { GamesDataEntryType, GamesTablePropType } from "../types";
import "./GamesTable.css"
import NBButton from "./NBButton";
import { HOST, JOINGAME_ENDPOINT } from "../api_config";
import { isTokenValid } from "../utils/authutils";
import Cookies from "js-cookie";
import { generateFetchOption } from "../utils/fetchutils";
import { useState } from "react";
export default function GamesTable({ gamesData, joinable, visitText }: GamesTablePropType) {
    const navigate = useNavigate();
    const [joinText, setJoinText] = useState<string>("Join");

    return (
                    <table>
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
                                gamesData.map((ele: GamesDataEntryType, idx: number) => <tr key={idx}>
                                    <td>{ele.name}</td>
                                    <td>{ele.player_c.username}</td>
                                    <td>{ele.player_j?.username || ""}</td>
                                    <td>{ele.start_time || ""}</td>
                                    <td>{ele.end_time || ""}</td>
                                    <td>{ele.game_status}</td>
                                    <td>{ele.winner || ""}</td>
                                    <td>
                                        <NBButton color="rgb(45, 154, 255)" clickHandler={() => {
                                            navigate(`/game/${ele.id}`);
                                        }}>
                                            { visitText }
                                        </NBButton>
                                        {joinable && <NBButton color="rgb(0, 220, 136)" clickHandler={() => {
                                            let token = null;
                                            if (isTokenValid()) {
                                                token = Cookies.get("token");
                                            } else {
                                                alert("This component is not expected for logged out users.");
                                                return;
                                            }
                                            const options = generateFetchOption('put', token, {
                                                "game_id": ele.id
                                            });
                                            setJoinText("Joining...");
                                            fetch(`${HOST}${JOINGAME_ENDPOINT}`, options)
                                            .then(resp => resp.json())
                                            .then(data => {
                                                setJoinText("Redirecting...");
                                                setTimeout(() => {
                                                    navigate(`/game/${ele.id}`);
                                                }, 1000);
                                            })
                                            .catch(err => {
                                                alert(err);
                                            })
                                        }}>
                                            { joinText }
                                        </NBButton>}
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                
    )
}