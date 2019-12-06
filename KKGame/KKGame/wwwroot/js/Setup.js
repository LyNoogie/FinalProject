var app = null;

/**
 *  Create PIXI stage
 *  @param {int} width  - how wide the stage
 *  @param {int} height - how high the stage
 *  @param {int} bg_color - background color of the stage
 *
 */
function setup_pixi_stage(width, height) {
    //app = new PIXI.Application({ backgroundColor: 0x000000 });
    app = new PIXI.Application();
    //document.body.appendChild(app.view);
    app.renderer.resize(width, height);

    const background = PIXI.Sprite.from('Resources/background.jpg');
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    $("#canvas_div").append(app.view);
}