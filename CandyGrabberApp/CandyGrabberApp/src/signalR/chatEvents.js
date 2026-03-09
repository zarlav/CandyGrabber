import { connection } from "./connection.js";

// Registracija svih SignalR događaja
export function registerSignalREvents() {
    if (!connection) {
        console.warn("SignalR: Connection not initialized yet. Events will be attached later.");
        return;
    }

    // CHAT poruke
    connection.on("ReceiveMessage", (senderUsername, content) => {
        console.log(`Message from ${senderUsername}: ${content}`);
        // TODO: prikaz poruke u UI
    });

    // Friend request
    connection.on("FriendRequestSent", (senderUsername) => {
        console.log(`Friend request from: ${senderUsername}`);
        // TODO: dodaj badge, popup ili alert
    });

    // Game request
    connection.on("ReceiveGameRequest", ({ senderId, username }) => {
        console.log(`Game request from: ${username}`);
        // TODO: UI prikaz zahteva (prihvati/odbij)
    });

    // Game start event
    connection.on("GameStarted", (gameStartDto) => {
        console.log("Game started!", gameStartDto);

        // TODO: ovde pokrenuti Pixi.js logiku za igru
        // Primer:
        // startGame(gameStartDto);
    });

    // Player move (za igru u real-time)
    connection.on("PlayerMoved", (playerId, x, y) => {
        console.log(`Player ${playerId} moved to (${x}, ${y})`);
        // TODO: update lokacije igrača na mapi
    });

    // Item pick (za igru u real-time)
    connection.on("ItemPicked", (itemIndex) => {
        console.log(`Item ${itemIndex} picked`);
        // TODO: ukloni item iz UI
    });
}