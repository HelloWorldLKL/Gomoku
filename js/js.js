// 棋盘的canvas
var gomoku = document.querySelector('#gomoku');
var context = gomoku.getContext('2d');
// 棋子的canvas
var gomokuPiece = document.querySelector('#gomoku-piece');
var pieceContext = gomokuPiece.getContext('2d');
var myTurn = true;
var over = false;
// 棋盘的数据
var board = [];
// 赢法数组
var winMethods = [];
// 赢法计数器
var count = 0;
// 赢法统计数组
var myWin = [];
var computerWin = [];

function initBoard() {
    for (var i = 0; i < 15; i++) {
        board[i] = [];
        for (var j = 0; j < 15; j++) {
            board[i][j] = undefined;
        }
    }
}

function initWinMethods() {
    for (var i = 0; i < 15; i++) {
        winMethods[i] = [];
        for (var j = 0; j < 15; j++) {
            winMethods[i][j] = [];
        }
    }
    count = 0;
    // 横线
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                winMethods[i][j + k][count] = true;
            }
            count++;
        }
    }
    // 竖线
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                winMethods[j + k][i][count] = true;
            }
            count++;
        }
    }
    // 斜线
    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                winMethods[i + k][j + k][count] = true;
            }
            count++;
        }
    }
    // 反斜线
    for (var i = 0; i < 11; i++) {
        for (var j = 14; j > 3; j--) {
            for (var k = 0; k < 5; k++) {
                winMethods[i + k][j - k][count] = true;
            }
            count++;
        }
    }
    console.log(count);
}

function initWinCountArr() {
    for (var i = 0; i < count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0;
    }
}

function oneStep(x, y, turn) {
    if (turn) {
        // true 为黑
        pieceContext.fillStyle = '#050001';
    } else {
        // false 为白
        pieceContext.fillStyle = '#fcfffb';
    }
    pieceContext.beginPath();
    pieceContext.arc(28 + x * 46, 28 + y * 46, 20, 0, 2 * Math.PI);
    pieceContext.closePath();
    pieceContext.fill();
}

function drawChessBoard() {
    context.strokeStyle = '#401c00';
    for (var i = 0; i < 15; i++) {
        context.moveTo(28 + i * 46, 28);
        context.lineTo(28 + i * 46, 672);
        context.stroke();
        context.moveTo(28, 28 + i * 46);
        context.lineTo(672, 28 + i * 46);
        context.stroke();
    }
}

function replayGame() {
    initBoard();
    initWinCountArr();
    over = false;
    myTurn = true;
    pieceContext.clearRect(0, 0, 700, 700);
}

function BetaGo() {
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var maxX = 0,
        maxY = 0;
    // 初始化分数表
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (board[i][j] === undefined) {
                for (var k = 0; k < count; k++) {
                    if (winMethods[i][j][k]) {
                        if (myWin[k] === 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] === 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] === 3) {
                            myScore[i][j] += 2200;
                        } else if (myWin[k] === 4) {
                            myScore[i][j] += 10000;
                        }
                        if (computerWin[k] === 1) {
                            computerScore[i][j] += 400;
                        } else if (computerWin[k] === 2) {
                            computerScore[i][j] += 800;
                        } else if (computerWin[k] === 3) {
                            computerScore[i][j] += 2000;
                        } else if (computerWin[k] === 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    maxX = i;
                    maxY = j;
                } else if (myScore[i][j] === max) {
                    if (computerScore[i][j] > computerScore[maxX][maxY]) {
                        maxX = i;
                        maxY = j;
                    }
                }
                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    maxX = i;
                    maxY = j;
                } else if (computerScore[i][j] === max) {
                    if (myScore[i][j] > myScore[maxX][maxY]) {
                        maxX = i;
                        maxY = j;
                    }
                }
            }
        }
    }
    oneStep(maxX, maxY, myTurn);
    board[maxX][maxY] = false;
    for (var k = 0; k < count; k++) {
        if (winMethods[maxX][maxY][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            if (computerWin[k] === 5) {
                $('.modal-body')[0].innerHTML = 'Computer Win';
                $('#modal').modal('toggle')
                over = true;
            }
        }
    }
    if (!over) {
        myTurn = !myTurn;
    }
}

initBoard();
initWinMethods();
initWinCountArr();
drawChessBoard();


gomokuPiece.onclick = function(e) {
    if (over || !myTurn) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 46);
    var j = Math.floor(y / 46);
    console.log(board[i][j]);
    if (board[i][j] === undefined) {
        oneStep(i, j, myTurn);
        board[i][j] = true;
        for (var k = 0; k < count; k++) {
            if (winMethods[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;
                if (myWin[k] === 5) {
                    $('#modal').modal('toggle');
                    $('.modal-body')[0].innerHTML = 'You Win';
                    over = true;
                }
            }
        }
        if (!over) {
            myTurn = !myTurn;
            BetaGo();
        }
    }
}

$('#replay-btn')[0].onclick = function() {
    replayGame();
    $('#modal').modal('toggle');
}