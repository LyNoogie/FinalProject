class Meteor extends PIXI.Graphics {
    constructor(radius) {
        super();
        this.radius = radius;
        this.add_image();
        
    }

    add_image() {
        this.image = PIXI.Sprite.from('Resources/meteor.png');
        this.image.scale.x = this.radius / (this.image.width / 2);
        this.image.scale.y = this.radius / (this.image.height / 2);
        this.image.x = -this.image.width / 2;
        this.image.y = -this.image.height / 2;
        //this.endFill();

        this.addChild(this.image);
        
        this.ajax_word_request(function (output) {
            game_controller.catch_word(output);
        });

        
    }

    begin_fall_animation() {
        app.ticker.add(this.animate_falling, this);
    }

    animate_falling() {
        this.y += 1;

        
        //app.ticker.remove(this.animate_falling, this);
    }

    add_word(text) {
        var text_sprite = new PIXI.Text(text,
            {
                font: '12px Arial',
                fill: 0x666666,
                align: 'center',
                cacheAsBitmap: true, // for better performance
                height: 57,
                width: 82
            });
        //text_sprite.x = -text_sprite.width / 2;
        //text_sprite.y = text_sprite.height / 2 - 5;
        this.image.addChild(text_sprite);
    }

    ajax_word_request(handleData) {
        $.ajax({
            url: "Words/GetWord",
            type: "GET",
            data: "meteor",
            success: function (data) {
                handleData(data);
            }
        });
    }


}