import * as PIXI from "pixi.js";

export class GameScene{

constructor(app,game){

this.app = app;
this.game = game;

this.container = new PIXI.Container();
this.app.stage.addChild(this.container);

this.players = {};

this.createMaze();
this.spawnPlayers();

}

createMaze(){

for(let y=0;y<10;y++){
for(let x=0;x<10;x++){

const tile = new PIXI.Graphics();

tile.beginFill(Math.random()>0.7 ? 0x333333 : 0x888888);
tile.drawRect(0,0,40,40);
tile.endFill();

tile.x = x*40;
tile.y = y*40;

this.container.addChild(tile);

}
}

}

spawnPlayers(){

const p1 = new PIXI.Graphics();
p1.beginFill(0xff0000);
p1.drawCircle(0,0,15);
p1.endFill();

p1.x = 50;
p1.y = 50;

this.container.addChild(p1);

const p2 = new PIXI.Graphics();
p2.beginFill(0x00ff00);
p2.drawCircle(0,0,15);
p2.endFill();

p2.x = 350;
p2.y = 350;

this.container.addChild(p2);

}

}