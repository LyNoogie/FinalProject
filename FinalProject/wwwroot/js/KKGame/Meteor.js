class Meteor extends PIXI.Graphics
{
    #row = -1;

    constructor(radius) {
        super();
        let color = 0x000000;
        this.radius = radius;
        this.draw_self(radius, color);
        this.add_image();

    }

    draw_self(radius, color) {
        this.lineStyle(1, color);
        this.beginFill(color);
        this.drawCircle(0, 0, radius);
        this.endFill();
    }

    add_image() {
        this.image = PIXI.Sprite.from('Resources/meteor.png');

        this.image.scale.x = this.radius / (this.image.width / 2);
        this.image.scale.y = this.radius / (this.image.height / 2);
        this.image.x = -this.image.width / 2;
        this.image.y = -this.image.height / 2;
        // make the image "radius" pixels across (our default size)

        this.addChild(this.image);
    }

    animate_falling() {
        this.y += 5;

        if (this.y >= (this.#row - 1) * 50 + 50 + ((this.#row)* game_controller.row_spacing))
        {
            app.ticker.remove(this.animate_falling, this);
        }
    }

    begin_fall_animation(row) {
        if (row < 1 || row > 6) {
            alert("error");
            return;
        }

        this.#row = row;
        app.ticker.add(this.animate_falling, this);
    }
}