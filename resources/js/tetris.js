class Tetris {
    constructor(x, y, sketch) {
        this.x = x;
        this.y = y;
        this.sketch = sketch;
        this.playArea = sketch.createGraphics(350, 700);
        this.arena = new Arena(10, 20, this.playArea);
        this.player = new Player(sketch, this.playArea, this.arena);
    }

    draw() {
        this.arena.draw();
        this.player.draw();
        

        this.sketch.background(200);
        this.sketch.image(this.playArea, 25, 15);
    }

    keyPressed() {
        if (this.sketch.keyCode === 65 || this.sketch.keyCode === 37) {
            this.player.move(-1, 0);
        } else if (this.sketch.keyCode === 68 || this.sketch.keyCode === 39) {
            this.player.move(1, 0);
        }
        if (this.sketch.keyCode === 83 || this.sketch.keyCode === 40) {
            this.player.move(0, 1);
        }
        if (this.sketch.keyCode === 88 || this.sketch.keyCode === 38) {
            this.player.rotate(1);
        } else if (this.sketch.keyCode === 90 || this.sketch.keyCode === 17) {
            this.player.rotate(-1);
        }
    }

    keyReleased() {
    }
}