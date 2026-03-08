import * as PIXI from "pixi.js";
import { connection } from "../services/connection.js";

export class GameScene {

    constructor(app, gameData) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.gameId = gameData.GameId;

        // Player info
        this.player1 = gameData.Player1; // Host
        this.player2 = gameData.Player2; // Guest

        this.players = {}; // {userId: PIXI.Graphics}

        // Grid settings
        this.gridSize = 50;
        this.gridWidth = 10;
        this.gridHeight = 10;

        // Item container
        this.itemsContainer = new PIXI.Container();
        this.container.addChild(this.itemsContainer);

        // Player container
        this.playersContainer = new PIXI.Container();
        this.container.addChild(this.playersContainer);

        // Create maze, spawn players & items
        this.createMaze();
        this.spawnPlayers();
        this.spawnItems();

        // Setup controls and SignalR
        this.keys = {};
        this.setupKeyboardControls();
        this.setupSignalREvents();
    }

    createMaze() {
        const mazeGraphics = new PIXI.Graphics();
        mazeGraphics.lineStyle(2, 0xffffff, 0.3);

        for (let i = 0; i <= this.gridWidth; i++) {
            mazeGraphics.moveTo(i * this.gridSize, 0);
            mazeGraphics.lineTo(i * this.gridSize, this.gridHeight * this.gridSize);
        }
        for (let j = 0; j <= this.gridHeight; j++) {
            mazeGraphics.moveTo(0, j * this.gridSize);
            mazeGraphics.lineTo(this.gridWidth * this.gridSize, j * this.gridSize);
        }

        this.container.addChild(mazeGraphics);
    }

    spawnPlayers() {
        // Host - player1
        const p1 = new PIXI.Graphics();
        p1.beginFill(0x38bdf8);
        p1.drawCircle(0, 0, 20);
        p1.endFill();
        p1.x = this.gridSize / 2;
        p1.y = this.gridSize / 2;
        this.playersContainer.addChild(p1);
        this.players[this.player1.UserId] = p1;

        // Guest - player2
        const p2 = new PIXI.Graphics();
        p2.beginFill(0xf43f5e);
        p2.drawCircle(0, 0, 20);
        p2.endFill();
        p2.x = this.gridSize / 2;
        p2.y = this.gridSize / 2 + this.gridSize * (this.gridHeight - 1);
        this.playersContainer.addChild(p2);
        this.players[this.player2.UserId] = p2;
    }

    spawnItems() {
        // Random items on grid
        this.items = [];
        for (let i = 0; i < 5; i++) {
            const item = new PIXI.Graphics();
            item.beginFill(0xfff000);
            item.drawRect(0, 0, 20, 20);
            item.endFill();

            const gridX = Math.floor(Math.random() * this.gridWidth);
            const gridY = Math.floor(Math.random() * this.gridHeight);

            item.x = gridX * this.gridSize + this.gridSize / 2 - 10;
            item.y = gridY * this.gridSize + this.gridSize / 2 - 10;

            this.itemsContainer.addChild(item);
            this.items.push(item);
        }
    }

    setupKeyboardControls() {
        window.addEventListener("keydown", (e) => this.keys[e.code] = true);
        window.addEventListener("keyup", (e) => this.keys[e.code] = false);

        this.app.ticker.add(() => this.update());
    }

    setupSignalREvents() {
        if (!connection) return;

        // Kada drugi igrač pomeri svoju poziciju
        connection.on("PlayerMoved", (playerId, x, y) => {
            const p = this.players[playerId];
            if (p) {
                p.x = x;
                p.y = y;
            }
        });

        // Kada se pokupi item
        connection.on("ItemPicked", (itemIndex) => {
            const item = this.items[itemIndex];
            if (item) item.visible = false;
        });
    }

    update() {
        const speed = 5;
        const p1 = this.players[this.player1.UserId];
        let moved = false;

        // Player1 movement
        if (this.keys["ArrowUp"]) { p1.y -= speed; moved = true; }
        if (this.keys["ArrowDown"]) { p1.y += speed; moved = true; }
        if (this.keys["ArrowLeft"]) { p1.x -= speed; moved = true; }
        if (this.keys["ArrowRight"]) { p1.x += speed; moved = true; }

        // Emit movement via SignalR
        if (moved && connection) {
            connection.invoke("PlayerMove", this.gameId, this.player1.UserId, p1.x, p1.y)
                .catch(err => console.error(err));
        }

        // Check item collisions
        this.items.forEach((item, index) => {
            if (!item.visible) return;
            if (Math.abs(p1.x - item.x) < 20 && Math.abs(p1.y - item.y) < 20) {
                item.visible = false;
                if (connection) {
                    connection.invoke("PickItem", this.gameId, index)
                        .catch(err => console.error(err));
                }
            }
        });
    }
}