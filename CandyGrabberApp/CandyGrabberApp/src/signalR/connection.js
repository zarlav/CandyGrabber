import * as signalR from "@microsoft/signalr";
import { config } from "../config.js";

// Kreiramo praznu varijablu
export let connection = null;

export function createConnection(username) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.hubUrl}?username=${username}`, {
            withCredentials: true,
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect([0, 2000, 10000])
        .build();
    
    return connection;
}

export async function startConnection(username) {
    if (!connection) {
        createConnection(username);
    }

    if (connection.state === "Connected") return connection;

    try {
        await connection.start();
        console.log("SignalR connected as:", username);
        window.currentUser = username;
        return connection;
    } catch (err) {
        console.error("SignalR connection error:", err);
        setTimeout(() => startConnection(username), 5000);
    }
}