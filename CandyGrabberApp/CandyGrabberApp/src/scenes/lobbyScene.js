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

        this.searchResultContainer = new PIXI.Container();
        this.searchResultContainer.zIndex = 1000;
        this.container.addChild(this.searchResultContainer);

        this.friendListContainer = new PIXI.Container();
        this.container.addChild(this.friendListContainer);

        this.currentUserId = Number(authService.getCurrentUserId());

        this.gameRequestManager = new GameRequestManager(config.apiBaseUrl);
        this.friendRequestManager = new FriendRequestManager(config.apiBaseUrl);
        this.friendListManager = new FriendListManager(config.apiBaseUrl);
        this.searchManager = new SearchManager(config.apiBaseUrl);

        this.initSignalR();

        this.createUI();
        this.loadRequests(this.currentUserId);
        this.showFriendList(this.currentUserId);
    }

    async initSignalR() {
        await startConnection(authService.getCurrentUsername());

        // primanje chat poruka
        connection.on("ReceiveMessage", (sender, content) => {
            console.log(`Message from ${sender}: ${content}`);
        });

        // friend request
        connection.on("FriendRequestSent", (sender) => {
            console.log(`Friend request from: ${sender}`);
        });

        // primanje game requesta u real-time
        connection.on("ReceiveGameRequest", (req) => {
            console.log("Primljen game request:", req);
            this.addGameRequestToUI(req);
        });

        // pokretanje igre
        connection.on("GameStarted", (gameStartDTO) => {
            console.log("Game started:", gameStartDTO);
            this.startGame(gameStartDTO);
        });
    }

    startGame(game) {
        this.container.destroy({ children: true, texture: true, baseTexture: true });
        import("../scenes/gameScene.js").then(module => {
            new module.GameScene(this.app, game);
        });
    }

    createUI() {
        const bg = new PIXI.Graphics();
        bg.beginFill(0x0f172a);
        bg.drawRect(0, 0, 800, 600);
        bg.endFill();
        this.container.addChildAt(bg, 0);

        const title = new PIXI.Text("GAME LOBBY", { fill: 0xffffff, fontSize: 36, fontWeight: "bold" });
        title.anchor.set(0.5);
        title.x = 400;
        title.y = 50;
        this.container.addChild(title);

        this.leftPanel = new PIXI.Container();
        this.leftPanel.x = 20;
        this.leftPanel.y = 140;
        this.container.addChild(this.leftPanel);

        const requestsPanel = new PIXI.Graphics();
        requestsPanel.beginFill(0x111827);
        requestsPanel.drawRoundedRect(0, 0, 250, 420, 16);
        requestsPanel.endFill();
        this.leftPanel.addChild(requestsPanel);

        const requestsTitle = new PIXI.Text("Game Requests", { fill: 0xffffff, fontSize: 18, fontWeight: "bold" });
        requestsTitle.x = 20;
        requestsTitle.y = 10;
        this.leftPanel.addChild(requestsTitle);

        this.requestsContainer = new PIXI.Container();
        this.requestsContainer.x = 10;
        this.requestsContainer.y = 50;
        this.leftPanel.addChild(this.requestsContainer);

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

        const inputWidth = 200;
        const gap = 10;
        const buttonWidth = 80;
        const topOffset = 20;

        this.searchInput.style.cssText = `
            position:absolute;
            width:${inputWidth}px;
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

        const searchBtn = new Button("Search", 0, topOffset, async () => {
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
            const inputLeft = window.innerWidth - inputWidth - buttonWidth - gap - 20;
            this.searchInput.style.left = inputLeft + "px";
            this.searchInput.style.top = topOffset + "px";
            searchBtn.container.x = inputLeft + inputWidth + gap;
            searchBtn.container.y = topOffset;
        };

        updateSearchLayout();
        window.addEventListener("resize", updateSearchLayout);
    }

    async loadRequests(recipientId) {
        if (!recipientId) return;

        const requests = await this.gameRequestManager.getByRecipient(recipientId);
        this.requestsContainer.removeChildren();

        let y = 0;
        requests.forEach(req => {
            this.addGameRequestToUI(req, y);
            y += 100;
        });
    }

    addGameRequestToUI(req, yOffset = null) {
        let y = yOffset !== null ? yOffset : this.requestsContainer.children.length * 100;

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

    async showFriendList(currentUserId) {
        if (!currentUserId) return;

        const friendships = await this.friendListManager.getFriendList(currentUserId);
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
            const friendUser = f.userId === currentUserId ? f.friend : f.user;
            const recipientId = f.userId === currentUserId ? f.friendId : f.userId;

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
                try {
                    const request = {
                        senderId: this.currentUserId,
                        recipientId: recipientId,
                        timestamp: new Date().toISOString()
                    };

                    await this.gameRequestManager.send(request);

                    inviteBtn.setText("Sent");
                    inviteBtn.container.interactive = false;
                    inviteBtn.container.alpha = 0.6;
                } catch (err) {
                    console.error(err);
                }
            });

            this.friendListContainer.addChild(card);
            this.friendListContainer.addChild(nameText);
            this.friendListContainer.addChild(inviteBtn.container);

            startY += 60;
        });
    }

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
            try {
                const request = {
                    userId: this.currentUserId,
                    friendUsername: user.username
                };
                await this.friendRequestManager.send(request);

                requestBtn.setText("Sent");
                requestBtn.container.interactive = false;
                requestBtn.container.alpha = 0.6;
            } catch (err) {
                console.error(err);
            }
        });

        this.searchResultContainer.addChild(card);
        this.searchResultContainer.addChild(infoText);
        this.searchResultContainer.addChild(requestBtn.container);
    }

}