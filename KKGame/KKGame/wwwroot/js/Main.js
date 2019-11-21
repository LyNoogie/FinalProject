class Game_Controller {
    static #playing = false;

    #screen = new KK_Console();

    get column_width() { return 75; }
    get column_start() { return 25; }
    get row_spacing() { return 5; }
    get board_string() { return this.#screen.toString(); }

    constructor() {
        if (Game_Controller.#playing) {
            throw "Game in progress";
        }

        Game_Controller.#playing = true;
    }

    drop_in_column(col) {
        let meteor = new Meteor(50);
        meteor.x = this.column_start + ((col - 1) * this.column_width) + this.column_start;
        meteor.y = 10;

        meteor.scale.x = .5;
        meteor.scale.y = .5;

        meteor.begin_fall_animation();
        app.stage.addChildAt(meteor, 0);
    }

    main() {
        setup_pixi_stage(600, 400, 0xff0000);
        const loader = PIXI.Loader.shared;
        loader.add("Resources/meteor.png");
        loader.load(this.load_done.bind(this));
    }

    load_done(loader, resources) {
        this.add_play_button();
        this.add_reset_button();
    }

    add_reset_button() {
        let button = new Button({
            bg_color: 0xffffff,
            outline_color: 0xffffff,
            handler: game_controller.reset.bind(this),
            text: "Reset"
        });

        button.scale.x = .5;
        button.scale.y = .5;
        button.x = 565;
        button.y = 50;

        app.stage.addChild(button);
    }

    ajax_position_request() {
        @.ajax({
            url: "Home/GetMove",
            type: "GET",
            data: "board=" + game_controller.board_string
        })
            .done(function (data) {
                game_controller.drop_in_column(data);
            })
            .fail(function (data) {

            });
    }

    add_play_button() {
        let button = new Button({
            bg_color: 0xffffff,
            outline_color: 0xffffff,
            handler: this.ajax_position_request,
            text: "Play"
        });
        button.scale.x = .5;
        button.scale.y = .5;
        button.x = 565;
        button.y = 50;

        app.stage.addChild(button);
    }

}