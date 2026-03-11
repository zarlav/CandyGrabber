import * as PIXI from "pixi.js";
import { connection, startConnection } from "../signalR/connection.js";
import { LobbyScene } from "./lobbyScene.js";

export class GameScene {
    constructor(app, gameData = {}) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.playerData = gameData.players || gameData.Players || {};
        
        this.gameId = gameData.gameId || gameData.GameId;
        if (this.gameId) localStorage.setItem("activeGameId", this.gameId);

        this.mazeLayout = gameData.mazeLayout || gameData.MazeLayout || [];
        this.candiesData = (gameData.candies || gameData.Candies || []).map(c => ({ x: c.X ?? c.x, y: c.Y ?? c.y }));
        this.candiesCollected = gameData.candiesCollected || gameData.CandiesCollected || [];
        this.totalCandies = this.candiesData.length;

        this.playerX = gameData.playerX || gameData.PlayerX || {};
        this.playerY = gameData.playerY || gameData.PlayerY || {};
        this.scores = gameData.scores || gameData.Scores || {};

        this.gridSize = 50;
        this.gridWidth = this.mazeLayout.length ? this.mazeLayout[0].length : 0;
        this.gridHeight = this.mazeLayout.length;

        this.players = {};
        this.items = [];

        this.myId = localStorage.getItem("userId");

        this.initVisuals();

        startConnection(localStorage.getItem("username")).then(() => {
            if (this.gameId) connection.invoke("JoinGame", this.gameId);
            this.setupSignalREvents();
            this.setupKeyboardControls();
        });

