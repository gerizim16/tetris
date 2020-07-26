class Player {
    constructor(sketch, graphics, arena, fallRate = 1000) {
        this.sketch = sketch;
        this.graphics = graphics;
        this.arena = arena;
        this.fallRate = fallRate;
        this.fallCounter = 0;
        this.horizontalRate = 120;
        this.horizontalMoveCounter = 0;
        this.verticalRate = fallRate * 0.1;
        this.verticalMoveCounter = 0;
        this.shapeNameGenerator = randomShapeName();
        this.next = [];
        for (let i = 0; i < 6; i++) {
            this.next.push(this.createShape());
        }
        this.spawn();
    }

    createShape() {
        return new Shape(this.shapeNameGenerator.next().value);
    }

    resetCoords() {
        this.x = 3;
        this.y = 0;
    }

    spawn() {
        this.resetCoords();
        this.held = false;
        this.shape = this.next.shift();
        this.next.push(this.createShape());
        this.updateShadow();
    }

    drop() {
        this.y = this.yShadow;
        this.arena.merge(this);
        this.spawn();
    }

    hold() {
        if (!this.held) {
            [this.shapeHold, this.shape] = [this.shape, this.shapeHold];
            this.resetCoords();
            if (this.shape == null) {
                this.spawn();
            }
            this.updateShadow();
            this.held = true;
        }
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
                if (this.move(0, 1)) {
                    this.fallCounter = 0;
                }
                this.verticalMoveCounter -= this.verticalRate;
            }
        }

        this.fallCounter += this.sketch.deltaTime;
        if (this.fallCounter >= this.fallRate) {
            if (!this.move(0, 1)) {
                this.drop();
            }
            this.fallCounter -= this.fallRate;
        }
    }

    updateShadow() {
        const y = this.y;
        while (this.move(0, 1)) { }
        this.yShadow = this.y;
        this.y = y;
    }

    draw() {
        this.shape.drawGrid(this.graphics, this.arena.blockSize, this.x, this.y);
    }

    drawShadow() {
        this.shape.drawGrid(this.graphics, this.arena.blockSize, this.x, this.yShadow, colors.SHADOW);
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
        if (x != 0) {
            this.updateShadow();
        }
        return true;
    }

    rotate(cwAmount) {
        // TODO: pushback
        cwAmount += 4;
        cwAmount %= 4;
        this.shape.rotate(cwAmount);
        if (this.collides()) {
            this.shape.rotate(-cwAmount);
        }
        if (cwAmount != 0) {
            this.updateShadow();
        }
    }

    keyPressed() {
        if (this.sketch.keyCode === 65 || this.sketch.keyCode === 37) {
            this.move(-1, 0);
        } else if (this.sketch.keyCode === 68 || this.sketch.keyCode === 39) {
            this.move(1, 0);
        }
        if (this.sketch.keyCode === 83 || this.sketch.keyCode === 40) {
            this.move(0, 1);
        }
        if (this.sketch.keyCode === 88 || this.sketch.keyCode === 38) {
            this.rotate(1);
        } else if (this.sketch.keyCode === 90 || this.sketch.keyCode === 17) {
            this.rotate(-1);
        }
        if (this.sketch.keyCode === 32) {
            this.drop();
        }
        if (this.sketch.keyCode === 67) {
            this.hold();
        }
    }
}