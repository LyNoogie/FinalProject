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

    catch_word(word) {
        alert(word);
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

        let score = 0;
        let scoreText = new PIXI.Text('Score: 0');

        app.stage.addChild(scoreText);

        let setScore = value => {
            score = value;
            scoreText.text = ('Score: ' + score);
        };
        scoreText.x = app.screen.width - (scoreText.width+40);
        setScore(300);
    }


    reset() {
        // WARNING: this code relies on the fact that checkers are
        //          placed at beginning of children array of stage
        //          (farthest from viewer).
        let sprite = app.stage.getChildAt(0);
        while (sprite instanceof Meteor) {
            app.stage.removeChild(sprite);
            sprite = app.stage.getChildAt(0);
        }

        this.#screen.reset();

    }

    add_reset_button() {
        let button = new Button({
            bg_color: 0xffffff,
            outline_color: 0x000000,
            handler: game_controller.reset.bind(this),
            text: "Reset"
        });

        button.scale.x = .5;
        button.scale.y = .5;
        button.x = 565;
        button.y = 50;

        app.stage.addChild(button);
    }

    ajax_move_request() {
        $.ajax({
            url: "Home/GetPosition",
            type: "GET",
            data: "board=" + game_controller.board_string
        })
            .done(function (data) {
                console.log(data);
                game_controller.drop_in_column(data);
            })
            .fail(function (data) {
                console.log("didn't work!");
            });
    }

    add_play_button() {
        let button = new Button({
            bg_color: 0xffffff,
            outline_color: 0x000000,
            handler: this.ajax_move_request,
            text: "Play"
        });

        button.scale.x = .5;
        button.scale.y = .5;
        button.x = 565;
        button.y = 150;

        app.stage.addChild(button);

    }
    

}