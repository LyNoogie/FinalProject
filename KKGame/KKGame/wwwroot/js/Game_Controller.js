/**
 * Author:    Khanhly Nguyen
 * Partner:   Kaelin Hoang
 * Date:      November 10, 2019
 * Course:    CS 4540, University of Utah, School of Computing
 * Copyright: CS 4540 and Khanhly Nguyen and Kaelin Hoang - This work may not be copied for use in Academic Coursework.
 *
 * We, Khanhly Nguyen and Kaelin Hoang, certify that we wrote this code from scratch and did not copy it in part or whole from
 * another source.  Any references used in the completion of the assignment are cited in my README file.
 *
 * File Contents
 *
 * This file contains the creation of the game along with most of the logic. It sets up a game and calls the database whenever needed.
 * It generated meteors throughout the game and will retrieve words from the database through querying and this gets called consistently
 * via TICKERs. Meteors calculate where to fall so they don't overlap each other in awkward manners. It also listens for 
 * when the game ends and when to start and setup the game.
 */

class Game_Controller {
    static #playing = false;
    meteors = [];
    dinos = [];
    username = "";
    is_done = false;

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

    // Sets up the background and PIXI stage
    main() {
        setup_pixi_stage(600, 400);
        const loader = PIXI.Loader.shared;
        loader.add("Resources/meteor2.png");
        loader.add("Resources/dinosaur.png");
        loader.load(this.load_done.bind(this));
    }

    // Game setup before ability to play
    load_done(loader, resources) {
        // Make a button to clear screen
        this.wipe_screen();

        // Score text
        this.score = 0;
        this.scoreText = new PIXI.Text('Score: 0', {
            fill: '#ff4500',
            fontWeight: 'bold',
        });

        app.stage.addChild(this.scoreText);

        // Updates score
        let setScore = value => {
            this.score = value;
            this.scoreText.text = ('Score: ' + this.score);
        };
        this.scoreText.x = app.screen.width - (this.scoreText.width + 40);
        setScore(0);

        // Create a text box for user to type word in
        this.input = new PixiTextInput();
        this.input.position.x = 150;
        this.input.position.y = 350;
        this.input.width = 250;
        this.input.text = "";
        app.stage.addChild(this.input);

        // Dinosaur/life creation
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

        // Display instructions as forefront
        this.popup_instructions();
    }

    // Ensures that a name is provided and then starts the game
    start_playing() {
        if (this.nickname_input.text !== "") {
            // Mark game in progress
            if (Game_Controller.#playing === false) {
                Game_Controller.#playing = true;

                // Saves provided username for later display/database integration
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

                // Reimplementation of backspace
                let backspace = this.keyboard("Backspace");
                backspace.press = () => {
                    //this.input.text = this.input.text.slice(0, -1);
                    this.input.text = "";
                }
                backspace.release = () => {
                    // Refocuses the text box
                    this.input.focus();
                }
            }
        }
    }

    // Dynamically creates meteors to begin falling
    drop_in_column(col) {
        var word = null;

        // Request a word from database
        this.ajax_word_request(function (output) {
            word = output;
        });

        let meteor = new Meteor(50, word);
        meteor.x = this.column_start + ((col - 1) * this.column_width) + this.column_start;
        meteor.y = 10;

        meteor.scale.x = .5;
        meteor.scale.y = .5;

        meteor.begin_fall_animation();
        // Add to list to keep track of
        this.meteors.push(meteor);
        app.stage.addChild(meteor);
    }

    // Calculates where meteors should fall
    get_col() {
        var col = null;
        game_controller.ajax_move_request(function (output) {
            col = output;
        });

        game_controller.drop_in_column(col);
    }

    // Decrament life and remove meteor
    lose_life(meteor) {
        // Remove the correct meteor that caused a life to be lost
        for (var i = 0; i < this.meteors.length; i++) {
            if (meteor === this.meteors[i]) {
                app.stage.removeChild(this.meteors[i]);
                this.meteors.splice(i, 1);
            }
        }
        // There are still lives, keep playing game
        if (this.dinos.length > 0) {
            let rmDino = this.dinos.pop();
            app.stage.removeChild(rmDino);
        }
        // All lives lost, end game
        else {
            this.end_game();
            this.is_done = true;
        }
    }

