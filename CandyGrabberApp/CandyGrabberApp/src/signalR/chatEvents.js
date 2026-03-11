import { connection } from "./connection.js";
export function registerSignalREvents() {
    if (!connection) {
        console.warn("SignalR: Connection not initialized yet. Events will be attached later.");
        return;
    }
    connection.on("ReceiveMessage", (senderUsername, content) => {
        console.log(`Message from ${senderUsername}: ${content}`);
    });

    connection.on("FriendRequestSent", (request) => {
        console.log("Novi Friend Request:", request);
    this.addFriendRequestToUI(request);
});
    connection.on("ReceiveGameRequest", ({ senderId, username }) => {
        console.log(`Game request from: ${username}`);

    });
    connection.on("GameStarted", (gameStartDto) => {
        console.log("Game started!", gameStartDto);
    });
    connection.on("PlayerMoved", (playerId, x, y) => {
        console.log(`Player ${playerId} se pomerio na: (${x}, ${y})`);
    });

    connection.on("ItemPicked", (itemIndex) => {
        console.log(`Item ${itemIndex} picked`);
    });
    connection.on("MatchFinished", (winnerId) => {

    if (String(winnerId) === this.myId)
        alert("pobedio si");
    else
        alert("izgubio si");

    this.returnToLobby();
    });
    connection.on("GameResumed", (gameState) => {
    for (const id in gameState.PlayerX) {
        if (this.players[id]) {
            this.players[id].x = gameState.PlayerX[id];
            this.players[id].y = gameState.PlayerY[id];
        }
    }
    this.scores = { ...gameState.Scores };

    gameState.CandiesCollected.forEach((collected, index) => {
        if (this.items[index]) this.items[index].visible = !collected;
    });
    this.updateScoreUI();
    });
}