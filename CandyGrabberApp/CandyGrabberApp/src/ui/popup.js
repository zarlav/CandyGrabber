import * as PIXI from "pixi.js";

export class Popup {

    constructor(text) {
        this.container = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0xaa0000);
        bg.drawRect(0, 0, 400, 100);
        bg.endFill();

        const label = new PIXI.Text(text, { fill: 0xffffff });
        label.x = 20;
        label.y = 40;

        this.container.addChild(bg);
        this.container.addChild(label);

        this.container.x = 250;
        this.container.y = 200;
    }
}
