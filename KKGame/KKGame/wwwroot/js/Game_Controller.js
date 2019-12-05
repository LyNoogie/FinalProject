class Game_Controller {
    static #playing = false;
    meteors = [];

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
        var word = null;
        this.ajax_word_request(function (output) {
            word = output;
        });

        let meteor = new Meteor(50, word);
        meteor.x = this.column_start + ((col - 1) * this.column_width) + this.column_start;
        meteor.y = 10;

        meteor.scale.x = .5;
        meteor.scale.y = .5;

        meteor.begin_fall_animation();
        //app.stage.addChildAt(meteor, 0);
        this.meteors.push(meteor);
        app.stage.addChild(meteor);
    }

    start_playing() {
        setInterval(this.get_col, 2000);
    }

    get_col() {
        var col = null;
        game_controller.ajax_move_request(function (output) {
            col = output;
        });

        game_controller.drop_in_column(col);
    }

    main() {
        setup_pixi_stage(600, 400);
        const loader = PIXI.Loader.shared;
        loader.add("Resources/meteor2.png");
        loader.load(this.load_done.bind(this));
    }

    
    load_done(loader, resources) {
        this.add_play_button();

        let score = 0;
        let scoreText = new PIXI.Text('Score: 0', {
            fill: '#ff4500',
            fontWeight: 'bold',
        });

        app.stage.addChild(scoreText);

        let setScore = value => {
            score = value;
            scoreText.text = ('Score: ' + score);
        };
        scoreText.x = app.screen.width - (scoreText.width+40);
        setScore(300);

        var input = new PixiTextInput();
        input.position.x = 225;
        input.position.y = 350;
        input.text = 123;
        app.stage.addChild(input);

    }

    ajax_move_request(handleData) {
        $.ajax({
            async: false,
            url: "Home/GetPosition",
            type: "GET",
            data: "board=" + game_controller.board_string
        })
            .done(function (data) {
                handleData(data);
            })
            .fail(function (data) {
                console.log("didn't work!");
            });
    }

    add_play_button() {
        this.button = new Button({
            bg_color: 0xffffff,
            outline_color: 0x000000,
            text: "Play"
        });

        this.button.scale.x = .5;
        this.button.scale.y = .5;
        this.button.x = 550;
        this.button.y = 100;

        app.stage.addChild(this.button);

    }
    
    ajax_word_request(handleData) {
        $.ajax({
            async: false,
            url: "Words/GetWord",
            type: "GET",
            data: "meteor",
            success: function (data) {
                handleData(data);
            }
        });
    }
}