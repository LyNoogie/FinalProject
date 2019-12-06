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