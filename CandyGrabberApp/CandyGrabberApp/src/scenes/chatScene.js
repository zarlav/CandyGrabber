import * as PIXI from "pixi.js";
import { app } from "../App.js";

export class ChatScene {

    static addMessage(text) {
        const msg = new PIXI.Text(text, { fill: 0xffffff });
        msg.x = 500;
        msg.y = 100 + Math.random() * 300;
        app.stage.addChild(msg);
    }
}
