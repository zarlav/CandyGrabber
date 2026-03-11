import * as PIXI from "pixi.js";
import { Button } from "../ui/button.js";
import { GameRequestManager } from "../managers/gameRequestManager.js";
import { FriendRequestManager } from "../managers/friendRequestManager.js";
import { SearchManager } from "../managers/searchManager.js";
import { FriendListManager } from "../managers/friendListManager.js";
import { authService } from "../services/authService.js";
import { config } from "../config.js";
import { connection, startConnection } from "../signalR/connection.js";
import { GameScene } from "./gameScene.js";

export class LobbyScene {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.app.stage.addChild(this.container);

        this.requestsContainer = new PIXI.Container();
        this.requestsContainer.zIndex = 1000;
        this.container.addChild(this.requestsContainer);

        this.friendListContainer = new PIXI.Container();
        this.container.addChild(this.friendListContainer);

        this.searchResultContainer = new PIXI.Container();
        this.searchResultContainer.zIndex = 2000;
        this.container.addChild(this.searchResultContainer);

        this.currentUserId = authService.getCurrentUserId();
        this.currentUsername = authService.getCurrentUsername();


        const activeGameId = localStorage.getItem("activeGameId");
        if (activeGameId) {
            console.log("Reconnecting to game:", activeGameId);

            const resumeHandler = (gameState) => {
                connection.off("GameResumed", resumeHandler);
                console.log("GameResumed received", gameState);
                this.cleanup();
                new GameScene(this.app, gameState);
            };

            connection.on("GameResumed", resumeHandler);

            startConnection(this.currentUsername).then(() => {
                connection.invoke("JoinGame", parseInt(activeGameId))
                    .then(() => console.log("Requested game state"));
            });
            return;
        }
        this.gameRequestManager = new GameRequestManager(config.apiBaseUrl);
        this.friendRequestManager = new FriendRequestManager(config.apiBaseUrl);
        this.friendListManager = new FriendListManager(config.apiBaseUrl);
        this.searchManager = new SearchManager(config.apiBaseUrl);

        this.createUI();
        this.initSignalR();
        this.loadInitialData();

