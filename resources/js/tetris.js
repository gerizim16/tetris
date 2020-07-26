class Tetris {
    constructor(x, y, sketch) {
        this.x = x;
        this.y = y;
        this.sketch = sketch;
        // this.sounds = sounds;
        this.playArea = sketch.createGraphics(350, 700);
        this.arena = new Arena(10, 20, this.playArea, this);
        this.player = new Player(sketch, this.playArea, this.arena);
        this._level = 1;
        this._levelGoal = 10;
        this.lines = 0;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
        this.fallRate = ((0.8 - ((this._level - 1) * 0.007)) ** (this._level - 1)) * 1000;
        this.player.fallRate = this.fallRate;
        return this._level;
    }

    get levelGoal() {
        return this._levelGoal;
    }

    set levelGoal(value) {
        if (value <= 0) {
            value += 10;
            this.level++;
        }
        this._levelGoal = value;
        return this._levelGoal;
    }

    cleared(lines) {
        if (!lines) return;
        let temp;
        switch (lines) {
            case 1:
                temp = 1;
                break;
            case 2:
                temp = 3;
                break;
            case 3:
                temp = 5;
                break;
            case 4:
                temp = 8;
                break;
            default:
                temp = 0
                break;
        }
        this.levelGoal -= temp;
        this.lines += temp;
        this.player.cleared(lines);
    }

    draw() {
        this.player.update();

        this.sketch.background(200);
        this.drawTitle(this.sketch.width / 2, 20);
        const temp = (this.sketch.width - this.playArea.width) / 2;
        this.drawNext(temp + this.playArea.width + 50, 140);
        this.drawHold(temp - 120, 140);
        this.drawScore(temp - 120, 340);
        this.drawLevel(temp - 120, 540);
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

    drawLevel(x, y) {
        this.sketch.fill(0);
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
        this.sketch.textSize(30);
        this.sketch.text('level', x, y);
        this.sketch.text(this.level, x, y + 50);
        this.sketch.text('lines', x, y + 150);
        this.sketch.text(this.lines, x, y + 200);
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
}