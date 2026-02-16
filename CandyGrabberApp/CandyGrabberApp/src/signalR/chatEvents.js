import { connection } from "./connection.js";
import { MessageManager } from "../managers/messageManager.js";
import { FriendRequestManager } from "../managers/friendRequestManager.js";
import { GameRequestManager } from "../managers/gameRequestManager.js";

export function registerSignalREvents() {

    connection.on("ReceiveMessage", (sender, message) => {
        MessageManager.receive(sender, message);
    });

    connection.on("FriendRequestSent", (username) => {
        FriendRequestManager.receive(username);
    });

    connection.on("ReceiveGameInvite", (username) => {
        GameRequestManager.receive(username);
    });
}