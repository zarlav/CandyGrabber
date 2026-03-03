import * as PIXI from "pixi.js";
import { LoginPage } from "./pages/loginPage.js";
import { LobbyScene } from "./scenes/lobbyScene.js";
import { startConnection } from "./signalR/connection.js";
import { registerSignalREvents } from "./signalR/chatEvents.js";

export let app;

export async function createApp() {
    app = new PIXI.Application();

   await app.init({
    resizeTo: window,
    backgroundColor: 0x0f172a
});

    document.body.appendChild(app.view);

    const loginPage = new LoginPage(app, async (userData) => {
        if (userData && userData.username) {
            await startConnection(userData.username);
            
            registerSignalREvents();

            loginPage.destroy();

            const lobby = new LobbyScene(app);
            app.stage.addChild(lobby.container);
        }
    });
}