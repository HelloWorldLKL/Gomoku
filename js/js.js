var gomoku = document.querySelector('#gomoku');
var context = gomoku.getContext('2d');
var color = true;
// 棋盘的数据
var board = [];
for (var i = 0; i < 15; i++) {
    board.push([]);
    for (var j = 0; j < 15; j++) {
        board[i].push(undefined);
    }
}

function oneStep(x, y, color) {
    if (color) {
        // true 为黑
        context.fillStyle = '#050001';
    } else {
        // false 为白
        context.fillStyle = '#fcfffb';
    }
    context.beginPath();
    context.arc(28 + (x - 1) * 46, 28 + (y - 1) * 46, 20, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

// 画棋盘
context.strokeStyle = '#401c00';
for (var i = 0; i < 15; i++) {
    context.moveTo(28 + i * 46, 28);
    context.lineTo(28 + i * 46, 672);
    context.stroke();
    context.moveTo(28, 28 + i * 46);
    context.lineTo(672, 28 + i * 46);
    context.stroke();
}
gomoku.onclick = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 46) + 1;
    var j = Math.floor(y / 46) + 1;
    if (board[i - 1][j - 1] === undefined) {
        oneStep(i, j, color);
        board[i - 1][j - 1] = color;
        color = !color;
        console.table(board);
    }
}