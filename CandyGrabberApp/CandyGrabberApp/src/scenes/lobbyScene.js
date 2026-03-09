import * as PIXI from "pixi.js";
import { Button } from "../ui/button.js";
import { GameRequestManager } from "../managers/gameRequestManager.js";
import { FriendRequestManager } from "../managers/friendRequestManager.js";
import { SearchManager } from "../managers/searchManager.js";
import { FriendListManager } from "../managers/friendListManager.js";
import { authService } from "../services/authService.js";
import { config } from "../config.js";
import { connection, startConnection } from "../signalR/connection.js";

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

        connection.on("ReceiveGameRequest", (req) => { this.loadInitialData(); });
        connection.on("FriendRequestSent", (senderUsername) => { this.addFriendRequestToUI(senderUsername); });
        connection.on("GameStarted", (gameStartDTO) => { this.startGame(gameStartDTO); });
    }

    createUI() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;
        
        // 1. POZADINA I GRID
        const bg = new PIXI.Graphics().rect(0, 0, sw, sh).fill(0x020617);
        this.container.addChildAt(bg, 0);

        const grid = new PIXI.Graphics();
        for (let i = 0; i < sw; i += 60) { grid.moveTo(i, 0).lineTo(i, sh); }
        for (let i = 0; i < sh; i += 60) { grid.moveTo(0, i).lineTo(sw, i); }
        grid.stroke({ width: 1, color: 0x38bdf8, alpha: 0.05 });
        this.container.addChildAt(grid, 1);

        // 2. HEADER BAR
        const header = new PIXI.Graphics()
            .rect(0, 0, sw, 80)
            .fill({ color: 0x0f172a, alpha: 0.8 })
            .stroke({ width: 2, color: 0x38bdf8, alpha: 0.2 });
        this.container.addChild(header);

        // ISPRAVLJENO: "ULOGOVAN KAO:"
        const userLabel = new PIXI.Text({ 
            text: `ULOGOVAN KAO: ${this.currentUsername.toUpperCase()}`, 
            style: { 
                fill: "#38bdf8", 
                fontSize: 13, 
                fontWeight: "bold", 
                fontFamily: "Orbitron",
                letterSpacing: 1.5
            } 
        });
        userLabel.x = 25; userLabel.y = 15;
        this.container.addChild(userLabel);

        const profileBtn = new Button("PROFIL", 25, 40, () => {
            window.dispatchEvent(new CustomEvent("openProfile", { detail: this.currentUserId }));
        });
        this.container.addChild(profileBtn.container);

        // ISPRAVLJENO: Naslov sada koristi Orbitron (kao na Login stranici)
        const title = new PIXI.Text({ 
            text: "CANDY GRABBER LOBBY", 
            style: { 
                fill: "#ffffff", 
                fontSize: 28, 
                fontWeight: "bold", 
                fontFamily: "Orbitron", // Identičan font kao na login-u
                letterSpacing: 3,
                dropShadow: { alpha: 0.6, blur: 12, color: '#38bdf8', distance: 0 }
            } 
        });
        title.anchor.set(0.5); title.x = sw / 2; title.y = 40;
        this.container.addChild(title);

        // 3. LEVI PANEL (NOTIFIKACIJE)
        const leftPanel = new PIXI.Graphics()
            .roundRect(20, 100, 280, 500, 16)
            .fill({ color: 0x111827, alpha: 0.9 })
            .stroke({ width: 2, color: 0x334155 });
        this.container.addChildAt(leftPanel, 2);

        const leftTitle = new PIXI.Text({
            text: "NOTIFIKACIJE",
            style: { fontFamily: 'Orbitron', fill: '#64748b', fontSize: 12, letterSpacing: 2 }
        });
        leftTitle.x = 40; leftTitle.y = 115;
        this.container.addChild(leftTitle);

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
            const user = await this.searchManager.search(this.searchInput.value.trim(), this.currentUsername);
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
            const isInitiator = String(f.userId) === String(userId);
            const targetUsername = isInitiator ? f.friend.username : f.user.username;
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

            // ISPRAVLJENO: Invite dugme pomereno unutra (x: panelX + 180) da ne štrči
            const inviteBtn = new Button("INVITE", panelX + 180, y, async () => {
                try {
                    await connection.invoke("SendGameRequest", this.currentUsername, targetUsername);
                } catch (e) { console.error(e); }
            });

            this.friendListContainer.addChild(itemBg, name, inviteBtn.container);
            displayIndex++;
        });
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
                    const sId = req.senderId || req.sender?.id;
                    const sName = req.sender?.username || req.senderUsername;
                    if (sId == this.currentUserId) return; 

                    this.addGameRequestToUI({ id: req.id, username: sName || "Nepoznat igrač" });
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

    addFriendRequestToUI(senderUsername) {
        const y = this.requestsContainer.children.length * 100;
        const container = new PIXI.Container();
        container.x = 40; container.y = 140 + y;

        const card = new PIXI.Graphics()
            .roundRect(0, 0, 240, 90, 12)
            .fill(0x1e293b)
            .stroke({ width: 2, color: 0x38bdf8, alpha: 0.5 });
        
        const text = new PIXI.Text({ 
            text: `ZAHTEV: ${senderUsername}`, 
            style: { fill: "#38bdf8", fontSize: 12, fontFamily: 'Orbitron' } 
        });
        text.x = 15; text.y = 15;

        const acceptBtn = new Button("PRIHVATI", 15, 45, async () => {
            const requests = await this.friendRequestManager.getByRecipient(this.currentUsername);
            const req = requests.find(r => r.senderUsername === senderUsername);
            if (req) {
                await this.friendRequestManager.accept(req.id);
                container.destroy();
                this.showFriendList(this.currentUserId);
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

    startGame(game) {
        this.cleanup();
        import("./gameScene.js").then(m => { new m.GameScene(this.app, game); });
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