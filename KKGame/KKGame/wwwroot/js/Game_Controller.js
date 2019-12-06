﻿class Game_Controller {
    static #playing = false;
    meteors = [];
    dinos = [];

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
        this.input.focus();

        //Capture the keyboard arrow keys
        let enter = this.keyboard("Enter");
        enter.press = () => {
            this.match_words();
        };
        enter.release = () => {
            this.input.focus();
        }

        let backspace = this.keyboard("Backspace");
        backspace.press = () => {
            //this.input.text = this.input.text.slice(0, -1);
            this.input.text = "";
        }
        backspace.release = () => {
            this.input.focus();
        }
    }

    get_col() {
        var col = null;
        game_controller.ajax_move_request(function (output) {
            col = output;
        });

        game_controller.drop_in_column(col);
    }

    lost_life(meteor) {
        console.log("Called lost_life!");
        for (var i = 0; i < this.meteors.length; i++) {
            if (meteor === this.meteors[i]) {
                app.stage.removeChild(this.meteors[i]);
                this.meteors.splice(i, 1);
            }
        }
        if (this.dinos.length > 0) {
            let rmDino = this.dinos.pop();
            app.stage.removeChild(rmDino);

            if (this.dinos.length === 0) {
                app.ticker.stop();
                alert("Game over!");
            }
        }
        else {
            alert("Game over!");
        }
    }

    main() {
        setup_pixi_stage(600, 400);
        const loader = PIXI.Loader.shared;
        loader.add("Resources/meteor2.png");
        loader.add("Resources/dinosaur.png");
        loader.load(this.load_done.bind(this));
    }

    match_words() {
        for (var i = 0; i < this.meteors.length; i++) {
            if (this.meteors[i].word === this.input.text) {
                this.meteors[i].ticker.stop();
                app.stage.removeChild(this.meteors[i]);
                this.meteors.splice(i, 1);
                this.score += this.input.text.length;
                this.update_score();
                this.input.text = "";
            }
        }
        return true;
    }

    load_done(loader, resources) {
        this.add_play_button();
        this.wipe_screen();

        this.score = 0;
        this.scoreText = new PIXI.Text('Score: 0', {
            fill: '#ff4500',
            fontWeight: 'bold',
        });

        app.stage.addChild(this.scoreText);

        let setScore = value => {
            this.score = value;
            this.scoreText.text = ('Score: ' + this.score);
        };
        this.scoreText.x = app.screen.width - (this.scoreText.width+40);
        setScore(0);

        this.input = new PixiTextInput();
        this.input.position.x = 150;
        this.input.position.y = 350;
        this.input.width = 250;
        this.input.text = "";
        app.stage.addChild(this.input);

        let dino = new Dinosaur();
        dino.x = app.screen.width - 50;
        dino.y = app.screen.height - 50;
        dino.scale.x = .04;
        dino.scale.y = .04;
        this.dinos.push(dino);
        app.stage.addChild(dino);

        let dino2 = new Dinosaur();
        dino2.x = app.screen.width - 150;
        dino2.y = app.screen.height - 50;
        dino2.scale.x = .04;
        dino2.scale.y = .04;
        this.dinos.push(dino2);
        app.stage.addChild(dino2);

        let dino3 = new Dinosaur();
        dino3.x = 80;
        dino3.y = app.screen.height - 50;
        dino3.scale.x = .04;
        dino3.scale.y = .04;
        this.dinos.push(dino3);
        app.stage.addChild(dino3);
    }

    update_score() {
        this.scoreText.text = ('Score: ' + this.score);
    }

    keyboard(value) {
        let key = {};
        key.value = value;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = event => {
            if (event.key === key.value) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };

        //The `upHandler`
        key.upHandler = event => {
            if (event.key === key.value) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }   
        };

        //Attach event listeners
        const downListener = key.downHandler.bind(key);
        const upListener = key.upHandler.bind(key);

        window.addEventListener(
            "keydown", downListener, false
        );
        window.addEventListener(
            "keyup", upListener, false
        );

        // Detach event listeners
        key.unsubscribe = () => {
            window.removeEventListener("keydown", downListener);
            window.removeEventListener("keyup", upListener);
        };

        return key;
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
            handler: game_controller.start_playing.bind(this),
            text: "Play"
        });

        this.button.scale.x = .5;
        this.button.scale.y = .5;
        this.button.x = 550;
        this.button.y = 100;

        app.stage.addChild(this.button);

    }

    clear() {
        if (this.score >= 50) {
            this.score -= 50;
            this.update_score();
            let sprite = app.stage.getChildAt(0);
            this.meteors.forEach(element => app.stage.removeChild(element));
            this.meteors.clear;
        }
        //while (sprite instanceof Meteor) {
        //    app.stage.removeChild(sprite);
        //    sprite = app.stage.getChildAt(0);
        //}
    }

    wipe_screen() {
        this.button = new Button({
            bg_color: 0xffffff,
            outline_color: 0x000000,
            handler: game_controller.clear.bind(this),
            text: "Clear"
        });
        this.button.scale.x = .5;
        this.button.scale.y = .5;
        this.button.x = 550;
        this.button.y = 150;

        app.stage.addChild(this.button)

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