const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("tatu", "images/tatu.jpg");
loadSprite("tue", "images/tue.jpg");
loadSprite("nerd", "images/favicon-32x32.png");
loadSprite("menor", "images/menor.jpeg");
scene("game", () => {


    // define gravity
    setGravity(1600);
    setBackground(127, 200, 255 );

    add([
        pos(100, 24),
        text("Tente não pegar ela Tue, ela só tem 15 anos!!!", {
            size: 48, // 48 pixels tall
            width: 3200, // it'll wrap to next line when width exceeds this value
            font: "sans-serif", // specify any font you loaded or browser built-in
        }),
    ])

    // add a game object to screen
    const player = add([
        // list of components
        sprite("tue"),
        pos(80, 40),
        area(),
        body(),
    ]);

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(0, 100, 0),
    ]);

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

    function spawnTree() {

        // add tree obj
        add([
            sprite("menor"),
            // rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            move(LEFT, SPEED),
            body({isStatic: false}),
            "menor",
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(1, 2), spawnTree);

    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("menor", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

});

scene("lose", (score) => {

    add([
        sprite("nerd"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    // display score
    add([
        text(`tue pegou ${score} anos de cadeia`),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

go("game");
