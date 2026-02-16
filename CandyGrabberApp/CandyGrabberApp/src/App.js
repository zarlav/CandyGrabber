import * as PIXI from "pixi.js";
import { LoginPage } from "./pages/loginPage.js";
import { LobbyScene } from "./scenes/lobbyScene.js";

export let app;

export function createApp() {
    app = new PIXI.Application({
        width: 900,
        height: 600,
        backgroundColor: 0x1e1e1e
    });

    document.body.appendChild(app.view);

    // Start sa LoginPage
    const loginPage = new LoginPage(app, (userData) => {
        console.log("Ulogovani korisnik:", userData);

        // Očisti login page UI
        loginPage.destroy();

        // Pokreni LobbyScene posle logina
        const lobby = new LobbyScene(userData);
        app.stage.addChild(lobby.container);
    });
}
