import { authService } from "../services/authService.js";

export class LoginPage {
    /**
     * @param {PIXI.Application} app - PixiJS app
     * @param {Function} onLoginSuccess - callback koji se poziva kada login uspe
     */
    constructor(app, onLoginSuccess) {
        this.app = app;
        this.onLoginSuccess = onLoginSuccess; // callback za App.js
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.createUI();
    }

    createUI() {
        const style = new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 24
        });

        // Username label
        const usernameLabel = new PIXI.Text("Username:", style);
        usernameLabel.position.set(100, 100);
        this.container.addChild(usernameLabel);

        // Username input
        this.usernameInput = document.createElement("input");
        this.usernameInput.type = "text";
        this.usernameInput.placeholder = "Enter username";
        this.usernameInput.style.position = "absolute";
        this.usernameInput.style.top = "130px";
        this.usernameInput.style.left = "100px";
        this.usernameInput.style.fontSize = "20px";
        document.body.appendChild(this.usernameInput);

        // Password label
        const passwordLabel = new PIXI.Text("Password:", style);
        passwordLabel.position.set(100, 180);
        this.container.addChild(passwordLabel);

        // Password input
        this.passwordInput = document.createElement("input");
        this.passwordInput.type = "password";
        this.passwordInput.placeholder = "Enter password";
        this.passwordInput.style.position = "absolute";
        this.passwordInput.style.top = "210px";
        this.passwordInput.style.left = "100px";
        this.passwordInput.style.fontSize = "20px";
        document.body.appendChild(this.passwordInput);

        // Login button
        this.loginButton = new PIXI.Text("Login", {
            fill: "#00ff00",
            fontSize: 30,
            fontWeight: "bold"
        });
        this.loginButton.interactive = true;
        this.loginButton.buttonMode = true;
        this.loginButton.position.set(100, 260);
        this.loginButton.on("pointerdown", () => this.handleLogin());
        this.container.addChild(this.loginButton);

        // Message display
        this.messageText = new PIXI.Text("", { fill: "#ff0000", fontSize: 20 });
        this.messageText.position.set(100, 320);
        this.container.addChild(this.messageText);
    }

    async handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!username || !password) {
            this.messageText.text = "Please enter username and password.";
            return;
        }

        try {
            const result = await authService.login(username, password);
            this.messageText.style.fill = "#00ff00";
            this.messageText.text = "Login successful!";

            // Poziv callback-a da App.js nastavi dalje (npr. LobbyPage)
            if (this.onLoginSuccess) {
                this.onLoginSuccess({ username, token: result.token });
            }

        } catch (err) {
            this.messageText.style.fill = "#ff0000";
            this.messageText.text = "Login failed: " + err.message;
        }
    }

    // Čišćenje UI elemenata kada login page više nije potreban
    destroy() {
        document.body.removeChild(this.usernameInput);
        document.body.removeChild(this.passwordInput);
        this.app.stage.removeChild(this.container);
    }
}
