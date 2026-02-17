import * as PIXI from "pixi.js";
import { LoginPage } from "./pages/loginPage.js";
import { LobbyScene } from "./scenes/lobbyScene.js";
import { startConnection } from "./signalR/connection.js";
import { registerSignalREvents } from "./signalR/chatEvents.js";

export let app;

export async function createApp() {
    app = new PIXI.Application();

    await app.init({
        width: 900,
        height: 600,
        backgroundColor: 0x1e1e1e
    });

    document.body.appendChild(app.canvas);

    const loginPage = new LoginPage(app, async (userData) => {
        if (userData && userData.username) {
            // 1. Pokreni konekciju
            await startConnection(userData.username);
            
            registerSignalREvents();

            loginPage.destroy();

            const lobby = new LobbyScene(userData);
            app.stage.addChild(lobby.container);
        }
    });
}