﻿class Meteor extends PIXI.Graphics {
    constructor(radius, word) {
        super();
        this.radius = radius;
        this.word = word;
        this.add_image();
        this.ticker = new PIXI.Ticker();
    }

    add_image() {
        this.image = PIXI.Sprite.from('Resources/meteor2.png');
        this.image.scale.x = this.radius / (this.image.width / 2);
        this.image.scale.y = this.radius / (this.image.height / 2);
        this.image.x = -this.image.width / 2;
        this.image.y = -this.image.height / 2;

        this.image.direction = Math.random() * 2;
        this.image.speed = 2;
        //this.endFill();
        this.addChild(this.image);

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 30,
            fontWeight: 'bold',
            fill: ['#ff0000', '#ff4500'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });

        var text_sprite = new PIXI.Text(this.word, style);
        text_sprite.position.x = -10;
        text_sprite.position.y = 0.5;
        //text_sprite.x = -text_sprite.width / 2;
        //text_sprite.y = text_sprite.height / 2 - 5;
        this.addChild(text_sprite);
    }

    begin_fall_animation() {
        this.ticker.add(this.animate_falling, this);
        this.ticker.start()
    }

    animate_falling() {
        if (this.y >= (app.screen.height - (this.height / 2))) {
            game_controller.lost_life(this);
            app.stage.removeChild(this.image);
            this.ticker.stop();
        }
        this.y += 1;
    }

}