﻿class Game_Controller {
    static #playing = false;
    meteors = [];
    dinos = [];
    username = "";

    #screen = new KK_Console();

    get column_width() { return 75; }
    get column_start() { return 25; }
    get row_spacing() { return 5; }
    get board_string() { return this.#screen.toString(); }

    constructor() {
        if (Game_Controller.#playing) {
            throw "Game in progress";
        }
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
        this.meteors.push(meteor);
        app.stage.addChild(meteor);
    }

    start_playing() {
        if (this.nickname_input.text !== "") {
            console.log(Game_Controller.#playing);
            if (Game_Controller.#playing === false) {
                Game_Controller.#playing = true;
                
                this.username = this.nickname_input.text;
                app.stage.removeChild(this.graphics);

                // Setup dropping of meteors
                setInterval(this.get_col, 2000);

                // Focus the user textbox
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
        }
        //this.button.event_handler = null;

    }

    get_col() {
        var col = null;
        game_controller.ajax_move_request(function (output) {
            col = output;
        });

        game_controller.drop_in_column(col);
    }

    lose_life(meteor) {
        for (var i = 0; i < this.meteors.length; i++) {
            if (meteor === this.meteors[i]) {
                app.stage.removeChild(this.meteors[i]);
                this.meteors.splice(i, 1);
            }
        }
        if (this.dinos.length > 0) {
            let rmDino = this.dinos.pop();
            app.stage.removeChild(rmDino);

        }
        else {
            this.end_game();
        }
    }

    end_game() {
        Game_Controller.#playing = false;

        this.gameover_popup = new PIXI.Graphics();
        this.gameover_popup.beginFill(0x000000);

        // draw a rectangle
        this.gameover_popup.drawRect(0, 0, 480, 250);
        this.gameover_popup.x = (app.screen.width - this.gameover_popup.width) / 2;
        this.gameover_popup.y = 70;

        app.stage.addChild(this.gameover_popup);
        var gameover = new PIXI.Text('GAME OVER', {
            fill: '#ff4500',
            fontWeight: 'bold',
        });
        gameover.style.fontSize = 25;
        gameover.x = (this.gameover_popup.width - gameover.width) / 2;
        this.gameover_popup.addChild(gameover);
        app.stage.addChild(this.gameover_popup);
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
        
        //this.add_play_button();
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
        this.popup_instructions();
    }

    popup_instructions() {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xFFCC00);

        // draw a rectangle
        this.graphics.drawRect(0, 0, 480, 250);
        this.graphics.x = (app.screen.width - this.graphics.width) / 2;
        this.graphics.y = 70;

        var instructions = new PIXI.Text('Welcome to Keyranasaurus Text, a game to test your typing \nabilities. ' 
            + 'Type the words correctly to destroy the falling meteors in \norder to save your dinosaur friends. You can choose '
            + ' to destroy \nall the meteors on the screen if you have accumulated 50 points. \nBeware, this comes at a price of 50'
            + ' points, so choose wisely. \n\nThe next meteor that hits after all'
            + ' dinosaurs have gone extict will \nend your life, so have fun and be careful!', {
            fill: '#ff4500',
            fontWeight: 'bold',
        });
        instructions.style.fontSize = 15;
        this.graphics.addChild(instructions);
        app.stage.addChild(this.graphics);
        
        var name_text = new PIXI.Text('Enter your name: ', {
            fill: '#ff4500',
            fontWeight: 'bold',
        });
        name_text.style.fontSize = 18;
        name_text.position.x = 40;
        name_text.y = 153;
        this.graphics.addChild(name_text);

        this.nickname_input = new PixiTextInput();
        this.nickname_input.position.x = 200;
        this.nickname_input.position.y = 150;
        this.nickname_input.width = 200;
        this.nickname_input.text = "";
        this.graphics.addChild(this.nickname_input);

        var play_btn = new Button({
            bg_color: 0xffffff,
            outline_color: 0x000000,
            handler: game_controller.start_playing.bind(this),
            text: "Play"
        });
        play_btn.scale.x = .60;
        play_btn.scale.y = .60;
        play_btn.x = 240;
        play_btn.y = 210;
        this.graphics.addChild(play_btn);
        
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

    clear() {
        if (this.score >= 50) {
            this.score -= 50;
            this.update_score();
            let sprite = app.stage.getChildAt(0);
            this.meteors.forEach(element => app.stage.removeChild(element));
            this.meteors.clear;
        }
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