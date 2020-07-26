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
        this.dropRate = 500;
        this.dropCounter = 0;
        this.score = 0;
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

    resetStatus() {
        this.x = 3;
        this.y = 0;
        this.held = false;
        this.fallCounter = 0;
        this.updateShadow();
    }

    spawn() {
        this.shape = this.next.shift();
        this.next.push(this.createShape());
        this.resetStatus();
    }

    place() {
        this.arena.merge(this);
        this.spawn();
    }

    hardDrop() {
        this.score += (this.yShadow - this.y) * 2;
        this.y = this.yShadow;
    }

    softDrop() {
        const moved = this.move(0, 1);
        if (moved) this.score++;
        return moved;
    }

    cleared(lines) {
        switch (lines) {
            case 1:
                this.score += 100;
                break;
            case 2:
                this.score += 300;
                break;
            case 3:
                this.score += 500;
                break;
            case 4:
                this.score += 800;
                break;
            default:
                break;
        }
    }

    hold() {
        if (!this.held) {
            [this.shapeHold, this.shape] = [this.shape, this.shapeHold];
            if (this.shape == null) {
                this.spawn();
            }
            this.shapeHold.resetRotation();
            this.resetStatus();
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
                if (this.softDrop()) {
                    this.fallCounter = 0;
                }
                this.verticalMoveCounter -= this.verticalRate;
            }
        }
        this.fallCounter += this.sketch.deltaTime;
        if (this.fallCounter >= this.fallRate) {
            this.move(0, 1);
            this.fallCounter -= this.fallRate;
        }
        if (this.y == this.yShadow) {
            this.dropCounter += this.sketch.deltaTime;
            if (this.dropCounter >= this.dropRate) {
                this.place();
                this.dropCounter -= this.dropRate;
            }
        } else {
            this.dropCounter = 0;
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
        cwAmount %= 4;
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
            this.softDrop();
        }
        if (this.sketch.keyCode === 88 || this.sketch.keyCode === 38) {
            this.rotate(1);
        } else if (this.sketch.keyCode === 90 || this.sketch.keyCode === 17) {
            this.rotate(-1);
        }
        if (this.sketch.keyCode === 32) {
            this.hardDrop();
            this.place();
        }
        if (this.sketch.keyCode === 67) {
            this.hold();
        }
    }
}