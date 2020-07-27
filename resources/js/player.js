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
        };
        this._moved = {
            x: 0,
            y: 0,
        };
        this._rotated = 0;
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

    get moved() {
        const moved = Object.assign({}, this._moved);
        this._moved = {
            x: 0,
            y: 0,
        };
        return moved;
    }

    get rotated() {
        const rotated = this._rotated;
        this._rotated = 0;
        return rotated;
    }

    get orientation() {
        return this.shape.orientation;
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
        if (this.shape.name === Shape.NAMES.O) return false;
        this.shape.rotate(cwAmount);
        let success = true;
        if (this.collides()) {
            this.shape.rotate(-cwAmount);
            success = false;
        }
        this.updateShadow();
        if (success) {
            sounds.ROTATE.play();
            this._rotated = cwAmount;
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
            return true
        }
        return false;
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
                this._moved.y += y;
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
            this._moved.x += x;
            this.updateShadow();
        }
        return true;
    }
}

class AIPlayer extends Player {
    constructor(sketch, graphics, arena, fallrate = 1000) {
        super(sketch, graphics, arena, fallrate);
        this.computeMoveQueue();
    }

    spawn() {
        super.spawn();
        this.computeMoveQueue();
    }

    update() {
        super.update();
        this.executeMoveQueue();
    }

    computeMoveQueue() {
        // TODO
        this.moveQueue = [];
    }

    executeMoveQueue() {
        if (!this.moveQueue || !this.moveQueue.length) {
            this.hardDrop();
            return;
        }
        let moved = this.moved;
        let rotated = this.rotated;
        console.log(rotated);
        if (moved.x || moved.y || rotated) {
            const moveCounts = {
                [AIPlayer.MOVES.LEFT]: 0,
                [AIPlayer.MOVES.RIGHT]: 0,
                [AIPlayer.MOVES.DOWN]: moved.y,
                [AIPlayer.MOVES.ROTATE_LEFT]: 0,
                [AIPlayer.MOVES.ROTATE_RIGHT]: 0,
            }
            moveCounts[rotated > 0 ? AIPlayer.MOVES.ROTATE_RIGHT : AIPlayer.MOVES.ROTATE_LEFT] = Math.abs(rotated);
            moveCounts[moved.x > 0 ? AIPlayer.MOVES.RIGHT : AIPlayer.MOVES.LEFT] = Math.abs(moved.x);

            for (let index = 0; index < this.moveQueue.length; index++) {
                if (moveCounts[this.moveQueue[index]] > 0) {
                    --moveCounts[this.moveQueue[index]];
                    this.moveQueue.splice(index, 1);
                    index--;
                }
            }
        }
        const move = this.moveQueue[0];
        if (move === AIPlayer.MOVES.LEFT) {
            this.move(-1, null);
        } else if (move === AIPlayer.MOVES.RIGHT) {
            this.move(1, null);
        } else {
            this.move(0, null);
        }
        if (move === AIPlayer.MOVES.DOWN) {
            this.move(null, 1);
        } else {
            this.move(null, 0);
        }
        if (move === AIPlayer.MOVES.ROTATE_LEFT) {
            this.rotate(-1);
        } else if (move === AIPlayer.MOVES.ROTATE_RIGHT) {
            this.rotate(1);
        }
    }

    // HELPER METHODS --

    // clear key events
    // keyPressed() { }

    // keyReleased() { }
}

AIPlayer.MOVES = Object.freeze({
    LEFT: Symbol("left"),
    RIGHT: Symbol("right"),
    DOWN: Symbol("down"),
    ROTATE_RIGHT: Symbol("rotate_right"),
    ROTATE_LEFT: Symbol("rotate_left"),
});