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
 *    Button class handles movement, images and events of a button instance
 */
class Button extends PIXI.Graphics {

    // action to take when clicked. 
    event_handler = null;

    constructor({ handler = null, bg_color = 0xffffff, outline_color = 0x000000, text = null }) {
        super();

        this.interactive = true;
        this.buttonMode = true;

        this.bg_color = bg_color;
        this.outline_color = outline_color;
        this.event_handler = handler;

        this.on('pointerup', this.button_click);

        this.draw_self();

        if (text !== null) {
            this.add_text(text);
        }
    }

    replace_function(func) {
        button.removeAllListeners();
        button.on('pointerup', func);
    }

    /**
     * handle a click on the checker (makes it start falling)
     */
    button_click() {
        if (this.event_handler !== null) {
            this.event_handler();
        }
    }

    /**
     * Code to draw the button
     */
    draw_self() {
        this.clear();
        this.beginFill(this.bg_color);
        this.lineStyle(4, this.outline_color);
        this.drawRoundedRect(-50, 0, 100, 50, 15);
        this.endFill();
    }

    /**
     * Place a Text Message centered on the button
     * 
     * @param {string} text - the button's text.
     */
    add_text(text) {
        let text_sprite = new PIXI.Text(text);
        text_sprite.x = -text_sprite.width / 2;
        text_sprite.y = text_sprite.height / 2 - 5;
        this.addChild(text_sprite);
    }



}