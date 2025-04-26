import { useEffect, useState } from "react";
import "./HighScores.css";
import { HighScoreTableDataEntryType, HighScoreTableDataType } from "../types";
import { GETSCORE_ENDPOINT, HOST } from "../api_config";
import { getUsernameInToken, isTokenValid } from "../utils/authutils";

export default function HighScores() {
    const [tableData, setTableData] = useState<HighScoreTableDataType>([]);
    const [currUname, setCurrUname] = useState<string>("");

    useEffect(() => {
        if (isTokenValid()) {
            setCurrUname(getUsernameInToken());
        }
        fetch(`${HOST}${GETSCORE_ENDPOINT}`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);

            // export type HighScoreTableDataEntryType = {
            //     username: string,
            //     email: string,
            //     wins: number,
            //     losses: number
            // };
            let tableDataIn: HighScoreTableDataType = data.message.map((ele: any) => {
                return {
                    username: ele.user.username,
                    email: ele.user.email,
                    wins: ele.wins,
                    losses: ele.losses
                }
            });

            tableDataIn.sort((a, b) => {
                if (a.wins > b.wins) {
                    return -1;
                } else if (a.wins < b.wins) {
                    return 1;
                } else {
                    return a.losses - b.losses
                }
            })
            setTableData(tableDataIn);
        })
        .catch(err => {
            alert(err);
        })
    }, []);
    return <div className="highscore-container">
        <table className="highscore-table">
            <thead>
                <tr>
                    <th className="highscore-table-header">Username</th>
                    <th className="highscore-table-header">Email</th>
                    <th className="highscore-table-header">Wins</th>
                    <th className="highscore-table-header">Losses</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((ele: HighScoreTableDataEntryType, idx: number) => <tr key={idx}>
                    <td style={{ fontWeight: ele.username === currUname ? "bold" : "normal"}}>
                        {ele.username}
                    </td>
                    <td>{ele.email ?? ""}</td>
                    <td>{ele.wins}</td>
                    <td>{ele.losses}</td>
                </tr>)}
            </tbody>
        </table>
    </div>
}