    // Stops game
    end_game() {
        Game_Controller.#playing = false;
        
        this.is_done = false;

        this.gameover_popup = new PIXI.Graphics();
        this.gameover_popup.beginFill(0x000000);

        // draw a rectangle
        this.gameover_popup.drawRect(0, 0, 480, 250);
        this.gameover_popup.x = (app.screen.width - this.gameover_popup.width) / 2;
        this.gameover_popup.y = 70;

        app.stage.addChild(this.gameover_popup);

        // Shows name and score
        var done_text = "\t GAME OVER \n\n\n" + this.username + ", your score was " + this.score;
        var gameover = new PIXI.Text(done_text, {
            fill: '#ff4500',
            fontWeight: 'bold',
        });
        gameover.style.fontSize = 25;
        gameover.x = (this.gameover_popup.width - gameover.width) / 2;
        this.gameover_popup.addChild(gameover);
        app.stage.addChild(this.gameover_popup);


            // Send user's score ------------ LEFT IN FOR DEMO PURPOSES AND GRADING -------------------
            //this.ajax_save_score();

            //// Get all high scores
            //var all_scores = {};
            //this.ajax_get_scores(function (output) {
            //    all_scores = output;
            //    for (var key in all_scores) {
            //        console.log(key + ": " + all_scores[key]);
            //    }
            //});
        

        

        // Display all high scores


        //app.ticker.stop();
    }

    // Function to match words to meteors
    match_words() {
        // loop through all meteors to find first match
        for (var i = 0; i < this.meteors.length; i++) {
            if (this.meteors[i].word === this.input.text) {
                this.meteors[i].ticker.stop();

                // found the match, remove
                app.stage.removeChild(this.meteors[i]);
                this.meteors.splice(i, 1);

                // update score and reset the text
                this.score += this.input.text.length;
                this.update_score();
                this.input.text = "";
            }
        }
        return true;
    }

    // Display instructions to user
    popup_instructions() {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xFFCC00);

        // draw a rectangle
        this.graphics.drawRect(0, 0, 480, 250);
        this.graphics.x = (app.screen.width - this.graphics.width) / 2;
        this.graphics.y = 70;

        // instructin text
        var instructions = new PIXI.Text('Welcome to Keyrannosaurus Text, a game to test your typing \nabilities. ' 
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

        // Create a text box for user to enter their name
        this.nickname_input = new PixiTextInput();
        this.nickname_input.position.x = 200;
        this.nickname_input.position.y = 150;
        this.nickname_input.width = 200;
        this.nickname_input.text = "";
        this.graphics.addChild(this.nickname_input);

        // Create a button for the user to click after a name is supplied
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

    // Updates score label
    update_score() {
        this.scoreText.text = ('Score: ' + this.score);
    }

    // Create a keyboard listener
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

    // Request a move from database
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

    // Clear the screen if the user has enough points and decrament score
    clear() {
        if (this.score >= 50) {
            this.score -= 50;
            this.update_score();
            let sprite = app.stage.getChildAt(0);
            this.meteors.forEach(element => app.stage.removeChild(element));
            this.meteors.clear;
        }
    }

    // Create a clear screen button
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

    // Calls database for a word
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

    // Calls database for list of high scores
    ajax_get_scores(handleData) {
        $.ajax({
            async: false,
            url: "HighScores/GetHighScores",
            type: "GET",
            data: "game",
            success: function (data) {
                handleData(data);
            }
        });
    }

    // Updates database to save current user and their score
    ajax_save_score() {
        $.ajax({
            async: false,
            url: "HighScores/InsertScore",
            type: "POST",
            data: { username: game_controller.username, score: game_controller.score },
        });
    }
}