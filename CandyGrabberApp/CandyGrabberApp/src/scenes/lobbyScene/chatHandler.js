import { connection } from "../../signalR/connection.js";

export function registerChatEvents(container) {
    connection.on("ReceiveMessage", (sender, content) => {
        console.log(`Message from ${sender}: ${content}`);
        // TODO: render u chat UI ako postoji
    });
}