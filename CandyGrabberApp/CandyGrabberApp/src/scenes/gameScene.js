import * as PIXI from "pixi.js";
import { connection, startConnection } from "../signalR/connection.js";
import { LobbyScene } from "./lobbyScene.js";

export class GameScene {
    constructor(app, gameData) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.gameId = gameData.gameId || gameData.GameId;

        this.player1 = gameData.player1 || gameData.Player1;
        this.player2 = gameData.player2 || gameData.Player2;

        this.mazeLayout = gameData.mazeLayout || gameData.MazeLayout;
        this.candiesData = gameData.candies || gameData.Candies;

        const myUserId = localStorage.getItem("userId");
        this.myId = String(this.player1.userId) === String(myUserId) ? String(this.player1.userId) : String(this.player2.userId);
        this.otherPlayerId = this.myId === String(this.player1.userId) ? String(this.player2.userId) : String(this.player1.userId);

        this.gridSize = 50;
        this.gridWidth = this.mazeLayout[0].length;
        this.gridHeight = this.mazeLayout.length;

        this.players = {};
        this.scores = {};
        this.items = [];
        this.totalCandies = this.candiesData.length;

        this.initVisuals();

        // prvo osiguramo da je SignalR konekcija startovana
        startConnection(localStorage.getItem("username")).then(() => {
            this.setupSignalREvents();
            this.setupKeyboardControls();
        });

        this.app.ticker.add(this.animateItems, this);
    }

    initVisuals() {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;
        const mapWidth = this.gridWidth * this.gridSize;
        const mapHeight = this.gridHeight * this.gridSize;

        const bg = new PIXI.Graphics().rect(0, 0, sw, sh).fill(0x020617);
        this.container.addChild(bg);

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
            `${this.player1.username.toUpperCase()}: 0  |  ${this.player2.username.toUpperCase()}: 0`,
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
        const p1Id = String(this.player1.userId);
        const p2Id = String(this.player2.userId);

        this.scores[p1Id] = 0;
        this.scores[p2Id] = 0;

        const p1 = this.createPlayerGraphic(0x00d2ff);
        p1.x = this.gridSize / 2;
        p1.y = this.gridSize / 2;
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
        this.candiesData.forEach(candyPos => {
            const candy = new PIXI.Graphics();
            const color = 0xf43f5e;
            candy.poly([-15,-8,-15,8,-5,0]).fill(color);
            candy.poly([15,-8,15,8,5,0]).fill(color);
            candy.ellipse(0,0,10,7).fill(color).stroke({ color: 0xffffff, width: 1.5 });
            candy.x = candyPos.x * this.gridSize + this.gridSize / 2;
            candy.y = candyPos.y * this.gridSize + this.gridSize / 2;
            candy.baseY = candy.y;
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

                // emituj samo ako konekcija startovana
                if (connection && connection.state === "Connected") {
                    connection.invoke("PlayerMove", this.gameId, parseInt(this.myId), me.x, me.y);
                }

                this.checkCandyCollision(me);
            }
        };

        window.addEventListener("keydown", this._handleKeyDown);
    }

    checkCandyCollision(me) {
        this.items.forEach((item, index) => {
            if (!item.visible) return;
            if (Math.abs(me.x - item.x) < 25 && Math.abs(me.y - item.y) < 25) {
                item.visible = false;
                this.scores[this.myId]++;
                this.updateScoreUI();
                if (connection && connection.state === "Connected") {
                    connection.invoke("PickItem", this.gameId, index, parseInt(this.myId));
                }
            }
        });
    }

    updateScoreUI() {
        const p1Id = String(this.player1.userId);
        const p2Id = String(this.player2.userId);

        const collected = Object.values(this.scores).reduce((a,b)=>a+b,0);

        this.scoreText.text = `CANDIES: ${collected} / ${this.totalCandies}`;
        this.playerScoreDisplay.text = `${this.player1.username.toUpperCase()}: ${this.scores[p1Id]}  |  ${this.player2.username.toUpperCase()}: ${this.scores[p2Id]}`;
    }

    setupSignalREvents() {
        // pokreti drugog igraca
        connection.on("PlayerMoved", (playerId, x, y) => {
            const id = String(playerId);
            if (this.players[id] && id !== this.myId) {
                this.players[id].x = x;
                this.players[id].y = y;
            }
        });

        // pokupi candy
        connection.on("ItemPicked", (index, userId) => {
            if (!this.items[index]) return;
            this.items[index].visible = false;
            const id = String(userId);
            if (this.scores[id] !== undefined) {
                this.scores[id]++;
                this.updateScoreUI();
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
        connection.off("PlayerMoved");
        connection.off("ItemPicked");
        this.container.destroy({ children: true });
    }
}