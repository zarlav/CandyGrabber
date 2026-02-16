import * as PIXI from "pixi.js";

export class Notification {

    constructor(text) {
        this.container = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x3333ff);
        bg.drawRect(0, 0, 400, 60);
        bg.endFill();

        const label = new PIXI.Text(text, { fill: 0xffffff });
        label.x = 20;
        label.y = 20;

        this.container.addChild(bg);
        this.container.addChild(label);

        this.container.x = 250;
        this.container.y = 50;

        setTimeout(() => {
            if (this.container.parent)
                this.container.parent.removeChild(this.container);
        }, 3000);
    }
}
