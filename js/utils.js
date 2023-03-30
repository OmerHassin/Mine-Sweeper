'use strict'

/*board*/
function buildBoard() {
  const size = gLevel.size;
  const board = []

  for (var i = 0; i < size; i++) {
      board[i] = [];
      for (var j = 0; j < size; j++) {
          board[i][j] = getCell(i, j);
      }
  }

  return board;
}

function getClassName(i, j) {
  return `cell-${i}-${j}`;
}

/*Find*/

function getAmountOfNeighboursContaining(BOARD, ROW, COL) {
  var amount = 0
  for (var i = ROW - 1; i <= ROW + 1; i++) {
    if (i < 0 || i > BOARD.length - 1) continue
    for (var j = COL - 1; j <= COL + 1; j++) {
      if (j < 0 || j > BOARD[i].length - 1 || (i === ROW && j === COL)) continue
      if (BOARD[i][j].isMine) amount++
    }
  }
  return amount
}

function getAmountOfCellsContaining(BOARD, ITEM) {
  var amount = 0
  for (var i = 0; i < BOARD.length; i++) {
    for (var j = 0; j < BOARD[i].length; j++) {
      if (BOARD[i][j] === ITEM) amount++
    }
  }
  return amount
}

function getEmptyLocation(board) {
  var emptyLocations = []
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
          if (!board[i][j].isClicked) {
              emptyLocations.push({ i, j })
          }
      }
  }
  if (!emptyLocations.length) return null
  var randIdx = getRandomInt(0, emptyLocations.length)
  return emptyLocations[randIdx]
}

/*Random*/

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

function addRandomMines(board, numOfMines, firstClickPos) {
  for(var i = 0; i < numOfMines; i++){
      const randomLocation = getEmptyLocation(board);
      if(board[randomLocation.i][randomLocation.j].isMine ||
          randomLocation.i === firstClickPos.i &&
          randomLocation.j === firstClickPos.j){
          i--;
      } else{
          board[randomLocation.i][randomLocation.j].isMine = true;
          gMines.push(randomLocation);
      }
      //not working - not the same object reference
      // if(!gMines.includes(board[randomLocation.i][randomLocation.j])) gMines.push(randomLocation);
  }
}

/*Render*/

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

      strHTML += `<td class="cell ${className}" oncontextmenu="onCellMarked(this,${i},${j})" onclick="onCellClicked(this,${i},${j})">`;
      strHTML += '</td>\n';
    }
    strHTML += '</tr>\n';
  }
  strHTML += '</tbody>\n</table>\n';

  const elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function openModal(msg) {
  const elModal = document.querySelector('.modal')
  const elH3 = elModal.querySelector('.msg')
  elH3.innerText = msg;
  elModal.style.display = 'block';
}

function closeModal() {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'none';
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function renderLives() {
  const elLives = document.querySelector('.Lives');
  elLives.innerHTML = `Lives Left: ${gLives}`;
}

function renderSmileyBtn(img) {
  const elSmileyBtn = document.querySelector('.Smiley');
  elSmileyBtn.innerHTML = img;
}

//sound

function playSound(audioSource) {
  var sound = new Audio(audioSource);
  sound.play();
}