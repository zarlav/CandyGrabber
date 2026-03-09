import { connection } from "../../signalR/connection.js";

export function registerGameRequestEvents(lobbyScene, gameRequestManager) {
    connection.on("ReceiveGameRequest", (req) => {
        console.log("Primljen game request:", req);
        lobbyScene.addGameRequestToUI(req);
    });

    connection.on("GameStarted", (gameStartDTO) => {
        console.log("Game started:", gameStartDTO);
        lobbyScene.startGame(gameStartDTO);
    });
}