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
        this.placeRate = 500;
        this.placeCounter = 0;
        this.moveDirection = {
            x: 0,
            y: 0,
        }
        this.score = 0;
        this.shapeNameGenerator = randomShapeName();
        this.next = [];
        for (let i = 0; i < 6; i++) {
            this.next.push(this.createShape());
        }
        this.spawn();
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

    move(x, y) {
        if (x != null) {
            this.moveDirection.x = x;
        }
        if (y != null) {
            this.moveDirection.y = y;
        }
    }

    rotate(cwAmount) {
        // TODO: pushback
        if (this.shape.shapeName === shapeNames.O) return false;
        cwAmount %= 4;
        cwAmount += 4;
        cwAmount %= 4;
        this.shape.rotate(cwAmount);
        let success = true;
        if (this.collides()) {
            this.shape.rotate(-cwAmount);
            success = false;
        }
        this.updateShadow();
        if (success) {
            sounds.ROTATE.play();
            this.placeCounter = 0;
        }
        return success;
    }

    hardDrop() {
        sounds.HARD_DROP.play();
        this.score += (this.yShadow - this.y) * 2;
        this.y = this.yShadow;
        this.place();
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

    cleared(lines) {
        if (!lines) return;
        sounds.LINE.play();
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

    spawn() {
        this.shape = this.next.shift();
        this.next.push(this.createShape());
        this.resetStatus();
    }

    update() {
        if (this.moveDirection.x != 0) {
            this.horizontalMoveCounter += this.sketch.deltaTime;
            if (this.horizontalMoveCounter >= this.horizontalRate) {
                this.translate((this.moveDirection.x < 0) ? -1 : 1, 0);
                this.horizontalMoveCounter -= this.horizontalRate;
            }
        } else {
            this.horizontalMoveCounter = this.horizontalRate;
        }
        if (this.moveDirection.y > 0) {
            this.verticalMoveCounter += this.sketch.deltaTime;
            if (this.verticalMoveCounter >= this.verticalRate) {
                this.softDrop();
                this.verticalMoveCounter -= this.verticalRate;
            }
        } else {
            this.verticalMoveCounter = this.verticalRate;
        }
        this.fallCounter += this.sketch.deltaTime;
        if (this.fallCounter >= this.fallRate) {
            this.translate(0, 1);
            this.fallCounter -= this.fallRate;
        }
        if (this.y == this.yShadow) {
            this.placeCounter += this.sketch.deltaTime;
            if (this.placeCounter >= this.placeRate) {
                this.place();
                this.placeCounter -= this.placeRate;
            }
        } else {
            this.placeCounter = 0;
        }
    }

    updateShadow() {
        const y = this.y;
        while (!this.collides()) {
            this.y++;
        }
        this.yShadow = this.y - 1;
        this.y = y;
    }

    draw() {
        this.shape.drawGrid(this.graphics, this.arena.blockSize, this.x, this.y);
    }

    drawShadow() {
        this.shape.drawGrid(this.graphics, this.arena.blockSize, this.x, this.yShadow, colors.SHADOW);
    }

    keyPressed() {
        let x, y;
        if (this.sketch.keyCode === 37) {
            x = -1;
        } else if (this.sketch.keyCode === 39) {
            x = 1;
        }
        if (this.sketch.keyCode === 40) {
            y = 1;
        }
        this.move(x, y);
        if (this.sketch.keyCode === 88 || this.sketch.keyCode === 38) {
            this.rotate(1);
        } else if (this.sketch.keyCode === 90 || this.sketch.keyCode === 17) {
            this.rotate(-1);
        }
        if (this.sketch.keyCode === 32) {
            this.hardDrop();
        }
        if (this.sketch.keyCode === 67) {
            this.hold();
        }
    }

    keyReleased() {
        let x, y;
        if (!this.sketch.keyIsDown(37) && !this.sketch.keyIsDown(39)) {
            x = 0;
        }
        if (this.sketch.keyCode === 40) {
            y = 0;
        }
        this.move(x, y);
    }

    // HELPER METHODS --

    resetStatus() {
        this.x = 3;
        this.y = 0;
        this.held = false;
        this.fallCounter = 0;
        this.updateShadow();
    }

    createShape() {
        return new Shape(this.shapeNameGenerator.next().value);
    }

    collides() {
        for (let y = 0; y < this.shape.rows; y++) {
            for (let x = 0; x < this.shape.cols; x++) {
                if (this.shape.collidable(x, y) && this.arena.collidable(x + this.x, y + this.y)) {
                    return true;
                }
            }
        }
        return false;
    }

    collidable(x, y) {
        return this.shape.grid[y][x];
    }

    place() {
        this.arena.merge(this);
        this.spawn();
    }

    softDrop() {
        const moved = this.translate(0, 1);
        if (moved) {
            this.score++;
            this.fallCounter = 0;
        }
        return moved;
    }

    translate(x, y) {
        if (y != 0) {
            if (this.y + y <= this.yShadow) {
                this.y += y;
            } else {
                return false;
            }
        }
        if (x != 0) {
            const pastX = this.x;
            this.x += x;
            if (this.collides()) {
                this.x = pastX;
                return false;
            }
            this.updateShadow();
        }
        return true;
    }
}

class AIPlayer extends Player {
    constructor(sketch, graphics, arena, fallrate = 1000) {
        super(sketch, graphics, arena, fallrate);
        this.moveQueue = [];
    }

    spawn() {
        super.spawn();
        this.computeMoveQueue();
    }

    // HELPER METHODS --

    computeMoveQueue() {
    }

    // clear key events
    keyPressed() { }

    keyReleased() { }
}