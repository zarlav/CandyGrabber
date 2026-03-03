import * as PIXI from "pixi.js";
import { Button } from "../ui/button.js";
import { GameRequestManager } from "../managers/gameRequestManager.js";
import { FriendRequestManager } from "../managers/friendRequestManager.js";
import { SearchManager } from "../managers/searchManager.js";
import { authService } from "../services/authService.js";
import { config } from "../config.js";

export class LobbyScene {

    constructor(app) {
        this.app = app;

        this.container = new PIXI.Container();
        this.container.sortableChildren = true;

        this.app.stage.addChild(this.container);

        // ===== SEARCH RESULT =====
        this.searchResultContainer = new PIXI.Container();
        this.searchResultContainer.zIndex = 1000;
        this.container.addChild(this.searchResultContainer);

        this.currentUserId = Number(authService.getCurrentUserId());

        this.gameRequestManager = new GameRequestManager(config.apiBaseUrl);
        this.friendRequestManager = new FriendRequestManager(config.apiBaseUrl);
        this.searchManager = new SearchManager(config.apiBaseUrl);
        
        this.createUI();
        this.loadRequests(this.currentUserId);
    }

    createUI() {

        // ===== BACKGROUND =====
        const bg = new PIXI.Graphics();
        bg.beginFill(0x0f172a);
        bg.drawRect(0, 0, 800, 600);
        bg.endFill();
        this.container.addChildAt(bg, 0);

        // ===== TITLE =====
        const title = new PIXI.Text("GAME LOBBY", {
            fill: 0xffffff,
            fontSize: 36,
            fontWeight: "bold"
        });

        title.anchor.set(0.5);
        title.x = 400;
        title.y = 50;
        this.container.addChild(title);

       // ===== LEFT REQUESTS PANEL =====
        this.leftPanel = new PIXI.Container();
        this.leftPanel.x = 20;
        this.leftPanel.y = 140;
        this.container.addChild(this.leftPanel);

        const requestsPanel = new PIXI.Graphics();
        requestsPanel.beginFill(0x111827);
        requestsPanel.drawRoundedRect(0, 0, 250, 420, 16);
        requestsPanel.endFill();

        this.leftPanel.addChild(requestsPanel);

        const requestsTitle = new PIXI.Text("Game Requests", {
            fill: 0xffffff,
            fontSize: 18,
            fontWeight: "bold"
        });
        requestsTitle.x = 20;
        requestsTitle.y = 10;

        this.leftPanel.addChild(requestsTitle);

        // 🔥 REQUESTS CONTAINER IDE UNUTAR PANELA
        this.requestsContainer = new PIXI.Container();
        this.requestsContainer.x = 10;
        this.requestsContainer.y = 50;

        this.leftPanel.addChild(this.requestsContainer);

        // ===== USER INFO =====
        const meText = new PIXI.Text(
            `Logged ID: ${this.currentUserId}`,
            { fill: 0x38bdf8, fontSize: 18 }
        );

        meText.x = 70;
        meText.y = 120;
        this.container.addChild(meText);

        // ===== SEARCH INPUT (DOM) =====
        this.searchInput = document.createElement("input");
        this.searchInput.placeholder = "Enter username...";
        this.searchInput.type = "text";
        this.searchInput.style.cssText = `
            position:absolute;
            width:250px;
            padding:8px;
            border-radius:8px;
            border:none;
            outline:none;
            font-size:14px;
            background:#334155;
            color:white;
        `;

        this.searchInput.style.left = (window.innerWidth / 2 - 125) + "px";
        this.searchInput.style.top = "45px";

        document.body.appendChild(this.searchInput);

        // ===== SEARCH BUTTON =====
        const searchBtn = new Button(
            "Search",
            this.app.screen.width / 2 + 150,
            35,
            async () => {

                const username = this.searchInput.value.trim();
                if (!username) return;

                try {
                    const user = await this.searchManager.search(username);
                    this.showSearchResult(user);
                } catch (err) {
                    console.error("Search error:", err);
                    this.showSearchResult(null);
                }
            }
        );

        this.container.addChild(searchBtn.container);

        // ===== REQUEST FORM PANEL =====
        const formPanel = new PIXI.Graphics();
        formPanel.beginFill(0x1e293b);
        formPanel.drawRoundedRect(150, 200, 500, 180, 16);
        formPanel.endFill();
        this.container.addChild(formPanel);

        const formTitle = new PIXI.Text("Send Game Request", {
            fill: 0xffffff,
            fontSize: 22,
            fontWeight: "bold"
        });

        formTitle.x = 280;
        formTitle.y = 215;
        this.container.addChild(formTitle);

        const inputStyle = `
            position:absolute;
            width:220px;
            padding:10px;
            border-radius:8px;
            border:none;
            outline:none;
            font-size:16px;
            background:#334155;
            color:white;
        `;

        this.recipientInput = document.createElement("input");
        this.recipientInput.placeholder = "Recipient ID";
        this.recipientInput.type = "number";
        this.recipientInput.style.cssText = inputStyle + "left:290px; top:260px;";
        document.body.appendChild(this.recipientInput);

        this.gameInput = document.createElement("input");
        this.gameInput.placeholder = "Game ID";
        this.gameInput.type = "number";
        this.gameInput.style.cssText = inputStyle + "left:290px; top:310px;";
        document.body.appendChild(this.gameInput);

        const sendBtn = new Button(
            "Send Request",
            320,
            350,
            async () => {

                if (!this.currentUserId) return;

                const request = {
                    senderId: this.currentUserId,
                    recipientId: parseInt(this.recipientInput.value),
                    gameId: parseInt(this.gameInput.value),
                    timestamp: new Date().toISOString()
                };

                await this.gameRequestManager.send(request);
                await this.loadRequests(this.currentUserId);
            }
        );

        this.container.addChild(sendBtn.container);
    }