        this.refreshInterval = setInterval(() => {
            this.loadInitialData();
        }, 3000);
    }

    async initSignalR() {
        if (!connection || connection.state !== "Connected") {
            await startConnection(this.currentUsername);
        }

        connection.on("ReceiveGameRequest", () => this.loadInitialData());
        connection.on("FriendRequestSent", (senderUsername) => this.addFriendRequestToUI(senderUsername));
        connection.on("GameStarted", (gameStartDTO) => this.startGame(gameStartDTO));
    }

    createUI() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;

        const bg = new PIXI.Graphics().rect(0, 0, sw, sh).fill(0x020617);
        this.container.addChildAt(bg, 0);

        const grid = new PIXI.Graphics();
        for (let i = 0; i < sw; i += 60) grid.moveTo(i, 0).lineTo(i, sh);
        for (let i = 0; i < sh; i += 60) grid.moveTo(0, i).lineTo(sw, i);
        grid.stroke({ width: 1, color: 0x38bdf8, alpha: 0.05 });
        this.container.addChildAt(grid, 1);

        const header = new PIXI.Graphics()
            .rect(0, 0, sw, 80)
            .fill({ color: 0x0f172a, alpha: 0.8 })
            .stroke({ width: 2, color: 0x38bdf8, alpha: 0.2 });
        this.container.addChild(header);

        const userLabel = new PIXI.Text({
            text: `ULOGOVAN KAO: ${this.currentUsername.toUpperCase()}`,
            style: { fill: "#38bdf8", fontSize: 13, fontWeight: "bold", fontFamily: "Orbitron", letterSpacing: 1.5 }
        });
        userLabel.x = 25; userLabel.y = 15;
        this.container.addChild(userLabel);

        const profileBtn = new Button("PROFIL", 25, 40, () => {
            window.dispatchEvent(new CustomEvent("openProfile", { detail: this.currentUserId }));
        });
        this.container.addChild(profileBtn.container);

        const title = new PIXI.Text({
            text: "CANDY GRABBER LOBBY",
            style: {
                fill: "#ffffff",
                fontSize: 28,
                fontWeight: "bold",
                fontFamily: "Orbitron",
                letterSpacing: 3,
                dropShadow: { alpha: 0.6, blur: 12, color: '#38bdf8', distance: 0 }
            }
        });
        title.anchor.set(0.5);
        title.x = sw / 2; title.y = 40;
        this.container.addChild(title);

        this.createSearchUI();
    }

    createSearchUI() {
    if (this.searchInput) this.searchInput.remove();
    this.searchInput = document.createElement("input");
    this.searchInput.placeholder = "PRETRAGA IGRAČA...";
    this.searchInput.style.cssText = `
        position:fixed; width:180px; padding:10px; border-radius:8px; 
        background:#0f172a; color:#38bdf8; border:1px solid #334155; 
        z-index:999; font-family:'Rajdhani'; font-weight:bold; letter-spacing:1px;
        outline:none; transition: all 0.2s;
    `;
    this.searchInput.onfocus = () => this.searchInput.style.borderColor = "#38bdf8";
    this.searchInput.onblur = () => this.searchInput.style.borderColor = "#334155";
    document.body.appendChild(this.searchInput);

    const searchBtn = new Button("TRAŽI", 0, 0, async () => {
        const value = this.searchInput.value.trim();
        if (!value) {
            this.clearSearchResult(); 
            return;
        }
        const user = await this.searchManager.search(value, this.currentUsername);
        this.showSearchResult(user);
    });
    this.container.addChild(searchBtn.container);
    this.searchInput.addEventListener("input", () => {
        if (!this.searchInput.value.trim()) {
            this.clearSearchResult();
        }
    });

    this.layoutUpdate = () => {
        const rect = this.app.view.getBoundingClientRect();
        this.searchInput.style.left = (rect.left + this.app.screen.width - 320) + "px";
        this.searchInput.style.top = (rect.top + 22) + "px";
        searchBtn.container.x = this.app.screen.width - 120;
        searchBtn.container.y = 22;
    };
    this.layoutUpdate();
    window.addEventListener("resize", this.layoutUpdate);
}
    clearSearchResult() {
    if (this.searchResultContainer) {
        this.searchResultContainer.removeChildren();
    }
}

    async loadInitialData() {
        try {
            const gameRequests = await this.gameRequestManager.getByRecipient(this.currentUserId);
            const currentHash = JSON.stringify(gameRequests);
            if (this.lastDataHash === currentHash) return;
            this.lastDataHash = currentHash;

            this.requestsContainer.removeChildren();

            if (gameRequests && Array.isArray(gameRequests)) {
                gameRequests.forEach(req => {
                    const sName = req.sender?.username || req.senderUsername || "Nepoznat igrač";
                    if (req.senderId == this.currentUserId) return;
                    this.addGameRequestToUI({ id: req.id, username: sName });
                });
            }
            await this.showFriendList(this.currentUserId);
        } catch (err) { console.error("LobbyScene load error:", err); }
    }

    addGameRequestToUI(req) {
        const y = this.requestsContainer.children.length * 100;
        const container = new PIXI.Container();
        container.x = 40; container.y = 140 + y;

        const card = new PIXI.Graphics()
            .roundRect(0, 0, 240, 90, 12)
            .fill(0x1e293b)
            .stroke({ width: 2, color: 0x22c55e, alpha: 0.5 });

        const text = new PIXI.Text({ 
            text: `POZIV: ${req.username.toUpperCase()}`, 
            style: { fill: "#4ade80", fontSize: 12, fontFamily: 'Orbitron', fontWeight: 'bold' } 
        });
        text.x = 15; text.y = 15;

        const acceptBtn = new Button("IGRAJ", 15, 45, async () => {
            try {
                await this.gameRequestManager.accept(req.id);
                await connection.invoke("SendGameRequestAccepted", req.id, this.currentUsername, req.username);
            } catch (err) { console.error(err); }
        });

        container.addChild(card, text, acceptBtn.container);
        this.requestsContainer.addChild(container);
    }

