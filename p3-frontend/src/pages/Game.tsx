import { useEffect, useState } from "react";
import { BoardContext } from "../contexts/BoardContext";
import "./Game.css";
import { BoardStateType } from "../types";
import Board from "../components/Board";
import { checkWin, getInitialBoardState, mapStrBoardToArrBoard } from "../utils/gameutils";
import { useParams } from "react-router-dom";
import { getIdInToken, getUsernameInToken, isTokenValid } from "../utils/authutils";
import Cookies from "js-cookie";
import { generateFetchOption } from "../utils/fetchutils";
import { GAMEACTION_ENDPOINT, GETGAMESTATE_ENDPOINT, HOST } from "../api_config";

const WAIT_FOR_OPPONENT = "Wait for opponent";
const DEFEAT_THE_ENEMY = "Defeat the enemy";
const LACK_1 = "Need one more player";

export default function Game() {
    const { game_id } = useParams();
    const [username, setUsername] = useState<string>("");
    const [userid, setUserId] = useState<string>("");
    const [isPlayerC, setIsPlayerC] = useState<boolean>(false);
    const [isPlayerJ, setIsPlayerJ] = useState<boolean>(false);
    
    const [gameState, setGameState] = useState<string>(DEFEAT_THE_ENEMY);
    const [myBoardState, setMyBoardState] = useState<BoardStateType>(getInitialBoardState());
    const myBoardContextValue = {
        boardState: myBoardState.currState,
        showShip: true,
        colSize: 10,
        handleClick: (i: number) => {
            console.log("Clicked my board: " + i);
        }
    };

    const [aiBoardState, setAiBoardState] = useState<BoardStateType>(getInitialBoardState());
    const aiBoardContextValue = {
        boardState: aiBoardState.currState,
        showShip: false,
        colSize: 10,
        handleClick: (i: number) => {
            console.log("Clicked AI board: " + i);
            if (!isPlayerC && !isPlayerJ) {
                
                return;
            }
            if (gameState !== DEFEAT_THE_ENEMY) {
                console.log("no effect");
                return;
            }
            if (aiBoardState.currState[i] === 2 || aiBoardState.currState[i] === 3) {
                alert("Cannot target this cell");
                return;
            }

            const updatedBoardState = [...aiBoardState.currState];

            if (updatedBoardState[i] === 0) {
                updatedBoardState[i] = 2; // Missed shot
            } else if (updatedBoardState[i] === 1) {
                updatedBoardState[i] = 3; // Hit shot
            }
            // setAiBoardState(prev => ({ ...prev, currState: updatedBoardState }));
            const options = generateFetchOption('put', Cookies.get("token"), {
                game_id,
                action: i
            })
            fetch(`${HOST}${GAMEACTION_ENDPOINT}`, options)
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(err => {
                alert(err);
            }) 

            // ai take step
            // aiStep(myBoardState.currState, aiCannonFireSeq);
            // check if ai wins
            // if (checkWin(myBoardState.currState)) {
            //     if (intervalRef.current !== null) {
            //         clearInterval(intervalRef.current);
            //         intervalRef.current = null;
            //     }
            //     setGameState(GAME_AI_WIN);
            //     return;
            // }
        }
    };
    useEffect(() => {
        let token = null;
        let curr_username = null;
        let curr_userId = null;
        if (isTokenValid()) {
            curr_username = getUsernameInToken();
            setUsername(curr_username);
            curr_userId = getIdInToken();
            setUserId(curr_userId);
            token = Cookies.get("token");
        }
        const options = generateFetchOption("get", token ?? undefined);
        fetch(`${HOST}${GETGAMESTATE_ENDPOINT}?game_id=${game_id}`, options)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            if (!data.message.player_j?._id) {
                setGameState(LACK_1);
            }
            if (curr_userId === data.message.player_c._id) {
                console.log("here");
                if (!data.message.is_c_turn) {
                    setGameState(WAIT_FOR_OPPONENT);
                }
                setIsPlayerC(true);
                setMyBoardState(prev => {
                    return {
                        ...prev, 
                        currState: mapStrBoardToArrBoard(data.message.board_c)
                    }
                });
                setAiBoardState(prev => {
                    return {
                        ...prev,
                        currState: mapStrBoardToArrBoard(data.message.board_j)
                    }
                });
                
            } else { // for both username === data.message.player_j or guest ot loggedout
                if (data.message.is_c_turn) {
                    setGameState(WAIT_FOR_OPPONENT);
                }
                if (curr_userId === data.message.player_j._id) {
                    setIsPlayerJ(true);
                }
                setMyBoardState(prev => {
                    return {
                        ...prev,
                        currState: mapStrBoardToArrBoard(data.message.board_j)
                    }
                });
                setAiBoardState(prev => {
                    return {
                        ...prev,
                        currState: mapStrBoardToArrBoard(data.message.board_c)
                    }
                });
                
            }
            if (data.message.win_c) {
                setGameState(`${data.message.player_c.username} Wins`);
            } else if (data.message.win_j) {
                setGameState(`${data.message.player_j.username} Wins`);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }, []);
    
    
    return <div className="normal-game-container">
        <div className="normal-game-first-row">
            {/* <Timer seconds={time} />
            <button className="reset-button" onClick={resetGame}>Reset</button> */}
        </div>
        <div className="center game-state">
            
            { 
                !isPlayerC && !isPlayerJ 
                && (gameState === DEFEAT_THE_ENEMY || gameState === WAIT_FOR_OPPONENT)? 
                "Visiting game" : gameState
            }
        </div>

        <div className="boards-container">
            <div>
                <div className="board-title">enemy board</div>
                <BoardContext.Provider value={aiBoardContextValue}>
                    <Board />
                </BoardContext.Provider>
            </div>
            <div>
                <div className="board-title">my board</div>
                <BoardContext.Provider value={myBoardContextValue}>
                    <Board />
                </BoardContext.Provider>
            </div>
        </div>
    </div>
}