    async loadRequests(recipientId) {

    if (!recipientId) return;

    const requests = await this.gameRequestManager.getByRecipient(recipientId);

    this.requestsContainer.removeChildren();

    let y = 0;

    requests.forEach(req => {

        const card = new PIXI.Graphics();
        card.beginFill(0x1e293b);
        card.drawRoundedRect(0, y, 230, 80, 12); 
        card.endFill();

        const text = new PIXI.Text(
            `${req.sender.username} wants to play`,
            { fill: 0xffffff, fontSize: 14 }
        );

        text.x = 10;          
        text.y = y + 10;

        const acceptBtn = new Button("Accept", 10, y + 45, async () => {
            await this.gameRequestManager.accept(req.id);
            await this.loadRequests(recipientId);
        });

        const declineBtn = new Button("Decline", 110, y + 45, async () => {
            await this.gameRequestManager.decline(req.id);
            await this.loadRequests(recipientId);
        });

        this.requestsContainer.addChild(card);
        this.requestsContainer.addChild(text);
        this.requestsContainer.addChild(acceptBtn.container);
        this.requestsContainer.addChild(declineBtn.container);

        y += 100;
    });
}

   showSearchResult(user) {

    this.searchResultContainer.removeChildren();

    if (!this.searchInput.value.trim()) {
        return;
    }

    if (!user) {

        const notFound = new PIXI.Text("User not found", {
            fill: 0xff4d4d,
            fontSize: 20,
            fontWeight: "bold"
        });

        notFound.anchor.set(0.5);
        notFound.x = this.app.screen.width / 2;
        notFound.y = 120;

        this.searchResultContainer.addChild(notFound);
        return;
    }

    const cardWidth = 450;
    const cardHeight = 150;

    const card = new PIXI.Graphics();
    card.beginFill(0x1e293b);
    card.lineStyle(2, 0x38bdf8);
    card.drawRoundedRect(0, 0, cardWidth, cardHeight, 16);
    card.endFill();

    card.x = (this.app.screen.width - cardWidth) / 2;
    card.y = 110;

    const infoText = new PIXI.Text(
        `${user.name} ${user.lastName}\n\n` +
        `Username: ${user.username}\n` +
        `Wins: ${user.gamesWon} : Losses: ${user.gamesLost}`,
        {
            fill: 0xffffff,
            fontSize: 16,
            lineHeight: 24
        }
    );

    infoText.x = card.x + 20;
    infoText.y = card.y + 20;

 const requestBtn = new Button(
    "Add friend",
    card.x + cardWidth / 2 - 60,
    card.y + cardHeight - 40,
    async () => {

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
    }
);

    this.searchResultContainer.addChild(card);
    this.searchResultContainer.addChild(infoText);
    this.searchResultContainer.addChild(requestBtn.container);
}
}