import { connection } from "../signalR/connection.js";

export async function sendMessage(receiverId, content) {
    if (!connection) throw new Error("SignalR connection not initialized");
    await connection.invoke("SendMessage", receiverId, content);
}