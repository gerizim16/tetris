const shapeNames = Object.freeze({
    L: Symbol("l"),
    J: Symbol("j"),
    T: Symbol("t"),
    S: Symbol("s"),
    Z: Symbol("z"),
    O: Symbol("o"),
    I: Symbol("i"),
});

class Shape {
    constructor(shapeName) {
        if (shapeName == null) {
            shapeName = Shape.getRandomShapeName();
        }

        switch (shapeName) {
            case shapeNames.L:
                this.grid = [
                    [false, false, false],
                    [true, true, true],
                    [true, false, false],
                ];
                this.color = colors.ORANGE;
                break;
            case shapeNames.J:
                this.grid = [
                    [false, false, false],
                    [true, true, true],
                    [false, false, true],
                ];
                this.color = colors.BLUE;
                break;

            case shapeNames.T:
                this.grid = [
                    [false, false, false],
                    [true, true, true],
                    [false, true, false],
                ];
                this.color = colors.MAGENTA;
                break;

            case shapeNames.S:
                this.grid = [
                    [false, false, false],
                    [false, true, true],
                    [true, true, false],
                ];
                this.color = colors.GREEN;
                break;

            case shapeNames.Z:
                this.grid = [
                    [false, false, false],
                    [true, true, false],
                    [false, true, true],
                ];
                this.color = colors.RED;
                break;

            case shapeNames.O:
                this.grid = [
                    [true, true],
                    [true, true],
                ];
                this.color = colors.YELLOW;
                break;

            case shapeNames.I:
                this.grid = [
                    [false, false, false, false],
                    [false, false, false, false],
                    [true, true, true, true],
                    [false, false, false, false],
                ];
                this.color = colors.CYAN;
                break;

            default:
                console.log('create shape failed');
        }
    }

    static getRandomShapeName() {
        return shapeNames[Object.keys(shapeNames)[Math.floor(Math.random() * Object.keys(shapeNames).length)]];
    }

    rotate(cwAmount) {
        cwAmount += 4;
        cwAmount %= 4;
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