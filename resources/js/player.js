class Player {
    constructor(sketch, graphics, arena, fallRate = 1000) {
        this.sketch = sketch;
        this.graphics = graphics;
        this.arena = arena;
        this.fallRate = fallRate;
        this.fallCounter = 0;
        this.horizontalRate = 120;
        this.horizontalMoveCounter = 0;
        this.verticalRate = 120;
        this.verticalMoveCounter = 0;
        this.reset();
    }

    reset() {
        // TODO: fix spawn location and create shape class
        this.x = 3;
        this.y = 0;
        this.shape = new Shape();
    }

    update() {
        if (this.sketch.keyIsDown(65) || this.sketch.keyIsDown(37)) {
            this.horizontalMoveCounter += this.sketch.deltaTime;
            if (this.horizontalMoveCounter >= this.horizontalRate) {
                this.move(-1, 0);
                this.horizontalMoveCounter -= this.horizontalRate;
            }
        } else if (this.sketch.keyIsDown(68) || this.sketch.keyIsDown(39)) {
            this.horizontalMoveCounter += this.sketch.deltaTime;
            if (this.horizontalMoveCounter >= this.horizontalRate) {
                this.move(1, 0);
                this.horizontalMoveCounter -= this.horizontalRate;
            }
        } else {
            this.horizontalMoveCounter = 0;
        }
        if (this.sketch.keyIsDown(83) || this.sketch.keyIsDown(40)) {
            this.verticalMoveCounter += this.sketch.deltaTime;
            if (this.verticalMoveCounter >= this.verticalRate) {
                if (!this.move(0, 1)) {
                    this.arena.merge(this);
                    this.reset();
                }
                this.verticalMoveCounter -= this.verticalRate;
                this.fallCounter = 0;
            }
        }

        this.fallCounter += this.sketch.deltaTime;
        if (this.fallCounter >= this.fallRate) {
            if (!this.move(0, 1)) {
                this.arena.merge(this);
                this.reset();
            }
            this.fallCounter -= this.fallRate;
        }
    }

    draw() {
        this.graphics.fill(this.shape.color);
        this.shape.grid.forEach((row, rowIndex) => {
            row.forEach((occupied, colIndex) => {
                if (occupied) {
                    this.graphics.square((this.x + colIndex) * this.arena.blockSize, (this.y + rowIndex) * this.arena.blockSize, this.arena.blockSize);
                }
            });
        });
    }

    collides() {
        for (let y = 0; y < this.shape.rows; y++) {
            for (let x = 0; x < this.shape.cols; x++) {
                const occupied = this.shape.collidable(x, y);
                if (occupied && this.arena.collidable(x + this.x, y + this.y)) {
                    return true;
                }
            }
        }
        return false;
    }

    collidable(x, y) {
        return this.shape.grid[y][x];
    }

    move(x, y) {
        const pastX = this.x;
        const pastY = this.y;
        this.x += x;
        this.y += y;
        if (this.collides()) {
            this.x = pastX;
            this.y = pastY;
            return false;
        }
        return true;
    }

    rotate(cwAmount) {
        // TODO: pushback when possible
        this.shape.rotate(cwAmount);
        if (this.collides()) {
            this.shape.rotate(-cwAmount);
        }
    }

    mergeToArena() {
        this.arena.merge(this);
    }

    get rows() {
        return this.shape.grid.length;
    }

    get cols() {
        return this.shape.grid[0].length;
    }

    get color() {
        return this.shape.color;
    }
}