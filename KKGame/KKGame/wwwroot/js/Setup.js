var app = null;

/**
 *  Create PIXI stage with background image
 *  @param {int} width  - how wide the stage
 *  @param {int} height - how high the stage
 *  @param {int} bg_color - background color of the stage
 *
 */
function setup_pixi_stage(width, height) {
    app = new PIXI.Application();
    app.renderer.resize(width, height);

    const background = PIXI.Sprite.from('Resources/background.jpg');
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    $("#canvas_div").append(app.view);
}