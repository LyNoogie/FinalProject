/**
 * Author:    Kaelin Hoang
 * Partner:   Khanhly Nguyen
 * Date:      12/4/2019
 * Course:    CS 4540, University of Utah, School of Computing
 * Copyright: CS 4540 and [Your Name(s)] - This work may not be copied for use in Academic Coursework.
 *
 * I, [your name], certify that I wrote this code from scratch and did not copy it in part or whole from
 * another source.  Any references used in the completion of the assignment are cited in my README file.
 *
 * File Contents
 *
 *    Meteor class handles movement, images and actions of a meteor instance
 */
class Meteor extends PIXI.Graphics {
    constructor(radius, word) {
        super();
        this.radius = radius;
        this.word = word;

        // Create the meteor image and add to screen.
        this.add_image();
        this.ticker = new PIXI.Ticker();
    }

    /*
     * Create the image and text sprite and add those onto the stage
     */
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

        // Add the word onto the image
        var text_sprite = new PIXI.Text(this.word, style);
        text_sprite.position.x = -10;
        text_sprite.position.y = 0.5;
        this.addChild(text_sprite);
    }

    /*
     * Sets up the ticker for this meteor instance to begin the falling animation
     */ 
    begin_fall_animation() {
        this.ticker.add(this.animate_falling, this);
        this.ticker.start()
    }

    /*
     * Continuously moves the y axis of this meteor instance down. Also verifies if this meteor has touched the bottom of the screen.
     */ 
    animate_falling() {
        if (this.y >= (app.screen.height - (this.height / 2))) { // Bottom of screen (stage)
            game_controller.lose_life(this);
            this.ticker.remove(this.animate_falling, this);
        }
        this.y += 1;
    }

}