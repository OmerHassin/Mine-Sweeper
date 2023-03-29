'use strict'
const MINE_IMG = '<img src="img/gamer.png">'
const BEGINNER = {size: 4, mines: 2};
const MEDIUM = {size: 8, mines: 14};
const EXPERT = {size: 12, mines: 32};

var gBoard;
var gGame;
var gLevel;


function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0
    };
    
    gLevel = BEGINNER;
    
    gBoard = buildBoard();
    printBoard(gBoard);
    renderBoard(gBoard);
}

function buildBoard() {
    const size = gLevel.size;
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = getCell(i, j);
        }
    }
    // addRandomMines(board, gLevel.mines);
    board[0][0].isMine = true;
    board[1][2].isMine = true;

    return board;
}

function printBoard(board) {
    const res = [];
    
    for(var i = 0; i < board.length; i++){
        res[i] = [];
        for(var j = 0; j < board.length; j++){
            if(board[i][j].isMine){
                res[i][j] = `${board[i][j].isMine} M`;
            }else{
                res[i][j] = board[i][j].isMine;
            }
        }
    }

    console.table(res);
}

function renderBoard(board) {
    var strHTML = '<table>\n<tbody>\n';
    for (var i = 0; i < board.length; i++) {
      strHTML += '<tr>\n';
      for (var j = 0; j < board.length; j++) {
        const className = getClassName(i, j);
  
        strHTML += `<td class="cell ${className}" onclick="onCellClicked(this,${i},${j})">`;
        strHTML += '</td>\n';
      }
      strHTML += '</tr>\n';
    }
    strHTML += '</tbody>\n</table>\n';
  
    const elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
  }

function onCellClicked(elCell, i, j) {
    // console.log(`i: ${i}, j: ${j}`);
    gBoard[i][j].isShown = true;
    const mineNegsCount = getAmountOfNeighboursContaining(gBoard, i, j);
    const cellImg = (gBoard[i][j].isMine) ? MINE_IMG : mineNegsCount;
    renderCell({i, j}, cellImg);
}

function getCell(cellI, cellJ) {
    return {position: {i: cellI, j: cellJ},
            minesAroundCount: 0,
            isShown: false,
            isMine: false,
            isMarked: false}
}

function addRandomMines(board, numOfMines) {
    for(var i = 0; i < numOfMines; i++){
        
    }
}

function getClassName(i, j) {
    return `cell cell-${i}-${j} cell-${i * gBoard.length + j}`;
}

function getEmptyLocation(board) {
    var emptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                emptyLocations.push({ i, j })
            }
        }
    }
    if (!emptyLocations.length) return null
    var randIdx = getRandomInt(0, emptyLocations.length)
    return emptyLocations[randIdx]
}