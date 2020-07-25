function tetrisGame(sketch) {
    sketch.colors = {};
    for (const color in colors) {
        sketch.colors[color] = colors[color];
    }
    sketch.colors = {
        BLACK: sketch.color(colors.BLACK),
        BLUE: sketch.color(colors.BLUE),
        GREEN: sketch.color(colors.GREEN),
        YELLOW: sketch.color(colors.YELLOW),
        ORANGE: sketch.color(colors.ORANGE),
        RED: sketch.color(colors.RED),
    }

    sketch.setup = function () {
        sketch.createCanvas(400, 800);
        sketch.tetris = new Tetris(0, 0, sketch);
    };

    sketch.draw = function () {
        sketch.tetris.draw();
    };

    sketch.keyPressed = function () {
        sketch.tetris.keyPressed();
    };

    sketch.keyReleased = function() {
        sketch.tetris.keyReleased();
    };
}

let p5Sketch = new p5(tetrisGame)