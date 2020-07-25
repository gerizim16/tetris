class Arena {
    constructor(cols, rows, sketch) {
        this.grid = createMatrix(cols, rows);
        this.gridBackground = createMatrix(cols, rows);
        this.sketch = sketch;
        this.blockSize = sketch.width / cols;
        this.reset();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.gridBackground[y][x] = Arena.randomDarkColor();
            }
        }
    }

    get rows() {
        return this.grid.length;
    }

    get cols() {
        return this.grid[0].length;
    }

    reset() {
        this.grid = createMatrix(this.cols, this.rows);
    }

    static randomDarkColor() {
        return Math.floor(Math.random() * 60);
    }

    collidable(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
            return true;
        }
        return this.grid[y][x] != null;
    }

    draw() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.sketch.fill(this.grid[y][x] ?? this.gridBackground[y][x]);
                this.sketch.square(x * this.blockSize, y * this.blockSize, this.blockSize);
            }
        }
    }

    merge(player) {
        for (let y = 0; y < player.rows; y++) {
            for (let x = 0; x < player.cols; x++) {
                if (player.collidable(x, y)) {
                    this.grid[y + player.y][x + player.x] = player.color;
                }
            }
        }
        this.checkClearLines(player.y, player.y + player.rows);
    }

    checkClearLines(min, max) {
        // min inclusive, max exclusive
        min = Math.max(min, 0);
        max = Math.min(max, this.rows);
        let rowsToAdd = 0;
        const cols = this.cols;
        outer: for (let row = max - 1; row >= min; row--) {
            let element;
            for (element of this.grid[row]) {
                if (element == null) continue outer;
            }
            this.grid.splice(row, 1);
            rowsToAdd++;
        }
        this.grid.unshift(...createMatrix(cols, rowsToAdd));
    }
}