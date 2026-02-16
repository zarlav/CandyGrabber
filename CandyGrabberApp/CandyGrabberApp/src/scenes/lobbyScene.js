import * as PIXI from "pixi.js";
import { Button } from "../ui/button.js";
import { connection } from "../signalR/connection.js";

export class LobbyScene {

    constructor() {
        this.container = new PIXI.Container();
        this.createUI();
    }

    createUI() {

        const title = new PIXI.Text("SignalR Demo Lobby", { fill: 0xffffff });
        title.x = 300;
        title.y = 20;
        this.container.addChild(title);

        const messageBtn = new Button(
            "Send Message",
            50,
            100,
            () => connection.invoke("SendMessage", window.currentUser, "Hello from Pixi!")
        );

        const friendBtn = new Button(
            "Send Friend Request",
            50,
            180,
            () => {
                const friend = prompt("Friend username:");
                connection.invoke("SendFriendRequest", window.currentUser, friend);
            }
        );

        const gameBtn = new Button(
            "Send Game Invite",
            50,
            260,
            () => {
                const friend = prompt("Friend username:");
                connection.invoke("SendGameInviteToUser", window.currentUser, friend, {
                    senderId: 1,
                    recipientId: 2
                });
            }
        );

        this.container.addChild(messageBtn.container);
        this.container.addChild(friendBtn.container);
        this.container.addChild(gameBtn.container);
    }
}
