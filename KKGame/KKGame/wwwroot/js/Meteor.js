﻿class Meteor extends PIXI.Graphics {
    constructor(radius) {
        super();
        this.add_image();
    }

    add_image() {
        this.image = PIXI.Sprite.from('Resources/meteor.png');
        this.image.scale.x = this.radius / (this.image.width / 2);
        this.image.scale.y = this.radius / (this.image.width / 2);
        this.image.x = -this.image.width / 2;
        this.image.y = -this.image.height / 2;
        this.endFill();

        this.addChild(this.image);
    }

    begin_fall_animation() {
        app.ticker.add(this.animate_falling, this);
    }

    animate_falling() {
        this.y += 5;

        
        //app.ticker.remove(this.animate_falling, this);
    }

}