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
 *    Dinosaur class handles visuals of a dinosaur instance
 */
class Dinosaur extends PIXI.Graphics {
    constructor() {
        super();
        this.add_image();
    }

    add_image() {
        this.image = PIXI.Sprite.from('Resources/dinosaur.png');
        this.image.scale.x = (this.image.width / 200);
        this.image.scale.y = (this.image.height / 200);
        this.image.x = -this.image.width / 2;
        this.image.y = -this.image.height / 2;

        this.addChild(this.image);
    }
}