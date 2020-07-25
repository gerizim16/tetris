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
        this.player.update();

        this.arena.draw();
        this.player.drawShadow();
        this.player.draw();
        
        this.sketch.background(200);
        this.sketch.image(this.playArea, 25, 15);
    }

    keyPressed() {
        this.player.keyPressed();
    }

    keyReleased() {
    }
}