var gomoku = document.querySelector('#gomoku');
var context = gomoku.getContext('2d');
var gomokuPiece = document.querySelector('#gomoku-piece');
var pieceContext = gomokuPiece.getContext('2d');
var myTurn = true;
var over = false;
// 棋盘的数据
var board = [];
for (var i = 0; i < 15; i++) {
  board[i] = [];
  for (var j = 0; j < 15; j++) {
    board[i][j] = undefined;
  }
}
// 赢法数组
var wins = []
for (var i = 0; i < 15; i++) {
  wins[i] = [];
  for (var j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}

var count = 0;
// 横线
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}
// 竖线
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}
// 斜线
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}
// 反斜线
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}
console.log(count);

// 赢法统计数组
var myWin = [];
var computerWin = [];
for (var i = 0; i < count; i++) {
  myWin[i] = 0;
  computerWin[i] = 0;
}

function oneStep(x, y, color) {
  if (color) {
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
      if (wins[i][j][k]) {
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
      computerAi();
    }
  }
}

function computerAi() {
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
          if (wins[i][j][k]) {
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
    if (wins[maxX][maxY][k]) {
      computerWin[k]++;
      myWin[k] = 6;
      if (computerWin[k] === 5) {
        // window.alert('Computer Win');
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

$('#replay-btn')[0].onclick = function() {
  for (var i = 0; i < 15; i++) {
    board[i] = [];
    for (var j = 0; j < 15; j++) {
      board[i][j] = undefined;
    }
  }
  for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
  }
  over = false;
  myTurn = true;
  pieceContext.clearRect(0, 0, 700, 700);
  $('#modal').modal('toggle');
}