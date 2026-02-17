import { connection } from "./connection.js";

export function registerSignalREvents() {
    if (!connection) {
        console.warn("SignalR: Connection not initialized yet. Events will be attached later.");
        return;
    }

    connection.on("ReceiveMessage", (sender, content) => {
        console.log(`Message from ${sender}: ${content}`);
    });

    connection.on("FriendRequestSent", (sender) => {
        console.log(`Friend request from: ${sender}`);
    });
}