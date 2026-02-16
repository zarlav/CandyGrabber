import * as PIXI from "pixi.js";

export class Button {

    constructor(text, x, y, onClick) {
        this.container = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x00aa00);
        bg.drawRect(0, 0, 200, 50);
        bg.endFill();

        const label = new PIXI.Text(text, { fill: 0xffffff });
        label.x = 20;
        label.y = 15;

        this.container.addChild(bg);
        this.container.addChild(label);

        this.container.x = x;
        this.container.y = y;

        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on("pointerdown", onClick);
    }
}
