import * as PIXI from "pixi.js";

export class Button {
    constructor(text, x, y, onClick) {
        this.container = new PIXI.Container();
        this.container.eventMode = "static"; 
        this.container.cursor = "pointer";

        const bg = new PIXI.Graphics();
        bg.beginFill(0x00aa00);
        bg.drawRect(0, 0, 150, 40);
        bg.endFill();

        const label = new PIXI.Text(text, { fill: 0xffffff, fontSize: 16 });
        label.x = 10;
        label.y = 10;

        this.container.addChild(bg);
        this.container.addChild(label);

        this.container.x = x;
        this.container.y = y;

        this.container.on("pointerdown", onClick);
    }
}
