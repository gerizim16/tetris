function createMatrix(sizeX, sizeY, default_value = undefined) {
    let array = new Array(sizeY);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(sizeX);
        if (default_value !== undefined) {
            array[i].fill(default_value);
        }
    }
    return array;
}

function transpose(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < i; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
}

function mirrorOnX(matrix) {
    matrix.reverse();
}

function mirrorOnY(matrix) {
    matrix.forEach((row) => {
        row.reverse();
    });
}

const colors = {
    BLACK: [10, 10, 10],
    BLUE: [3, 65, 174],
    GREEN: [114, 203, 59],
    YELLOW: [255, 213, 0],
    ORANGE: [255, 151, 28],
    RED: [255, 50, 19],
    MAGENTA: [255, 0, 255],
    CYAN: [0, 255, 255],
}

const shapes = Object.freeze({
    L: Symbol("l"),
    J: Symbol("j"),
    T: Symbol("t"),
    S: Symbol("s"),
    Z: Symbol("z"),
    O: Symbol("o"),
    I: Symbol("i"),
});

function getRandomShape() {
    return shapes[Object.keys(shapes)[Math.floor(Math.random() * Object.keys(shapes).length)]];
}

function createShape(shape) {
    switch (shape) {
        case shapes.L:
            return {
                grid: [
                    [false, false, false],
                    [true, true, true],
                    [true, false, false],
                ],
                color: colors.ORANGE,
            }
        case shapes.J:
            return {
                grid: [
                    [false, false, false],
                    [true, true, true],
                    [false, false, true],
                ],
                color: colors.BLUE,
            }
        case shapes.T:
            return {
                grid: [
                    [false, false, false],
                    [true, true, true],
                    [false, true, false],
                ],
                color: colors.MAGENTA,
            }
        case shapes.S:
            return {
                grid: [
                    [false, false, false],
                    [false, true, true],
                    [true, true, false],
                ],
                color: colors.GREEN,
            }
        case shapes.Z:
            return {
                grid: [
                    [false, false, false],
                    [true, true, false],
                    [false, true, true],
                ],
                color: colors.RED,
            }
        case shapes.O:
            return {
                grid: [
                    [true, true],
                    [true, true],
                ],
                color: colors.YELLOW,
            }
        case shapes.I:
            return {
                grid: [
                    [false, false, false, false],
                    [false, false, false, false],
                    [true, true, true, true],
                    [false, false, false, false],
                ],
                color: colors.CYAN,
            }

        default:
            console.log('create shape failed')
    }
}