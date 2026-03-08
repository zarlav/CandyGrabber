import * as PIXI from "pixi.js";
import { authService } from "../services/authService.js";

export class LoginPage {
    constructor(app, onLoginSuccess, onRegisterClick) {
        this.app = app;
        this.onLoginSuccess = onLoginSuccess;
        this.onRegisterClick = onRegisterClick;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.createUI();
    }

    createUI() {

        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;

        // ===== PANEL CONTAINER =====
        this.panel = new PIXI.Container();
        this.panel.x = centerX;
        this.panel.y = centerY;
        this.container.addChild(this.panel);

        // ===== BACKGROUND CARD =====
        const bg = new PIXI.Graphics();
        bg.beginFill(0x1e293b);
        bg.drawRoundedRect(-200, -180, 400, 360, 20);
        bg.endFill();
        this.panel.addChild(bg);

        // ===== TITLE =====
        const title = new PIXI.Text("LOGIN", {
            fill: 0xffffff,
            fontSize: 36,
            fontWeight: "bold"
        });
        title.anchor.set(0.5);
        title.y = -130;
        this.panel.addChild(title);

        // ===== INPUT STYLE =====
        const inputStyle = `
            position:absolute;
            width:240px;
            padding:10px;
            border-radius:8px;
            border:none;
            outline:none;
            font-size:18px;
            background:#334155;
            color:white;
            text-align:center;
        `;

        // ===== USERNAME =====
        this.usernameInput = document.createElement("input");
        this.usernameInput.placeholder = "Username";
        this.usernameInput.style.cssText = inputStyle;
        document.body.appendChild(this.usernameInput);

        // ===== PASSWORD =====
        this.passwordInput = document.createElement("input");
        this.passwordInput.type = "password";
        this.passwordInput.placeholder = "Password";
        this.passwordInput.style.cssText = inputStyle;
        document.body.appendChild(this.passwordInput);

        // centriranje HTML inputa
        const inputOffsetX = centerX - 120;

        this.usernameInput.style.left = `${inputOffsetX}px`;
        this.usernameInput.style.top = `${centerY - 40}px`;

        this.passwordInput.style.left = `${inputOffsetX}px`;
        this.passwordInput.style.top = `${centerY + 10}px`;

        // ===== LOGIN BUTTON =====
        this.loginBtn = new PIXI.Text({
            text: "Login",
            style: { fill: "#22c55e", fontSize: 28, fontWeight: "bold" }
        });

        this.loginBtn.anchor.set(0.5);
        this.loginBtn.y = 60;
        this.loginBtn.eventMode = "static";
        this.loginBtn.cursor = "pointer";
        this.loginBtn.on("pointerdown", () => this.handleLogin());

        this.panel.addChild(this.loginBtn);

        // ===== REGISTER BUTTON =====
        this.registerBtn = new PIXI.Text({
            text: "Register",
            style: { fill: "#38bdf8", fontSize: 22 }
        });

        this.registerBtn.anchor.set(0.5);
        this.registerBtn.y = 110;
        this.registerBtn.eventMode = "static";
        this.registerBtn.cursor = "pointer";
        this.registerBtn.on("pointerdown", () => this.handleRegister());

        this.panel.addChild(this.registerBtn);

        // ===== MESSAGE TEXT =====
        this.messageText = new PIXI.Text({
            text: "",
            style: { fill: "#ef4444", fontSize: 18 }
        });

        this.messageText.anchor.set(0.5);
        this.messageText.y = 150;

        this.panel.addChild(this.messageText);
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
            this.onLoginSuccess(res);
        } catch (err) {
            this.messageText.text = err.message;
        }
    }

    handleRegister() {
        this.destroy();
        this.onRegisterClick();
    }

    destroy() {
        if (this.usernameInput) this.usernameInput.remove();
        if (this.passwordInput) this.passwordInput.remove();

        this.app.stage.removeChild(this.container);
    }
}