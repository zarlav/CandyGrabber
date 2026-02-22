import * as PIXI from "pixi.js";
import { Button } from "../ui/button.js";
import { GameRequestManager } from "../managers/gameRequestManager.js";

export class LobbyScene {
    constructor() {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;

        this.gameRequestManager = new GameRequestManager("https://localhost:7274");

        this.requestsContainer = new PIXI.Container();
        this.requestsContainer.sortableChildren = true;
        this.container.addChild(this.requestsContainer);

        this.createUI();
    }

    createUI() {
        // ===== TITLE =====
        const title = new PIXI.Text("Game Lobby", {
            fill: 0xffffff,
            fontSize: 28,
        });
        title.x = 250;
        title.y = 20;
        this.container.addChild(title);

        // ===== FORM BACKGROUND =====
        const formBg = new PIXI.Graphics();
        formBg.beginFill(0x2c3e50);
        formBg.drawRoundedRect(200, 80, 400, 250, 12);
        formBg.endFill();
        this.container.addChild(formBg);

        // ===== HTML INPUTS =====
        this.senderInput = document.createElement("input");
        this.senderInput.placeholder = "Sender ID";
        this.senderInput.type = "number";
        this.senderInput.style.position = "absolute";
        this.senderInput.style.left = "350px";
        this.senderInput.style.top = "120px";
        document.body.appendChild(this.senderInput);

        this.recipientInput = document.createElement("input");
        this.recipientInput.placeholder = "Recipient ID";
        this.recipientInput.type = "number";
        this.recipientInput.style.position = "absolute";
        this.recipientInput.style.left = "350px";
        this.recipientInput.style.top = "160px";
        document.body.appendChild(this.recipientInput);

        this.gameInput = document.createElement("input");
        this.gameInput.placeholder = "Game ID";
        this.gameInput.type = "number";
        this.gameInput.style.position = "absolute";
        this.gameInput.style.left = "350px";
        this.gameInput.style.top = "200px";
        document.body.appendChild(this.gameInput);

        // ===== SEND GAME REQUEST BUTTON =====
        const sendGameBtn = new Button(
            "Send Game Request",
            330,
            250,
            async () => {
                const request = {
                    senderId: parseInt(this.senderInput.value),
                    recipientId: parseInt(this.recipientInput.value),
                    gameId: parseInt(this.gameInput.value),
                    timestamp: new Date().toISOString(),
                };

                await this.gameRequestManager.send(request);

                alert("Game request sent!");
                await this.loadRequests(parseInt(this.recipientInput.value));
            }
        );
        this.container.addChild(sendGameBtn.container);

        // ===== LOAD REQUESTS BUTTON =====
        const loadBtn = new Button(
            "Load My Requests",
            330,
            310,
            async () => {
                await this.loadRequests(parseInt(this.recipientInput.value));
            }
        );
        this.container.addChild(loadBtn.container);
    }

    async loadRequests(recipientId) {
        if (!recipientId) return;

        console.log("Loading requests for:", recipientId);
        const requests = await this.gameRequestManager.getByRecipient(recipientId);
        console.log("Requests loaded:", requests);

        this.requestsContainer.removeChildren();

        let y = 360;

        requests.forEach(req => {
            const text = new PIXI.Text(`Request ${req.id} from ${req.senderId}`, {
                fill: 0xffffff,
            });
            text.x = 250;
            text.y = y;
            this.requestsContainer.addChild(text);

            const acceptBtn = new Button("Accept", 500, y, async () => {
                await this.gameRequestManager.accept(req.id);
                await this.loadRequests(recipientId);
            });

            const declineBtn = new Button("Decline", 600, y, async () => {
                await this.gameRequestManager.decline(req.id);
                await this.loadRequests(recipientId);
            });

            this.requestsContainer.addChild(acceptBtn.container);
            this.requestsContainer.addChild(declineBtn.container);

            y += 60; // malo veći razmak
        });
    }
}