addFriendRequestToUI(request) {
    const y = this.requestsContainer.children.length * 100;
    const container = new PIXI.Container();
    container.x = 40; 
    container.y = 140 + y;

    const card = new PIXI.Graphics()
        .beginFill(0x1e293b)
        .lineStyle(2, 0x38bdf8, 0.5)
        .drawRoundedRect(0, 0, 240, 90, 12)
        .endFill();

    const text = new PIXI.Text(
        `ZAHTEV: ${request.senderUsername}`, 
        { fill: "#38bdf8", fontSize: 12, fontFamily: 'Orbitron' }
    );
    text.x = 15; 
    text.y = 15;

    const acceptBtn = new Button("PRIHVATI", 15, 45, async () => {
        try {
            console.log("Slanje Accept zahteva za ID:", request.id);
            await this.friendRequestManager.accept(request.id); 
            container.destroy();
            this.showFriendList(this.currentUserId);
        } catch (err) {
            console.error("Greska pri prihvatanju zahteva:", err);
        }
    });

    container.addChild(card, text, acceptBtn.container);
    this.requestsContainer.addChild(container);
}

    showSearchResult(user) {
        this.searchResultContainer.removeChildren();
        if (!user) return;
        const sw = this.app.screen.width;

        const card = new PIXI.Graphics()
            .roundRect(sw - 340, 100, 320, 160, 16)
            .fill(0x1e293b)
            .stroke({ width: 3, color: 0x38bdf8 });

        const text = new PIXI.Text({ 
            text: `PRONAĐEN: ${user.username}`, 
            style: { fill: "#38bdf8", fontFamily: 'Orbitron', fontSize: 14 } 
        });
        text.x = sw - 315; text.y = 125;

        const addBtn = new Button("DODAJ", sw - 300, 180, async () => {
            await connection.invoke("SendFriendRequest", this.currentUsername, user.username);
            this.searchResultContainer.removeChildren();
        });

        this.searchResultContainer.addChild(card, text, addBtn.container);
    }

    async showFriendList(userId) {
        const friendships = await this.friendListManager.getFriendList(userId);
        this.friendListContainer.removeChildren();
        const panelX = this.app.screen.width - 340;

        const panel = new PIXI.Graphics()
            .roundRect(panelX, 100, 320, 500, 16)
            .fill({ color: 0x111827, alpha: 0.9 })
            .stroke({ width: 2, color: 0x334155 });
        this.friendListContainer.addChild(panel);

        const listTitle = new PIXI.Text({
            text: "LISTA PRIJATELJA",
            style: { fontFamily: 'Orbitron', fill: '#64748b', fontSize: 12, letterSpacing: 2 }
        });
        listTitle.x = panelX + 20; listTitle.y = 115;
        this.friendListContainer.addChild(listTitle);

        let displayIndex = 0;
        friendships.forEach((f) => {
            const targetUsername = f.friend.username;
            if (targetUsername === this.currentUsername) return;
            const y = 160 + (displayIndex * 70);

            const itemBg = new PIXI.Graphics()
                .roundRect(panelX + 10, y - 10, 300, 60, 8)
                .fill({ color: 0x1e293b, alpha: 0.5 });

            const name = new PIXI.Text({ 
                text: targetUsername, 
                style: { fill: "#ffffff", fontSize: 16, fontFamily: 'Rajdhani', fontWeight: 'bold' } 
            });
            name.x = panelX + 25; name.y = y + 8;

            const inviteBtn = new Button("INVITE", panelX + 180, y, async () => {
                try { await connection.invoke("SendGameRequest", this.currentUsername, targetUsername); } 
                catch (e) { console.error(e); }
            });

            this.friendListContainer.addChild(itemBg, name, inviteBtn.container);
            displayIndex++;
        });
    }

    startGame(game) {
        this.cleanup();
        new GameScene(this.app, game);
    }

    cleanup() {
        clearInterval(this.refreshInterval);
        if (this.searchInput) this.searchInput.remove();
        window.removeEventListener("resize", this.layoutUpdate);
        connection.off("ReceiveGameRequest");
        connection.off("FriendRequestSent");
        connection.off("GameStarted");
        this.container.destroy({ children: true });
    }
}