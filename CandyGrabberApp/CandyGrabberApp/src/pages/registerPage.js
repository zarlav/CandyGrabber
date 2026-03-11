import * as PIXI from "pixi.js";
import { authService } from "../services/authService.js";

export class RegisterPage {
    constructor(app, onBackToLogin) {
        this.app = app;
        this.onBackToLogin = onBackToLogin;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.createUI();

        this.resizeHandler = () => this.positionInputs();
        window.addEventListener('resize', this.resizeHandler);
    }

    createUI() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;
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

        const card = new PIXI.Graphics()
            .roundRect(-210, -260, 420, 520, 28)
            .stroke({ width: 4, color: 0x38bdf8, alpha: 0.2 })
            .roundRect(-200, -250, 400, 500, 24)
            .fill({ color: 0x1e293b, alpha: 0.95 })
            .stroke({ width: 2, color: 0x38bdf8, alpha: 1 });
        this.panel.addChild(card);

        const title = new PIXI.Text({
            text: "REGISTRACIJA",
            style: {
                fontFamily: 'Orbitron, sans-serif',
                fill: '#38bdf8',
                fontSize: 34,
                fontWeight: "bold",
                letterSpacing: 4,
                dropShadow: { alpha: 0.5, blur: 10, color: '#38bdf8', distance: 0 }
            }
        });
        title.anchor.set(0.5);
        title.y = -190;
        this.panel.addChild(title);

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

        this.nameInput = this.createHTMLInput("Ime", inputStyle);
        this.lastNameInput = this.createHTMLInput("Prezime", inputStyle);
        this.usernameInput = this.createHTMLInput("Korisničko ime", inputStyle);
        this.passwordInput = this.createHTMLInput("Lozinka", inputStyle, "password");
        this.repeatPasswordInput = this.createHTMLInput("Ponovi lozinku", inputStyle, "password");

        this.positionInputs();

        this.registerBtn = new PIXI.Graphics();
        this.registerBtn.y = 150;
        this.registerBtn.eventMode = 'static';
        this.registerBtn.cursor = 'pointer';
        this.updateButton(false);

        const btnText = new PIXI.Text({
            text: "REGISTRUJ SE",
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

        this.registerBtn.addChild(btnText);
        this.registerBtn.on("pointerover", () => this.updateButton(true));
        this.registerBtn.on("pointerout", () => this.updateButton(false));
        this.registerBtn.on("pointerdown", () => this.handleRegister());
        this.panel.addChild(this.registerBtn);

        this.backBtn = new PIXI.Text({
            text: "Nazad na prijavu",
            style: {
                fontFamily: 'Rajdhani',
                fill: "#38bdf8",
                fontSize: 16,
                fontWeight: "bold"
            }
        });
        this.backBtn.anchor.set(0.5);
        this.backBtn.y = 215;
        this.backBtn.eventMode = 'static';
        this.backBtn.cursor = 'pointer';
        this.backBtn.on("pointerover", () => this.backBtn.style.fill = "#ffffff");
        this.backBtn.on("pointerout", () => this.backBtn.style.fill = "#38bdf8");
        this.backBtn.on("pointerdown", () => this.handleBack());
        this.panel.addChild(this.backBtn);

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
        this.messageText.y = 245;
        this.panel.addChild(this.messageText);
    }

    updateButton(isHover) {
        const color = isHover ? 0x16a34a : 0x22c55e;
        this.registerBtn.clear()
            .roundRect(-140, 0, 280, 48, 12)
            .fill({ color: color, alpha: 1 })
            .stroke({ width: 1, color: 0xffffff, alpha: 0.3 });
        
        if (isHover) {
            this.registerBtn.stroke({ width: 3, color: 0x4ade80, alpha: 0.4 });
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
        const rect = this.app.canvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const startY = cy - 110;
        const spacing = 52;

        const inputs = [this.nameInput, this.lastNameInput, this.usernameInput, this.passwordInput, this.repeatPasswordInput];
        inputs.forEach((input, i) => {
            input.style.left = `${cx - 140}px`;
            input.style.top = `${startY + (i * spacing)}px`;
        });
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
            this.messageText.text = "Lozinke se ne poklapaju";
            return;
        }

        try {
            await authService.register({
                Username: username,
                Name: name,
                LastName: lastName,
                Password: password,
                RepeatedPassword: repeatPassword
            });
            this.messageText.style.fill = "#22c55e";
            this.messageText.text = "Uspešna registracija!";
        } catch (err) {
            this.messageText.text = err.message || "Greška pri registraciji";
        }
    }

    handleBack() {
        this.destroy();
        this.onBackToLogin();
    }

    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        [this.nameInput, this.lastNameInput, this.usernameInput, this.passwordInput, this.repeatPasswordInput].forEach(input => {
            if (input) input.remove();
        });
        this.app.stage.removeChild(this.container);
        this.container.destroy({ children: true });
    }
}