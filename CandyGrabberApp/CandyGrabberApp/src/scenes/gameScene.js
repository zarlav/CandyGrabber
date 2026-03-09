import * as PIXI from "pixi.js";
import { connection } from "../signalR/connection.js"; 
import { LobbyScene } from "./lobbyScene.js";

export class GameScene {
    constructor(app, gameData) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.gameId = gameData.gameId || gameData.GameId;
        this.player1 = gameData.player1 || gameData.Player1; 
        this.player2 = gameData.player2 || gameData.Player2; 
        this.myId = localStorage.getItem("userId");

        this.gridSize = 50;
        this.gridWidth = 12;
        this.gridHeight = 12;
        
        this.players = {}; 
        this.scores = {};
        this.items = [];
        this.totalCandies = 11; 

        this.generateRandomMaze();
        this.initVisuals();
        this.setupKeyboardControls();
        this.setupSignalREvents();
        
        this.app.ticker.add(this.animateItems, this);
    }

    generateRandomMaze() {
        this.mazeLayout = Array.from({ length: this.gridHeight }, () => 
            Array.from({ length: this.gridWidth }, () => (Math.random() < 0.18 ? 1 : 0))
        );
        this.mazeLayout[0][0] = 0; 
        this.mazeLayout[this.gridHeight - 1][this.gridWidth - 1] = 0;
    }

    initVisuals() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;
        const mapWidth = this.gridWidth * this.gridSize;
        const mapHeight = this.gridHeight * this.gridSize;

        const bg = new PIXI.Graphics().rect(0, 0, sw, sh).fill(0x020617);
        this.container.addChildAt(bg, 0);

        this.gameArea = new PIXI.Container();
        this.gameArea.x = (sw - mapWidth) / 2;
        this.gameArea.y = (sh - mapHeight) / 2 + 40;
        this.container.addChild(this.gameArea);

        const mazeGraphics = new PIXI.Graphics();
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const posX = x * this.gridSize;
                const posY = y * this.gridSize;

                if (this.mazeLayout[y][x] === 1) {
                    mazeGraphics.roundRect(posX + 4, posY + 4, this.gridSize - 8, this.gridSize - 8, 4)
                                .fill({ color: 0x1e293b })
                                .stroke({ color: 0x38bdf8, width: 2, alpha: 0.6 });
                } else {
                    mazeGraphics.rect(posX, posY, this.gridSize, this.gridSize)
                                .fill({ color: 0x0f172a, alpha: 0.5 })
                                .stroke({ color: 0x1e293b, width: 1, alpha: 0.2 });
                }
            }
        }
        this.gameArea.addChild(mazeGraphics);

        this.uiContainer = new PIXI.Container();
        this.uiContainer.y = this.gameArea.y - 80;
        this.uiContainer.x = sw / 2;
        this.container.addChild(this.uiContainer);

        this.scoreText = new PIXI.Text({ 
            text: `CANDIES: 0 / ${this.totalCandies}`, 
            style: { 
                fill: "#facc15", 
                fontSize: 24, 
                fontFamily: "Orbitron", 
                fontWeight: "bold",
                dropShadow: { blur: 10, color: "#facc15", alpha: 0.4, distance: 0 }
            } 
        });
        this.scoreText.anchor.set(0.5);
        this.uiContainer.addChild(this.scoreText);

        this.playerScoreDisplay = new PIXI.Text({
            text: `${this.player1.username.toUpperCase()}: 0  |  ${this.player2.username.toUpperCase()}: 0`,
            style: { fill: "#94a3b8", fontSize: 16, fontFamily: "Rajdhani", fontWeight: "bold", letterSpacing: 2 }
        });
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

    spawnPlayers() {
        const p1Id = String(this.player1.userId || this.player1.id);
        const p2Id = String(this.player2.userId || this.player2.id);
        this.scores[p1Id] = 0; this.scores[p2Id] = 0;

        const p1 = this.createPlayerGraphic(0x00d2ff);
        p1.x = this.gridSize / 2; p1.y = this.gridSize / 2;
        this.playersContainer.addChild(p1);
        this.players[p1Id] = p1;

        const p2 = this.createPlayerGraphic(0xff006e);
        p2.x = (this.gridWidth - 1) * this.gridSize + this.gridSize / 2;
        p2.y = (this.gridHeight - 1) * this.gridSize + this.gridSize / 2;
        this.playersContainer.addChild(p2);
        this.players[p2Id] = p2;
    }

    createPlayerGraphic(color) {
        const p = new PIXI.Graphics().circle(0, 0, 16).fill(color).stroke({ color: 0xffffff, width: 3 });
        const core = new PIXI.Graphics().circle(0, 0, 8).fill({ color: 0xffffff, alpha: 0.5 });
        p.addChild(core);
        return p;
    }

    spawnCandies() {
        for (let i = 0; i < this.totalCandies; i++) {
            let rx, ry;
            do {
                rx = Math.floor(Math.random() * this.gridWidth);
                ry = Math.floor(Math.random() * this.gridHeight);
            } while (this.mazeLayout[ry][rx] === 1 || (rx === 0 && ry === 0) || (rx === this.gridWidth-1 && ry === this.gridHeight-1));

            // ISPRAVKA: CRTANJE BOMBONICE
            const candy = new PIXI.Graphics();
            const color = 0xf43f5e; // Pink/Crvena bombona
            
            // Krajevi omotača (levo i desno)
            candy.poly([-15, -8, -15, 8, -5, 0]).fill(color);
            candy.poly([15, -8, 15, 8, 5, 0]).fill(color);
            
            // Središnji deo (telo bombone)
            candy.ellipse(0, 0, 10, 7).fill(color).stroke({ color: 0xffffff, width: 1.5, alpha: 0.8 });
            
            candy.x = rx * this.gridSize + this.gridSize / 2;
            candy.y = ry * this.gridSize + this.gridSize / 2;
            candy.baseY = candy.y; 
            
            this.itemsContainer.addChild(candy);
            this.items.push(candy);
        }
    }

    animateItems() {
        const time = Date.now() * 0.005;
        this.items.forEach(item => {
            if (item.visible) {
                item.y = item.baseY + Math.sin(time) * 4;
                item.rotation = Math.sin(time * 0.5) * 0.2; // Blago ljuljanje
            }
        });
    }

    setupKeyboardControls() {
        this._handleKeyDown = (e) => {
            const me = this.players[this.myId];
            if (!me) return;
            let gX = Math.floor(me.x / this.gridSize);
            let gY = Math.floor(me.y / this.gridSize);

            if (e.code === "ArrowUp" || e.code === "KeyW") gY--;
            else if (e.code === "ArrowDown" || e.code === "KeyS") gY++;
            else if (e.code === "ArrowLeft" || e.code === "KeyA") gX--;
            else if (e.code === "ArrowRight" || e.code === "KeyD") gX++;
            else return;

            if (gY >= 0 && gY < this.gridHeight && gX >= 0 && gX < this.gridWidth && this.mazeLayout[gY][gX] === 0) {
                me.x = gX * this.gridSize + this.gridSize / 2;
                me.y = gY * this.gridSize + this.gridSize / 2;
                if (connection) connection.invoke("PlayerMove", this.gameId, parseInt(this.myId), me.x, me.y);
                this.checkCandyCollision(me);
            }
        };
        window.addEventListener("keydown", this._handleKeyDown);
    }

    checkCandyCollision(me) {
        this.items.forEach((item, index) => {
            if (item.visible && Math.abs(me.x - item.x) < 25 && Math.abs(me.y - item.y) < 25) {
                item.visible = false;
                this.scores[this.myId]++;
                this.updateScoreUI();
                if (connection) connection.invoke("PickItem", this.gameId, index);
                this.checkGameOver();
            }
        });
    }

    updateScoreUI() {
        const p1Id = String(this.player1.userId || this.player1.id);
        const p2Id = String(this.player2.userId || this.player2.id);
        const collected = Object.values(this.scores).reduce((a, b) => a + b, 0);
        this.scoreText.text = `CANDIES: ${collected} / ${this.totalCandies}`;
        this.playerScoreDisplay.text = `${this.player1.username.toUpperCase()}: ${this.scores[p1Id]}  |  ${this.player2.username.toUpperCase()}: ${this.scores[p2Id]}`;
    }

    async checkGameOver() {
        const collected = Object.values(this.scores).reduce((a, b) => a + b, 0);
        if (collected >= this.totalCandies) {
            const p1Id = parseInt(this.player1.userId || this.player1.id);
            const p2Id = parseInt(this.player2.userId || this.player2.id);
            const winnerId = this.scores[p1Id] > this.scores[p2Id] ? p1Id : p2Id;
            const loserId = (winnerId === p1Id) ? p2Id : p1Id;

            if (connection) await connection.invoke("EndGame", this.gameId, winnerId, loserId);
            alert("MISIJA ZAVRŠENA!");
            this.returnToLobby();
        }
    }

    setupSignalREvents() {
        if (!connection) return;
        connection.on("PlayerMoved", (playerId, x, y) => {
            if (String(playerId) !== String(this.myId) && this.players[playerId]) {
                this.players[playerId].x = x; 
                this.players[playerId].y = y;
            }
        });
        connection.on("ItemPicked", (index) => {
            if (this.items[index]) {
                this.items[index].visible = false;
                const otherPlayerId = Object.keys(this.players).find(id => id !== String(this.myId));
                if (otherPlayerId) {
                    this.scores[otherPlayerId]++;
                    this.updateScoreUI();
                }
            }
        });
    }

    returnToLobby() {
        this.cleanup();
        new LobbyScene(this.app);
    }

    cleanup() {
        window.removeEventListener("keydown", this._handleKeyDown);
        this.app.ticker.remove(this.animateItems, this);
        if (connection) {
            connection.off("PlayerMoved");
            connection.off("ItemPicked");
        }
        this.container.destroy({ children: true });
    }
}