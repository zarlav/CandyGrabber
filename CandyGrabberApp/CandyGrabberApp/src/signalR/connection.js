import * as signalR from "@microsoft/signalr";
import { config } from "../config.js";

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(config.hubUrl, { withCredentials: true })
    .withAutomaticReconnect([0, 2000, 10000])
    .build();

export async function startConnection(username) {
    try {
        await connection.start();
        console.log("SignalR connected");

        await connection.invoke("JoinGroup", username);
        window.currentUser = username;
    } catch (err) {
        console.error("SignalR connection error:", err);
        setTimeout(() => startConnection(username), 5000); // retry
    }
}

connection.onclose(async (error) => {
    console.warn("SignalR disconnected:", error);
    if (window.currentUser) {
        await startConnection(window.currentUser);
    }
});
