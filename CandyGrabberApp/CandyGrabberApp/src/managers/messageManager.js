import { connection } from "../signalR/connection";

export async function sendMessage(receiverId, content) {
    await connection.invoke("SendMessage", receiverId, content);
}