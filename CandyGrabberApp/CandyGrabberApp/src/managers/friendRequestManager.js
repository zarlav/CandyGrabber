import { Notification } from "../ui/notification.js";
import { app } from "../App.js";

export const FriendRequestManager = {

    receive(username) {
        const notif = new Notification("Friend request from " + username);
        app.stage.addChild(notif.container);
    }
};