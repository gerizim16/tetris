function tetrisGame(sketch) {
    sketch.colors = {
        BLACK: sketch.color(colors.BLACK),
        BLUE: sketch.color(colors.BLUE),
        GREEN: sketch.color(colors.GREEN),
        YELLOW: sketch.color(colors.YELLOW),
        ORANGE: sketch.color(colors.ORANGE),
        RED: sketch.color(colors.RED),
    }

    sketch.setup = function () {
        sketch.createCanvas(700, 800);
        sketch.tetris = new Tetris(0, 0, sketch);
    };

    sketch.draw = function () {
        sketch.tetris.draw();
    };

    sketch.keyPressed = function () {
        sketch.tetris.keyPressed();
    };

    sketch.keyReleased = function () {
        sketch.tetris.keyReleased();
    };
}

let p5Sketch = new p5(tetrisGame, 'gameContainer');

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);