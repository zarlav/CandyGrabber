import * as PIXI from "pixi.js";
import { authService } from "../services/authService.js";

export class RegisterPage {
    constructor(app, onBackToLogin) {
        this.app = app;
        this.onBackToLogin = onBackToLogin;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.createUI();
    }

    createUI() {

        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;
        const spacing = 50;

        // ===== PANEL =====
        this.panel = new PIXI.Container();
        this.panel.x = centerX;
        this.panel.y = centerY;
        this.container.addChild(this.panel);

        // ===== BACKGROUND =====
        const bg = new PIXI.Graphics();
        bg.beginFill(0x1e293b);
        bg.drawRoundedRect(-220, -220, 440, 440, 20);
        bg.endFill();
        this.panel.addChild(bg);

        // ===== TITLE =====
        const title = new PIXI.Text("REGISTER", {
            fill: 0xffffff,
            fontSize: 36,
            fontWeight: "bold"
        });

        title.anchor.set(0.5);
        title.y = -170;
        this.panel.addChild(title);

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

        const inputOffsetX = centerX - 120;

        // ===== NAME =====
        this.nameInput = document.createElement("input");
        this.nameInput.placeholder = "Name";
        this.nameInput.style.cssText = inputStyle;
        this.nameInput.style.left = `${inputOffsetX}px`;
        this.nameInput.style.top = `${centerY - spacing*2}px`;
        document.body.appendChild(this.nameInput);

        // ===== LASTNAME =====
        this.lastNameInput = document.createElement("input");
        this.lastNameInput.placeholder = "Last Name";
        this.lastNameInput.style.cssText = inputStyle;
        this.lastNameInput.style.left = `${inputOffsetX}px`;
        this.lastNameInput.style.top = `${centerY - spacing}px`;
        document.body.appendChild(this.lastNameInput);

        // ===== USERNAME =====
        this.usernameInput = document.createElement("input");
        this.usernameInput.placeholder = "Username";
        this.usernameInput.style.cssText = inputStyle;
        this.usernameInput.style.left = `${inputOffsetX}px`;
        this.usernameInput.style.top = `${centerY}px`;
        document.body.appendChild(this.usernameInput);

        // ===== PASSWORD =====
        this.passwordInput = document.createElement("input");
        this.passwordInput.type = "password";
        this.passwordInput.placeholder = "Password";
        this.passwordInput.style.cssText = inputStyle;
        this.passwordInput.style.left = `${inputOffsetX}px`;
        this.passwordInput.style.top = `${centerY + spacing}px`;
        document.body.appendChild(this.passwordInput);

        // ===== REPEAT PASSWORD =====
        this.repeatPasswordInput = document.createElement("input");
        this.repeatPasswordInput.type = "password";
        this.repeatPasswordInput.placeholder = "Repeat Password";
        this.repeatPasswordInput.style.cssText = inputStyle;
        this.repeatPasswordInput.style.left = `${inputOffsetX}px`;
        this.repeatPasswordInput.style.top = `${centerY + spacing*2}px`;
        document.body.appendChild(this.repeatPasswordInput);

        // ===== REGISTER BUTTON =====
        this.registerBtn = new PIXI.Text({
            text: "Register",
            style: { fill: "#22c55e", fontSize: 28, fontWeight: "bold" }
        });

        this.registerBtn.anchor.set(0.5);
        this.registerBtn.y = 150;
        this.registerBtn.eventMode = "static";
        this.registerBtn.cursor = "pointer";
        this.registerBtn.on("pointerdown", () => this.handleRegister());

        this.panel.addChild(this.registerBtn);

        // ===== BACK BUTTON =====
        this.backBtn = new PIXI.Text({
            text: "Back to Login",
            style: { fill: "#38bdf8", fontSize: 22 }
        });

        this.backBtn.anchor.set(0.5);
        this.backBtn.y = 190;
        this.backBtn.eventMode = "static";
        this.backBtn.cursor = "pointer";
        this.backBtn.on("pointerdown", () => this.handleBack());

        this.panel.addChild(this.backBtn);

        // ===== MESSAGE =====
        this.messageText = new PIXI.Text({
            text: "",
            style: { fill: "#ef4444", fontSize: 18 }
        });

        this.messageText.anchor.set(0.5);
        this.messageText.y = 210;

        this.panel.addChild(this.messageText);
    }

    async handleRegister() {

        const name = this.nameInput.value.trim();
        const lastName = this.lastNameInput.value.trim();
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        const repeatPassword = this.repeatPasswordInput.value.trim();

        if (!name || !lastName || !username || !password || !repeatPassword) {
            this.messageText.text = "Popunite sva polja";
            return;
        }

        if (password !== repeatPassword) {
            this.messageText.text = "Password se ne poklapa";
            return;
        }

        try {

            const userDTO = {
                Username: username,
                Name: name,
                LastName: lastName,
                Password: password,
                RepeatedPassword: repeatPassword
            };

            await authService.register(userDTO);

            this.messageText.style.fill = "#22c55e";
            this.messageText.text = "Uspesna registracija";

        } catch (err) {
            this.messageText.style.fill = "#ef4444";
            this.messageText.text = err.message;
        }
    }

    handleBack() {
        this.destroy();
        this.onBackToLogin();
    }

    destroy() {

        if (this.nameInput) this.nameInput.remove();
        if (this.lastNameInput) this.lastNameInput.remove();
        if (this.usernameInput) this.usernameInput.remove();
        if (this.passwordInput) this.passwordInput.remove();
        if (this.repeatPasswordInput) this.repeatPasswordInput.remove();

        this.app.stage.removeChild(this.container);
    }
}