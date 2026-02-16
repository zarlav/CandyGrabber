import { createApp } from "./App.js";
import { startConnection } from "./signalR/connection.js";
import { registerSignalREvents } from "./signalR/chatEvents.js";

async function bootstrap() {
    await startConnection();
    registerSignalREvents();
    createApp();
}

bootstrap();