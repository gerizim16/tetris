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

        this.sketch.background(200);
        this.drawTitle(this.sketch.width / 2, 20);
        const temp = (this.sketch.width - this.playArea.width) / 2;
        this.drawNext(temp + this.playArea.width + 50, 140);
        this.drawHold(temp - 120, 140);
        this.drawScore(temp - 120, 340);
        this.drawPlayArea(temp, 80);
    }

    drawNext(x, y) {
        this.sketch.fill(0);
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
        this.sketch.textSize(30);
        this.sketch.text('next', x, y);
        const blockSize = this.arena.blockSize - 10;
        this.player.next.forEach((shape, i) => {
            shape.draw(this.sketch, blockSize, x, y + 50 + (2 * blockSize + 20) * i);
        });
    }

    drawHold(x, y) {
        this.sketch.fill(0);
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
        this.sketch.textSize(30);
        this.sketch.text('hold', x, y);
        if (!this.player.shapeHold) return;
        const blockSize = this.arena.blockSize - 10;
        this.player.shapeHold.draw(this.sketch, blockSize, x, y + 50);
    }

    drawPlayArea(x, y) {
        this.arena.draw();
        this.player.drawShadow();
        this.player.draw();
        this.sketch.image(this.playArea, x, y);
    }

    drawScore(x, y) {
        this.sketch.fill(0);
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
        this.sketch.textSize(30);
        this.sketch.text('score', x, y);
        this.sketch.text(this.player.score, x, y + 50);
    }

    drawTitle(x, y) {
        this.sketch.fill(0);
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.TOP);
        this.sketch.textSize(40);
        this.sketch.text('TETRIS', x, y);
    }

    keyPressed() {
        this.player.keyPressed();
    }

    keyReleased() {
    }
}