        this.app.ticker.add(this.animateItems, this);
    }

    initVisuals() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;

        const bg = new PIXI.Graphics().rect(0, 0, sw, sh).fill(0x020617);
        this.container.addChild(bg);

        const mapWidth = this.gridWidth * this.gridSize;
        const mapHeight = this.gridHeight * this.gridSize;
        this.gameArea = new PIXI.Container();
        this.gameArea.x = (sw - mapWidth) / 2;
        this.gameArea.y = (sh - mapHeight) / 2 + 40;
        this.container.addChild(this.gameArea);

        this.drawMaze();

        this.uiContainer = new PIXI.Container();
        this.uiContainer.x = sw / 2;
        this.uiContainer.y = this.gameArea.y - 80;
        this.container.addChild(this.uiContainer);

        this.scoreText = new PIXI.Text(`CANDIES: 0 / ${this.totalCandies}`, {
            fill: "#facc15", fontSize: 24, fontFamily: "Orbitron", fontWeight: "bold"
        });
        this.scoreText.anchor.set(0.5);
        this.uiContainer.addChild(this.scoreText);

        this.playerScoreDisplay = new PIXI.Text(
            Object.keys(this.playerX).map(id => `${id}: ${this.scores[id] || 0}`).join(" | "),
            { fill: "#94a3b8", fontSize: 16, fontFamily: "Rajdhani", fontWeight: "bold" }
        );
        this.playerScoreDisplay.anchor.set(0.5);
        this.playerScoreDisplay.y = 35;
        this.uiContainer.addChild(this.playerScoreDisplay);

        this.itemsContainer = new PIXI.Container();
        this.gameArea.addChild(this.itemsContainer);
        this.spawnCandies();

        this.playersContainer = new PIXI.Container();
        this.gameArea.addChild(this.playersContainer);
        this.spawnPlayers();
    }

    drawMaze() {
        if (!this.mazeLayout) return;
        const mazeGraphics = new PIXI.Graphics();
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const posX = x * this.gridSize;
                const posY = y * this.gridSize;
                if (this.mazeLayout[y][x] === 1) {
                    mazeGraphics.roundRect(posX + 4, posY + 4, this.gridSize - 8, this.gridSize - 8, 4)
                        .fill({ color: 0x1e293b }).stroke({ color: 0x38bdf8, width: 2 });
                } else {
                    mazeGraphics.rect(posX, posY, this.gridSize, this.gridSize).fill({ color: 0x0f172a, alpha: 0.5 });
                }
            }
        }
        this.gameArea.addChild(mazeGraphics);
    }

    spawnPlayers() {
    this.playersContainer.removeChildren();
    this.players = {};
    for (const id in this.playerX) {
        const color = id === this.myId ? 0x00d2ff : 0xff006e;
        const sprite = new PIXI.Graphics().circle(0, 0, 16).fill(color).stroke({ color: 0xffffff, width: 3 });
        const core = new PIXI.Graphics().circle(0, 0, 8).fill({ color: 0xffffff, alpha: 0.5 });
        sprite.addChild(core);
        const gridX = Math.floor((this.playerX[id] ?? 0) / this.gridSize);
        const gridY = Math.floor((this.playerY[id] ?? 0) / this.gridSize);

        sprite.x = gridX * this.gridSize + this.gridSize / 2;
        sprite.y = gridY * this.gridSize + this.gridSize / 2;

        this.playersContainer.addChild(sprite);
        this.players[id] = sprite;
        this.playerX[id] = sprite.x;
        this.playerY[id] = sprite.y;
    }
    this.updateScoreUI();
}

    spawnCandies() {
        this.itemsContainer.removeChildren();
        this.items = [];
        this.candiesData.forEach((candyPos, index) => {
            const candy = new PIXI.Graphics();
            const color = 0xf43f5e;
            candy.poly([-15,-8,-15,8,-5,0]).fill(color);
            candy.poly([15,-8,15,8,5,0]).fill(color);
            candy.ellipse(0,0,10,7).fill(color).stroke({ color: 0xffffff, width: 1.5 });

            candy.x = candyPos.x;
            candy.y = candyPos.y;
            candy.baseY = candy.y;

            candy.visible = !this.candiesCollected[index];
            this.itemsContainer.addChild(candy);
            this.items.push(candy);
        });
    }

    animateItems() {
        const time = Date.now() * 0.005;
        this.items.forEach(item => {
            if (!item.visible) return;
            item.y = item.baseY + Math.sin(time) * 4;
            item.rotation = Math.sin(time * 0.5) * 0.2;
        });
    }

    setupKeyboardControls() {
        this._handleKeyDown = e => {
            const me = this.players[this.myId];
            if (!me) return;

            let gX = Math.floor(me.x / this.gridSize);
            let gY = Math.floor(me.y / this.gridSize);

            if (e.code === "KeyW") gY--;
            else if (e.code === "KeyS") gY++;
            else if (e.code === "KeyA") gX--;
            else if (e.code === "KeyD") gX++;
            else return;

            if (gX >= 0 && gY >= 0 && gX < this.gridWidth && gY < this.gridHeight && this.mazeLayout[gY][gX] === 0) {
                me.x = gX * this.gridSize + this.gridSize / 2;
                me.y = gY * this.gridSize + this.gridSize / 2;

                if (connection && connection.state === "Connected") {
                    connection.invoke("PlayerMove", this.gameId, parseInt(this.myId), me.x, me.y);
                }

                this.checkCandyCollision(me);
            }
        };
        window.addEventListener("keydown", this._handleKeyDown);
    }

 checkCandyCollision(me) {
    const playerGridX = Math.floor(me.x / this.gridSize);
    const playerGridY = Math.floor(me.y / this.gridSize);

    this.items.forEach((item, index) => {
        if (!item.visible) return;

        const candyGridX = Math.floor(item.x / this.gridSize);
        const candyGridY = Math.floor(item.y / this.gridSize);

        if (playerGridX === candyGridX && playerGridY === candyGridY) {
            console.log("Request pick candy", index);
            connection.invoke("PickItem", this.gameId, index, parseInt(this.myId));
        }
    });
}

    setupSignalREvents() {
        connection.on("PlayerMoved", (playerId, x, y) => {
            const id = String(playerId);
            if (this.players[id] && id !== this.myId) {
                this.players[id].x = x;
                this.players[id].y = y;
            }
        });
        connection.on("ItemPicked", (index, userId) => {
            console.log("Candy picked", index, "by", userId);
                if (this.items[index]) {
                    this.items[index].visible = false;
                }
                if (this.scores[userId] !== undefined) {
                    this.scores[userId]++; 
                }
            this.updateScoreUI();
        });

        connection.on("MatchFinished", (winnerId) => {

            const isWinner = String(winnerId) === this.myId;
            const overlay = new PIXI.Graphics();
            overlay.beginFill(0x000000, 0.7);
            overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
            overlay.endFill();
            this.container.addChild(overlay);

            const cardWidth = 400;
            const cardHeight = 200;
            const card = new PIXI.Graphics();
            card.beginFill(0x1e293b);
            card.lineStyle(4, 0x38bdf8);
            card.drawRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 16);
            card.endFill();
            card.x = this.app.screen.width / 2;
            card.y = this.app.screen.height / 2;
            this.container.addChild(card);

            const message = new PIXI.Text(
                isWinner ? "VI STE POBEDNIK!" : "IZGUBILI STE!",
                { fontFamily: "Rajdhani", fontSize: 24, fontWeight: "bold", fill: isWinner ? "#22c55e" : "#ef4444", align: "center" }
            );
            message.anchor.set(0.5);
            message.x = card.x;
            message.y = card.y;
            this.container.addChild(message);

            overlay.interactive = true;
            overlay.buttonMode = true;
            overlay.once("pointerdown", () => {
                localStorage.removeItem("activeGameId");
                this.returnToLobby();
            });
        });

        connection.on("GameResumed", (gameState) => {
            console.log("GameResumed received", gameState);
            this.playerData = gameState.players || this.playerData;
            this.candiesCollected = gameState.candiesCollected || this.candiesCollected;

            this.playerX = gameState.playerX || this.playerX;
            this.playerY = gameState.playerY || this.playerY;
            this.scores = gameState.scores || this.scores;

            this.spawnPlayers();

            this.items.forEach((item, index) => {
                item.visible = !this.candiesCollected[index];
            });

            this.updateScoreUI();
        });
    }

   updateScoreUI() {
    const collected = Object.values(this.scores).reduce((a,b)=>a+b,0);
    this.scoreText.text = `CANDIES: ${collected} / ${this.totalCandies}`;

    this.playerScoreDisplay.text = Object.keys(this.playerX)
        .map(id => `${this.playerData[id]?.username || id}: ${this.scores[id] || 0}`)
        .join(" | ");
}

    returnToLobby() {
        this.cleanup();
        new LobbyScene(this.app);
    }

    cleanup() {
        window.removeEventListener("keydown", this._handleKeyDown);
        this.app.ticker.remove(this.animateItems, this);
        connection.off("PlayerMoved");
        connection.off("ItemPicked");
        connection.off("MatchFinished");
        connection.off("GameResumed");
        this.container.destroy({ children: true });
    }
}