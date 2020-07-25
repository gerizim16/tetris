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