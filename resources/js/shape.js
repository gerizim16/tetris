function* randomShapeName() {
    let bag = [];
    while (true) {
        if (bag.length === 0) {
            bag = Object.values(Shape.NAMES);
            bag = shuffle(bag);
        }
        yield bag.pop();
    }
}

class Shape {
    constructor(name) {
        this.name = name;
        this.orientation = 0;
        if (name == null) {
            name = Shape.getRandomShapeName();
        }

        switch (name) {
            case Shape.NAMES.L:
                this.grid = [
                    [false, false, true],
                    [true, true, true],
                    [false, false, false],
                ];
                this.color = colors.ORANGE;
                break;
            case Shape.NAMES.J:
                this.grid = [
                    [true, false, false],
                    [true, true, true],
                    [false, false, false],
                ];
                this.color = colors.BLUE;
                break;

            case Shape.NAMES.T:
                this.grid = [
                    [false, true, false],
                    [true, true, true],
                    [false, false, false],
                ];
                this.color = colors.MAGENTA;
                break;

            case Shape.NAMES.S:
                this.grid = [
                    [false, true, true],
                    [true, true, false],
                    [false, false, false],
                ];
                this.color = colors.GREEN;
                break;

            case Shape.NAMES.Z:
                this.grid = [
                    [true, true, false],
                    [false, true, true],
                    [false, false, false],
                ];
                this.color = colors.RED;
                break;

            case Shape.NAMES.O:
                this.grid = [
                    [false, true, true],
                    [false, true, true],
                    [false, false, false],
                ];
                this.color = colors.YELLOW;
                break;

            case Shape.NAMES.I:
                this.grid = [
                    [false, false, false, false],
                    [true, true, true, true],
                    [false, false, false, false],
                    [false, false, false, false],
                ];
                this.color = colors.CYAN;
                break;

            default:
                throw ('Unable to construct shape: ' + name);
        }
    }

    static getRandomShapeName() {
        return Shape.NAMES[Object.keys(Shape.NAMES)[Math.floor(Math.random() * Object.keys(Shape.NAMES).length)]];
    }

    rotate(cwAmount) {
        if (this.name === Shape.NAMES.O) return;
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

    setOrientation(orientation) {
        this.rotate(orientation - this.orientation);
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

Shape.NAMES = Object.freeze({
    L: Symbol("l"),
    J: Symbol("j"),
    T: Symbol("t"),
    S: Symbol("s"),
    Z: Symbol("z"),
    O: Symbol("o"),
    I: Symbol("i"),
});