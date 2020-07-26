const shapeNames = Object.freeze({
    L: Symbol("l"),
    J: Symbol("j"),
    T: Symbol("t"),
    S: Symbol("s"),
    Z: Symbol("z"),
    O: Symbol("o"),
    I: Symbol("i"),
});

function* randomShapeName() {
    let bag = [];
    while (true) {
        if (bag.length === 0) {
            bag = Object.values(shapeNames);
            bag = shuffle(bag);
        }
        yield bag.pop();
    }
}

// TODO: orientation status, reset
class Shape {
    constructor(shapeName) {
        this.shapeName = shapeName;
        this.orientation = 0;
        if (shapeName == null) {
            shapeName = Shape.getRandomShapeName();
        }

        switch (shapeName) {
            case shapeNames.L:
                this.grid = [
                    [false, false, true],
                    [true, true, true],
                    [false, false, false],
                ];
                this.color = colors.ORANGE;
                break;
            case shapeNames.J:
                this.grid = [
                    [true, false, false],
                    [true, true, true],
                    [false, false, false],
                ];
                this.color = colors.BLUE;
                break;

            case shapeNames.T:
                this.grid = [
                    [false, true, false],
                    [true, true, true],
                    [false, false, false],
                ];
                this.color = colors.MAGENTA;
                break;

            case shapeNames.S:
                this.grid = [
                    [false, true, true],
                    [true, true, false],
                    [false, false, false],
                ];
                this.color = colors.GREEN;
                break;

            case shapeNames.Z:
                this.grid = [
                    [true, true, false],
                    [false, true, true],
                    [false, false, false],
                ];
                this.color = colors.RED;
                break;

            case shapeNames.O:
                this.grid = [
                    [false, true, true],
                    [false, true, true],
                    [false, false, false],
                ];
                this.color = colors.YELLOW;
                break;

            case shapeNames.I:
                this.grid = [
                    [false, false, false, false],
                    [true, true, true, true],
                    [false, false, false, false],
                    [false, false, false, false],
                ];
                this.color = colors.CYAN;
                break;

            default:
                throw ('Unable to construct shape: ' + shapeName);
        }
    }

    static getRandomShapeName() {
        return shapeNames[Object.keys(shapeNames)[Math.floor(Math.random() * Object.keys(shapeNames).length)]];
    }

    rotate(cwAmount) {
        if (this.shapeName === shapeNames.O) return;
        cwAmount %= 4;
        cwAmount += 4;
        cwAmount %= 4;
        this.orientation += cwAmount;
        this.orientation %= 4;
        switch (cwAmount) {
            case 1:
                transpose(this.grid);
                mirrorOnY(this.grid);
                break;
            case 2:
                transpose(this.grid);
                mirrorOnX(this.grid);
            case 3:
                transpose(this.grid);
                mirrorOnX(this.grid);
            default:
                break;
        }
    }

    resetRotation() {
        this.rotate(-this.orientation);
    }

    drawGrid(graphics, blockSize, xOffset = 0, yOffset = 0, colorOverride = null) {
        graphics.fill(colorOverride ?? this.color);
        this.grid.forEach((row, rowIndex) => {
            row.forEach((occupied, colIndex) => {
                if (occupied) {
                    graphics.square((xOffset + colIndex) * blockSize, (yOffset + rowIndex) * blockSize, blockSize);
                }
            });
        });
    }

    draw(graphics, blockSize, xOffset = 0, yOffset = 0, colorOverride = null) {
        graphics.fill(colorOverride ?? this.color);
        this.grid.forEach((row, rowIndex) => {
            row.forEach((occupied, colIndex) => {
                if (occupied) {
                    graphics.square(colIndex * blockSize + xOffset, rowIndex * blockSize + yOffset, blockSize);
                }
            });
        });
    }

    get rows() {
        return this.grid.length;
    }

    get cols() {
        return this.grid[0].length;
    }

    collidable(x, y) {
        return this.grid[y][x];
    }
}