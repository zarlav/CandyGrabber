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
        
        this.resizeHandler = () => this.positionInputs();
        window.addEventListener('resize', this.resizeHandler);
    }

    createUI() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;

        // --- 1. POZADINA ---
        const bg = new PIXI.Graphics()
            .rect(0, 0, sw, sh)
            .fill(0x020617);
        this.container.addChild(bg);

        const grid = new PIXI.Graphics();
        for (let i = 0; i < sw; i += 50) { grid.moveTo(i, 0).lineTo(i, sh); }
        for (let i = 0; i < sh; i += 50) { grid.moveTo(0, i).lineTo(sw, i); }
        grid.stroke({ width: 1, color: 0x38bdf8, alpha: 0.05 });
        this.container.addChild(grid);

        this.panel = new PIXI.Container();
        this.panel.x = sw / 2;
        this.panel.y = sh / 2;
        this.container.addChild(this.panel);

        // --- 2. KARTA ---
        const card = new PIXI.Graphics()
            .roundRect(-190, -220, 380, 440, 28)
            .stroke({ width: 4, color: 0x38bdf8, alpha: 0.2 })
            .roundRect(-180, -210, 360, 420, 24)
            .fill({ color: 0x1e293b, alpha: 0.95 })
            .stroke({ width: 2, color: 0x38bdf8, alpha: 1 });
        this.panel.addChild(card);

        // --- 3. NASLOV (Smanjen da ne štrči) ---
        const title = new PIXI.Text({
            text: "PRIJAVA",
            style: {
                fontFamily: 'Orbitron, sans-serif',
                fill: '#38bdf8',
                fontSize: 26, // Smanjeno sa 30 na 26
                fontWeight: "bold",
                letterSpacing: 2, // Smanjen spacing da stane u širinu
                dropShadow: { alpha: 0.5, blur: 10, color: '#38bdf8', distance: 0 }
            }
        });
        title.anchor.set(0.5);
        title.y = -150;
        this.panel.addChild(title);

        // --- 4. INPUTI ---
        const inputStyle = `
            position: fixed;
            width: 280px;
            height: 42px;
            background: #0f172a;
            color: #38bdf8;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 0 15px;
            text-align: center;
            font-size: 15px;
            outline: none;
            z-index: 9999;
            font-family: 'Rajdhani', sans-serif;
            transition: all 0.2s ease-in-out;
            letter-spacing: 1px;
            box-sizing: border-box;
        `;

        this.usernameInput = this.createHTMLInput("KORISNIČKO IME", inputStyle);
        this.passwordInput = this.createHTMLInput("LOZINKA", inputStyle, "password");

        this.positionInputs();

        // --- 5. LOGIN DUGME ---
        this.loginBtn = new PIXI.Graphics();
        this.loginBtn.y = 80; // Pomereno malo niže da ne guši inpute
        this.loginBtn.eventMode = 'static';
        this.loginBtn.cursor = 'pointer';
        this.updateButton(false);

        const btnText = new PIXI.Text({
            text: "PRIJAVI SE", // Promenjeno u PRIJAVI SE
            style: {
                fontFamily: 'Orbitron',
                fill: "#ffffff",
                fontSize: 16,
                fontWeight: "bold",
                letterSpacing: 1
            }
        });
        btnText.anchor.set(0.5);
        btnText.x = 0;
        btnText.y = 24;

        this.loginBtn.addChild(btnText);
        this.loginBtn.on("pointerover", () => this.updateButton(true));
        this.loginBtn.on("pointerout", () => this.updateButton(false));
        this.loginBtn.on("pointerdown", () => this.handleLogin());
        this.panel.addChild(this.loginBtn);

        // --- 6. REGISTRACIJA LINK ---
        this.registerBtn = new PIXI.Text({
            text: "Nemaš nalog? Registruj se",
            style: {
                fontFamily: 'Rajdhani',
                fill: "#38bdf8",
                fontSize: 16,
                fontWeight: "bold"
            }
        });
        this.registerBtn.anchor.set(0.5);
        this.registerBtn.y = 150;
        this.registerBtn.eventMode = 'static';
        this.registerBtn.cursor = 'pointer';
        this.registerBtn.on("pointerover", () => this.registerBtn.style.fill = "#ffffff");
        this.registerBtn.on("pointerout", () => this.registerBtn.style.fill = "#38bdf8");
        this.registerBtn.on("pointerdown", () => this.handleRegister());
        this.panel.addChild(this.registerBtn);

        this.messageText = new PIXI.Text({
            text: "",
            style: {
                fontFamily: 'Rajdhani',
                fill: "#fb7185",
                fontSize: 15,
                fontWeight: "bold"
            }
        });
        this.messageText.anchor.set(0.5);
        this.messageText.y = 185;
        this.panel.addChild(this.messageText);
    }

    updateButton(isHover) {
        const color = isHover ? 0x16a34a : 0x22c55e;
        this.loginBtn.clear()
            .roundRect(-140, 0, 280, 48, 12)
            .fill({ color: color, alpha: 1 })
            .stroke({ width: 1, color: 0xffffff, alpha: 0.3 });
        
        if (isHover) {
            this.loginBtn.stroke({ width: 3, color: 0x4ade80, alpha: 0.4 });
        }
    }

    createHTMLInput(placeholder, style, type = "text") {
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        input.style.cssText = style;
        
        input.onfocus = () => {
            input.style.borderColor = "#38bdf8";
            input.style.boxShadow = "0 0 15px rgba(56, 189, 248, 0.4)";
        };
        input.onblur = () => {
            input.style.borderColor = "#334155";
            input.style.boxShadow = "none";
        };

        document.body.appendChild(input);
        return input;
    }

    positionInputs() {
        const canvas = this.app.canvas || this.app.view;
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        this.usernameInput.style.left = `${cx - 140}px`;
        this.usernameInput.style.top = `${cy - 50}px`;
        this.passwordInput.style.left = `${cx - 140}px`;
        this.passwordInput.style.top = `${cy + 15}px`;
    }

    async handleLogin() {
        const user = this.usernameInput.value.trim();
        const pass = this.passwordInput.value.trim();
        if (!user || !pass) {
            this.messageText.text = "SISTEM: Popunite sva polja";
            return;
        }
        try {
            const res = await authService.login(user, pass);
            this.destroy();
            this.onLoginSuccess(res);
        } catch (err) {
            this.messageText.text = "GREŠKA: Neispravni podaci";
        }
    }

    handleRegister() {
        this.destroy();
        this.onRegisterClick();
    }

    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        if (this.usernameInput) this.usernameInput.remove();
        if (this.passwordInput) this.passwordInput.remove();
        this.container.destroy({ children: true });
    }
}