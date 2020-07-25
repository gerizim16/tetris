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
        
        this.drawTitle(this.sketch.width / 2, 20);

        this.sketch.image(this.playArea, (this.sketch.width - this.playArea.width) / 2, 80);
    }

    drawTitle(x, y) {
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.TOP);
        this.sketch.textSize(40);
        this.sketch.text('TETRIS', x, y)
    }

    keyPressed() {
        this.player.keyPressed();
    }

    keyReleased() {
    }
}