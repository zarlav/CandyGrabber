import * as PIXI from "pixi.js";
import { LoginPage } from "./pages/loginPage.js";
import { RegisterPage } from "./pages/registerPage.js";
import { LobbyScene } from "./scenes/lobbyScene.js";
import { startConnection } from "./signalR/connection.js";
import { registerSignalREvents } from "./signalR/chatEvents.js";

export let app;

let loginPage = null;
let registerPage = null;

export async function createApp() {

    app = new PIXI.Application();

    await app.init({
        resizeTo: window,
        backgroundColor: 0x0f172a
    });
    app.canvas.style.position = "absolute";
    app.canvas.style.top = "0";
    app.canvas.style.left = "0";

    document.body.appendChild(app.view);

    showLogin();
}

function showLogin() {

    if (registerPage) {
        registerPage.destroy();
        registerPage = null;
    }

    loginPage = new LoginPage(
        app,

        // LOGIN SUCCESS
        async (userData) => {

            if (userData && userData.username) {

                await startConnection(userData.username);

                registerSignalREvents();

                loginPage.destroy();

                const lobby = new LobbyScene(app);
                app.stage.addChild(lobby.container);
            }
        },

        // REGISTER CLICK
        () => {
            showRegister();
        }
    );
}

function showRegister() {

    if (loginPage) {
        loginPage.destroy();
        loginPage = null;
    }

    registerPage = new RegisterPage(
        app,

        // BACK TO LOGIN
        () => {
            showLogin();
        }
    );
}