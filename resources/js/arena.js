class Arena {
    constructor(cols, rows, sketch) {
        this.grid = createMatrix(cols, rows);
        this.sketch = sketch;
        this.blockSize = sketch.width / cols;
        this.reset();
    }

    get rows() {
        return this.grid.length;
    }

    get cols() {
        return this.grid[0].length;
    }

    reset() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const randomDarkColor = this.sketch.color(Math.floor(Math.random() * 60));
                this.grid[y][x] = new Block(randomDarkColor, false);
            }
        }
    }

    collidable(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
            return true;
        }
        return this.grid[y][x].collidable;
    }

    draw() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.sketch.fill(this.grid[y][x].color);
                this.sketch.square(x * this.blockSize, y * this.blockSize, this.blockSize);
            }
        }
    }

    merge(player) {
        for (let y = 0; y < player.rows; y++) {
            for (let x = 0; x < player.cols; x++) {
                if (player.collidable(x, y)) {
                    this.grid[y + player.y][x + player.x] = new Block(player.color, true);
                }
            }
        }
    }
}