class Button extends PIXI.Graphics {

    // action to take when clicked. 
    event_handler = null;

    constructor({ bg_color = 0xffffff, outline_color = 0x000000, text = null }) {
        super();

        this.interactive = true;
        this.buttonMode = true;

        this.bg_color = bg_color;
        this.outline_color = outline_color;

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
        game_controller.start_playing();
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