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

        this.currentUserId = Number(authService.getCurrentUserId());

        this.gameRequestManager = new GameRequestManager(config.apiBaseUrl);
        this.friendRequestManager = new FriendRequestManager(config.apiBaseUrl);
        this.friendListManager = new FriendListManager(config.apiBaseUrl);
        this.searchManager = new SearchManager(config.apiBaseUrl);

        this.createUI();
        this.initSignalR();

        this.loadGameRequests(this.currentUserId);
        this.showFriendList(this.currentUserId);
    }

    async initSignalR() {
        await startConnection(authService.getCurrentUsername());

        // ---- CHAT MESSAGE EXAMPLE ----
        connection.on("ReceiveMessage", (sender, content) => {
            console.log(`Message from ${sender}: ${content}`);
        });

        // ---- FRIEND REQUEST REAL-TIME ----
        connection.on("FriendRequestSent", (senderUsername) => {
            console.log(`Friend request from: ${senderUsername}`);
            this.addFriendRequestToUI(senderUsername);
        });

        // ---- GAME REQUEST REAL-TIME ----
        connection.on("ReceiveGameRequest", (req) => {
            console.log("Received game request:", req);
            this.addGameRequestToUI(req);
        });

        // ---- GAME START REAL-TIME ----
        connection.on("GameStarted", (gameStartDTO) => {
            console.log("Game started:", gameStartDTO);
            this.startGame(gameStartDTO);
        });
    }

    startGame(game) {
        // destroy lobby UI
        this.container.destroy({ children: true, texture: true, baseTexture: true });
        import("../scenes/gameScene.js").then(module => {
            new module.GameScene(this.app, game);
        });
    }

    createUI() {
        // ---- BACKGROUND ----
        const bg = new PIXI.Graphics();
        bg.beginFill(0x0f172a);
        bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
        bg.endFill();
        this.container.addChildAt(bg, 0);

        // ---- TITLE ----
        const title = new PIXI.Text("GAME LOBBY", { fill: 0xffffff, fontSize: 36, fontWeight: "bold" });
        title.anchor.set(0.5);
        title.x = window.innerWidth / 2;
        title.y = 50;
        this.container.addChild(title);

        // ---- LEFT PANEL (REQUESTS) ----
        this.leftPanel = new PIXI.Container();
        this.leftPanel.x = 20;
        this.leftPanel.y = 140;
        this.container.addChild(this.leftPanel);

        const requestsPanel = new PIXI.Graphics();
        requestsPanel.beginFill(0x111827);
        requestsPanel.drawRoundedRect(0, 0, 250, 420, 16);
        requestsPanel.endFill();
        this.leftPanel.addChild(requestsPanel);

        const requestsTitle = new PIXI.Text("Requests", { fill: 0xffffff, fontSize: 18, fontWeight: "bold" });
        requestsTitle.x = 20;
        requestsTitle.y = 10;
        this.leftPanel.addChild(requestsTitle);

        const meText = new PIXI.Text(`Logged ID: ${this.currentUserId}`, { fill: 0x38bdf8, fontSize: 18 });
        meText.x = 70;
        meText.y = 120;
        this.container.addChild(meText);

        this.createSearchUI();
    }

    createSearchUI() {
        this.searchInput = document.createElement("input");
        this.searchInput.placeholder = "Enter username...";
        this.searchInput.type = "text";
        this.searchInput.style.cssText = `
            position:absolute;
            width:200px;
            padding:8px;
            border-radius:8px;
            border:none;
            outline:none;
            font-size:14px;
            background:#334155;
            color:white;
        `;
        document.body.appendChild(this.searchInput);

        this.searchInput.addEventListener("input", () => {
            if (!this.searchInput.value.trim()) this.searchResultContainer.removeChildren();
        });

        const searchBtn = new Button("Search", 0, 20, async () => {
            const username = this.searchInput.value.trim();
            if (!username) return;
            try {
                const user = await this.searchManager.search(username);
                this.showSearchResult(user);
            } catch (err) {
                console.error(err);
                this.showSearchResult(null);
            }
        });

        this.container.addChild(searchBtn.container);

        const updateSearchLayout = () => {
            const inputLeft = window.innerWidth - 200 - 80 - 10 - 20;
            this.searchInput.style.left = inputLeft + "px";
            this.searchInput.style.top = 20 + "px";
            searchBtn.container.x = inputLeft + 200 + 10;
            searchBtn.container.y = 20;
        };
        updateSearchLayout();
        window.addEventListener("resize", updateSearchLayout);
    }

    // ------------------ GAME REQUEST UI ------------------
    async loadGameRequests(userId) {
        if (!userId) return;
        const requests = await this.gameRequestManager.getByRecipient(userId);
        this.requestsContainer.removeChildren();

        let y = 0;
        requests.forEach(req => {
            this.addGameRequestToUI(req, y);
            y += 100;
        });
    }

    addGameRequestToUI(req, yOffset = null) {
        const y = yOffset !== null ? yOffset : this.requestsContainer.children.length * 100;

        const card = new PIXI.Graphics();
        card.beginFill(0x1e293b);
        card.drawRoundedRect(0, y, 230, 80, 12);
        card.endFill();

        const text = new PIXI.Text(`${req.username ?? req.sender.username} wants to play`, { fill: 0xffffff, fontSize: 14 });
        text.x = 10;
        text.y = y + 10;

        const acceptBtn = new Button("Accept", 10, y + 45, async () => {
            const game = await this.gameRequestManager.accept(req.senderId ?? req.id);
            this.startGame(game);
        });

        const declineBtn = new Button("Decline", 110, y + 45, async () => {
            await this.gameRequestManager.decline(req.senderId ?? req.id);
            card.destroy();
            text.destroy();
            acceptBtn.container.destroy();
            declineBtn.container.destroy();
        });

        this.requestsContainer.addChild(card);
        this.requestsContainer.addChild(text);
        this.requestsContainer.addChild(acceptBtn.container);
        this.requestsContainer.addChild(declineBtn.container);
    }

    // ------------------ FRIEND REQUEST UI ------------------
    async addFriendRequestToUI(senderUsername) {
        const y = this.requestsContainer.children.length * 100;

        const card = new PIXI.Graphics();
        card.beginFill(0x1e293b);
        card.drawRoundedRect(0, y, 230, 80, 12);
        card.endFill();

        const text = new PIXI.Text(`${senderUsername} sent you a friend request`, { fill: 0xffffff, fontSize: 14 });
        text.x = 10;
        text.y = y + 10;

        const acceptBtn = new Button("Accept", 10, y + 45, async () => {
            const requests = await this.friendRequestManager.getByRecipient(this.currentUserId);
            const req = requests.find(r => r.senderUsername === senderUsername);
            if (!req) return;

            await this.friendRequestManager.accept(req.id);
            card.destroy();
            text.destroy();
            acceptBtn.container.destroy();
            declineBtn.container.destroy();

            this.showFriendList(this.currentUserId);
        });

        const declineBtn = new Button("Decline", 110, y + 45, async () => {
            const requests = await this.friendRequestManager.getByRecipient(this.currentUserId);
            const req = requests.find(r => r.senderUsername === senderUsername);
            if (!req) return;

            await this.friendRequestManager.decline(req.id);
            card.destroy();
            text.destroy();
            acceptBtn.container.destroy();
            declineBtn.container.destroy();
        });

        this.requestsContainer.addChild(card);
        this.requestsContainer.addChild(text);
        this.requestsContainer.addChild(acceptBtn.container);
        this.requestsContainer.addChild(declineBtn.container);
    }

    // ------------------ FRIEND LIST UI ------------------
    async showFriendList(userId) {
        if (!userId) return;
        const friendships = await this.friendListManager.getFriendList(userId);
        this.friendListContainer.removeChildren();

        const inputLeft = parseInt(this.searchInput.style.left);
        const inputTop = parseInt(this.searchInput.style.top);

        let startY = inputTop + 70;

        const panel = new PIXI.Graphics();
        panel.beginFill(0x111827);
        panel.drawRoundedRect(inputLeft, startY - 40, 320, 400, 16);
        panel.endFill();
        this.friendListContainer.addChild(panel);

        const title = new PIXI.Text("Friends", { fill: 0xffffff, fontSize: 18, fontWeight: "bold" });
        title.x = inputLeft + 15;
        title.y = startY - 35;
        this.friendListContainer.addChild(title);

        startY += 10;

        friendships.forEach(f => {
            const friendUser = f.userId === userId ? f.friend : f.user;
            const recipientId = f.userId === userId ? f.friendId : f.userId;

            const card = new PIXI.Graphics();
            card.beginFill(0x1e293b);
            card.drawRoundedRect(inputLeft + 10, startY, 300, 50, 10);
            card.endFill();
            card.interactive = true;
            card.on("pointerover", () => card.tint = 0x2a3b55);
            card.on("pointerout", () => card.tint = 0xffffff);

            const nameText = new PIXI.Text(friendUser.username, { fill: 0xffffff, fontSize: 16 });
            nameText.x = inputLeft + 20;
            nameText.y = startY + 15;

            const inviteBtn = new Button("Invite", inputLeft + 210, startY + 10, async () => {
                const request = {
                    senderId: this.currentUserId,
                    recipientId: recipientId,
                    timestamp: new Date().toISOString()
                };
                await this.gameRequestManager.send(request);
                inviteBtn.setText("Sent");
                inviteBtn.container.interactive = false;
                inviteBtn.container.alpha = 0.6;
            });

            this.friendListContainer.addChild(card);
            this.friendListContainer.addChild(nameText);
            this.friendListContainer.addChild(inviteBtn.container);

            startY += 60;
        });
    }

    // ------------------ SEARCH RESULT ------------------
    showSearchResult(user) {
        this.searchResultContainer.removeChildren();
        if (!this.searchInput.value.trim()) return;

        const cardWidth = 300;
        const cardHeight = 150;

        const inputLeft = parseInt(this.searchInput.style.left);
        const inputTop = parseInt(this.searchInput.style.top);

        const cardX = inputLeft + 200 - cardWidth;
        const cardY = inputTop + 46;

        if (!user) {
            const notFound = new PIXI.Text("User not found", { fill: 0xff4d4d, fontSize: 20, fontWeight: "bold" });
            notFound.x = cardX + 80;
            notFound.y = cardY;
            this.searchResultContainer.addChild(notFound);
            return;
        }

        const card = new PIXI.Graphics();
        card.beginFill(0x1e293b);
        card.lineStyle(2, 0x38bdf8);
        card.drawRoundedRect(0, 0, cardWidth, cardHeight, 16);
        card.endFill();

        card.x = cardX;
        card.y = cardY;

        const infoText = new PIXI.Text(
            `${user.name} ${user.lastName}\nUsername: ${user.username}\nWins: ${user.gamesWon} : Losses: ${user.gamesLost}`,
            { fill: 0xffffff, fontSize: 16, lineHeight: 24 }
        );
        infoText.x = card.x + 20;
        infoText.y = card.y + 20;

        const requestBtn = new Button("Add friend", card.x + cardWidth / 2 - 60, card.y + cardHeight - 40, async () => {
            const request = {
                userId: this.currentUserId,
                friendUsername: user.username
            };
            await this.friendRequestManager.send(request);
            requestBtn.setText("Sent");
            requestBtn.container.interactive = false;
            requestBtn.container.alpha = 0.6;
        });

        this.searchResultContainer.addChild(card);
        this.searchResultContainer.addChild(infoText);
        this.searchResultContainer.addChild(requestBtn.container);
    }
}