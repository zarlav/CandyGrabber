import * as PIXI from "pixi.js";
import { authService } from "../services/authService.js";

export class LoginPage {
    constructor(app, onLoginSuccess) {
        this.app = app;
        this.onLoginSuccess = onLoginSuccess;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.createUI();
    }

    createUI() {
        const style = new PIXI.TextStyle({ fill: "#ffffff", fontSize: 24 });

        this.usernameInput = document.createElement("input");
        this.usernameInput.placeholder = "Username";
        this.usernameInput.style.cssText = "position:absolute; top:130px; left:100px; font-size:20px;";
        document.body.appendChild(this.usernameInput);

        this.passwordInput = document.createElement("input");
        this.passwordInput.type = "password";
        this.passwordInput.placeholder = "Password";
        this.passwordInput.style.cssText = "position:absolute; top:210px; left:100px; font-size:20px;";
        document.body.appendChild(this.passwordInput);

        this.loginBtn = new PIXI.Text({ text: "Login", style: { fill: "#00ff00", fontSize: 30, fontWeight: "bold" } });
        this.loginBtn.position.set(100, 260);
        this.loginBtn.eventMode = "static";
        this.loginBtn.cursor = "pointer";
        this.loginBtn.on("pointerdown", () => this.handleLogin());
        this.container.addChild(this.loginBtn);

        this.registerBtn = new PIXI.Text({ text: "Register", style: { fill: "#00ffff", fontSize: 30, fontWeight: "bold" } });
        this.registerBtn.position.set(250, 260);
        this.registerBtn.eventMode = "static";
        this.registerBtn.cursor = "pointer";
        this.registerBtn.on("pointerdown", () => this.handleRegister());
        this.container.addChild(this.registerBtn);

        this.messageText = new PIXI.Text({ text: "", style: { fill: "#ff0000", fontSize: 20 } });
        this.messageText.position.set(100, 320);
        this.container.addChild(this.messageText);
    }

    async handleLogin() {
        const user = this.usernameInput.value.trim();
        const pass = this.passwordInput.value.trim();

        if (!user || !pass) {
            this.messageText.text = "Popunite polja";
            return;
        }

        try {
            const res = await authService.login(user, pass);
            if (res.message === "success") {
                this.onLoginSuccess({ username: user });
            }
        } catch (err) {
            this.messageText.text = err.message;
        }
    }

    async handleRegister() {
        const user = this.usernameInput.value.trim();
        const pass = this.passwordInput.value.trim();

        if (!user || !pass) {
            this.messageText.text = "Popunite polja";
            return;
        }

        try {
            const userDTO = {
                Username: user,
                Name: user,
                LastName: user,
                Password: pass,
                RepeatedPassword: pass
            };
            await authService.register(userDTO);
            this.messageText.style.fill = "#00ff00";
            this.messageText.text = "Registrovan! Klikni Login.";
        } catch (err) {
            this.messageText.style.fill = "#ff0000";
            this.messageText.text = err.message;
        }
    }

    destroy() {
        if (this.usernameInput) this.usernameInput.remove();
        if (this.passwordInput) this.passwordInput.remove();
        this.app.stage.removeChild(this.container);
    }
}