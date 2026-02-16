import { Popup } from "../ui/popup.js";
import { app } from "../App.js";

export const GameRequestManager = {

    receive(username) {
        const popup = new Popup("Game invite from " + username);
        app.stage.addChild(popup.container);
    }
};