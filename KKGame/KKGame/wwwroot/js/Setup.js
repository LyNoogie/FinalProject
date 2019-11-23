var app = null;

/**
 *  Create PIXI stage
 *  @param {int} width  - how wide the stage
 *  @param {int} height - how high the stage
 *  @param {int} bg_color - background color of the stage
 *
 */
function setup_pixi_stage(width, height, bg_color) {
    app = new PIXI.Application({ backgroundColor: bg_color });
    app.renderer.resize(width, height);
    $("#canvas_div").append(app.view);
}