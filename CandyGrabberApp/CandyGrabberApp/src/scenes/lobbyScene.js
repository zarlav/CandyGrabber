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
            const resumeHandler = (gameState) => {
                connection.off("GameResumed", resumeHandler);
                this.cleanup();
                new GameScene(this.app, gameState);
            };
            connection.on("GameResumed", resumeHandler);
            startConnection(this.currentUsername).then(() => {
                connection.invoke("JoinGame", parseInt(activeGameId));
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
        }, 5000);
    }

    async initSignalR() {
        if (!connection || connection.state !== "Connected") {
            await startConnection(this.currentUsername);
        }
        connection.on("ReceiveGameRequest", () => this.loadInitialData());
        connection.on("FriendRequestSent", () => this.loadInitialData());
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

        const title = new PIXI.Text({
            text: "CANDY GRABBER LOBBY",
            style: {
                fill: "#ffffff", fontSize: 28, fontFamily: "Orbitron", fontWeight: "bold",
                letterSpacing: 3, dropShadow: { alpha: 0.6, blur: 12, color: '#38bdf8', distance: 0 }
            }
        });
        title.anchor.set(0.5);
        title.x = sw / 2; title.y = 40;
        this.container.addChild(title);

        const userLabel = new PIXI.Text({
            text: `ULOGOVAN KAO: ${this.currentUsername.toUpperCase()}`,
            style: { fill: "#38bdf8", fontSize: 13, fontFamily: "Orbitron", fontWeight: "bold" }
        });
        userLabel.x = 25; userLabel.y = 15;
        this.container.addChild(userLabel);

        const profileBtn = new Button("PROFIL", 25, 40, () => {
            window.dispatchEvent(new CustomEvent("openProfile", { detail: this.currentUserId }));
        });
        this.container.addChild(profileBtn.container);

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
        document.body.appendChild(this.searchInput);

        const searchBtn = new Button("TRAŽI", 0, 0, async () => {
            const value = this.searchInput.value.trim();
            if (!value) {
                this.searchResultContainer.removeChildren();
                return;
            }
            const user = await this.searchManager.search(value, this.currentUsername);
            this.showSearchResult(user);
        });
        this.container.addChild(searchBtn.container);

        this.layoutUpdate = () => {
            const rect = this.app.canvas.getBoundingClientRect();
            this.searchInput.style.left = (rect.left + this.app.screen.width - 320) + "px";
            this.searchInput.style.top = (rect.top + 22) + "px";
            searchBtn.container.x = this.app.screen.width - 120;
            searchBtn.container.y = 22;
        };
        this.layoutUpdate();
        window.addEventListener("resize", this.layoutUpdate);
    }

    async loadInitialData() {
        try {
            const [gameReqs, friendReqs] = await Promise.all([
                this.gameRequestManager.getByRecipient(this.currentUserId),
                this.friendRequestManager.getByRecipient(this.currentUsername)
            ]);

            const stateHash = JSON.stringify({ gameReqs, friendReqs });
            if (this.lastDataHash === stateHash) return;
            this.lastDataHash = stateHash;

            this.requestsContainer.removeChildren();

            const panel = new PIXI.Graphics()
                .roundRect(20, 100, 320, 500, 16)
                .fill({ color: 0x111827, alpha: 0.9 })
                .stroke({ width: 2, color: 0x334155 });
            this.requestsContainer.addChild(panel);

            const title = new PIXI.Text({
                text: "ZAHTEVI I POZIVI",
                style: { fontFamily: 'Orbitron', fill: '#64748b', fontSize: 12, letterSpacing: 2 }
            });
            title.x = 40; title.y = 115;
            this.requestsContainer.addChild(title);

            let currentIdx = 0;
            if (gameReqs && Array.isArray(gameReqs)) {
                gameReqs.forEach((req) => {
                    if (req.senderId != this.currentUserId) {
                        this.addRequestCardToUI(req, currentIdx++, "GAME");
                    }
                });
            }

            if (friendReqs && Array.isArray(friendReqs)) {
                friendReqs.forEach((req) => {
                    this.addRequestCardToUI(req, currentIdx++, "FRIEND");
                });
            }

            await this.showFriendList(this.currentUserId);
        } catch (err) {
            console.error("Lobby load error:", err);
        }
    }

    addRequestCardToUI(req, index, type) {
        const isFriend = type === "FRIEND";
        const y = 160 + (index * 70);
        const color = isFriend ? 0x38bdf8 : 0x22c55e;
        const senderName = isFriend ? (req.sender?.username || req.senderUsername) : (req.sender?.username || req.senderUsername);

        const itemBg = new PIXI.Graphics()
            .roundRect(30, y - 10, 300, 60, 8)
            .fill({ color: 0x1e293b, alpha: 0.5 })
            .stroke({ width: 1, color: color, alpha: 0.3 });

        const label = new PIXI.Text({
            text: `${type}: ${senderName?.toUpperCase()}`,
            style: { fill: isFriend ? "#7dd3fc" : "#4ade80", fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 'bold' }
        });
        label.x = 45; label.y = y + 8;

        const btnLabel = isFriend ? "ACCEPT" : "PLAY";
        const actionBtn = new Button(btnLabel, 200, y, async () => {
            try {
                if (isFriend) {
                    await this.friendRequestManager.accept(req.id);
                } else {
                    await this.gameRequestManager.accept(req.id);
                    await connection.invoke("SendGameRequestAccepted", req.id, this.currentUsername, senderName);
                }
                this.loadInitialData();
            } catch (err) { console.error(err); }
        });

        this.requestsContainer.addChild(itemBg, label, actionBtn.container);
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
            const targetUsername = f.friend ? f.friend.username : (f.username || "Unknown");
            if (targetUsername === this.currentUsername || targetUsername === "Unknown") return;
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