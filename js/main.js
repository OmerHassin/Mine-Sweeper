'use strict'
const MINE_IMG = '💥';
const FLAG_IMG = '🚩';
const NUMS_IMGS = [' ','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'];
const MINE_SOUND = 'sound/MineSound.mp3';

const SMILEY = '😀';
const SAD = '😢';
const SUNGLASSES = '😎';

const BEGINNER = {size: 4, mines: 2};
const MEDIUM = {size: 8, mines: 14};
const EXPERT = {size: 12, mines: 32};

var gBoard;
var gBoardsHistory;
var gGame;
var gLevel = BEGINNER;
var gMines;
var gLives;

var gIsFirstClick;
var gMarkedMinesCount;
var gHintsCount;
var gSafeClicksCount;
var gMegaHintsCount;
var gIsDarkMode;
var gShownCount;
var gTimerInterval;


function onInit() {
    closeModal();
    clearInterval(gTimerInterval);

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0
    };
    
    gMines = [];
    gBoardsHistory = [];
    gIsFirstClick = true;
    gMarkedMinesCount = 0;
    gShownCount = 0;
    gLives = 3;
    gSafeClicksCount = 3;
    gHintsCount = 3;
    gMegaHintsCount = 1;
    gIsDarkMode = false;

    gBoard = buildBoard();
    printBoard(gBoard);
    renderBoard(gBoard);
    resetTimer();
    renderLives();
    renderSmileyBtn(SMILEY);
}

function setMinesNegsCount(board) {
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board.length; j++){
            board[i][j].minesAroundCount = getAmountOfNeighboursContaining(board, i, j);
        }
    }
}

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board.length - 1 || (i === cellI && j === cellJ)) continue;
            const cell = board[i][j];
            if(!cell.isShown && !cell.isMine && !cell.isMarked){
                cell.isShown = true;
                gShownCount++;
                const elCell = document.querySelector(`.${getClassName(i,j)}`);
                elCell.classList.add('clicked');
                // console.log(elCell);
                renderCell({i, j}, NUMS_IMGS[cell.minesAroundCount]);
                if(!cell.minesAroundCount) expandShown(board, i, j);
            }
        }
    }
}

function onCellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', (event) => {event.preventDefault();})
    if(!gGame.isOn) return;
    // console.log(`right i:${i}  right j:${j}`);
    if(gIsFirstClick) return;
    const cell = gBoard[i][j];
    if(cell.isShown) return;
    elCell.classList.toggle('marked');
    renderMarkCell(elCell, cell);
}

function renderMarkCell(elCell, cell) {
    if(elCell.classList.contains('marked')){
        cell.isMarked = true;
        if(cell.isMine) gMarkedMinesCount++;
        elCell.innerHTML = FLAG_IMG;
    }else{
        cell.isMarked = false;
        if(cell.isMine) gMarkedMinesCount--;
        elCell.innerHTML = ''
    }
    checkGameOver();
    // console.log(gMarkedMinesCount);
}

//tide it up
function onCellClicked(elCell, i, j) {
    if(!gGame.isOn) return;
    const cell = gBoard[i][j];
    if(gIsFirstClick) firstClick(i, j);
    gIsFirstClick = false;
    if(elCell.classList.contains('marked')) return;
    if(cell.isShown) return
    if(cell.isMine){
        playSound(MINE_SOUND);
        gLives--;
        renderLives();
        gMarkedMinesCount++;
    } else{
        gShownCount++;
    }
    cell.isShown = true;
    elCell.classList.toggle('clicked');
    const cellImg = (cell.isMine) ? MINE_IMG : NUMS_IMGS[cell.minesAroundCount];
    const emoji = (cell.isMine) ? SAD : SMILEY;
    renderSmileyBtn(emoji);
    renderCell({i, j}, cellImg);
    if(!cell.minesAroundCount && !cell.isMine) expandShown(gBoard, i, j);
    checkGameOver();
}

function firstClick(i, j) {
    gIsFirstClick = false;
    addRandomMines(gBoard, gLevel.mines, {i, j});
    setMinesNegsCount(gBoard);
    printBoard(gBoard);
    renderBoard(gBoard);

    const elCell = document.querySelector(`.${getClassName(i, j)}`);
    elCell.classList.add('clicked');

    //start timer
    gTimerInterval = setInterval(timer, 1000);
}

function getCell(cellI, cellJ) {
    return {position: {i: cellI, j: cellJ},
            minesAroundCount: 0,
            isClicked: false,
            isShown: false,
            isMine: false,
            isMarked: false}
}

function checkGameOver() {
    var msg = '';
    if(gLives === 0){
        renderSmileyBtn(SAD);
        msg = `Game Over! 💀`
        gameOver(msg);
    } else if(gMarkedMinesCount === gMines.length && gShownCount === gLevel.size ** 2 - gMines.length){
        renderSmileyBtn(SUNGLASSES);
        msg = `You Won! 🏆`;
        gameOver(msg)
    } 
}

function gameOver(msg) {
    gGame.isOn = false;
    clearInterval(gTimerInterval);
    console.log(msg);
    openModal(msg);
}

function onDarkModeClick() {
    console.log('dark mode');
    gIsDarkMode = !gIsDarkMode;
    setElementsAccordingToDarkMode();
}

function setElementsAccordingToDarkMode() {
    const elBody = document.querySelector('body');
    elBody.classList.toggle('Dark-Mode');

    const elH1 = document.querySelector('h1');
    elH1.classList.toggle('Dark-Mode');

    const elSmiley = document.querySelector('.Smiley');
    elSmiley.classList.toggle('Dark-Mode');

    const elDarkModeBtn = document.querySelector('.Dark-Mode-Btn');
    elDarkModeBtn.innerText = (gIsDarkMode) ? `Dark Mode: ON` : `Dark Mode: OFF`;

    const elLives = document.querySelector('.Lives');
    elLives.classList.toggle('Dark-Mode');

    const elTimer = document.querySelector('.Timer');
    elTimer.classList.toggle('Dark-Mode');

    const elFooter = document.querySelector('footer');
    elFooter.classList.toggle('Dark-Mode');
}

function resetTimer() {
    const gElTimer = document.querySelector('.Timer');
    gElTimer.innerText = `00:00`;
}

function timer() {
    gGame.secPassed++;
    const minsPassed = Math.floor(gGame.secPassed / 60);
    const secsRemain = gGame.secPassed % 60;
    
    const paddedMinutes = ('' + minsPassed).padStart(2, "0");
    const paddedSeconds = ('' + secsRemain).padStart(2, "0");
    
    const gElTimer = document.querySelector('.Timer');
    gElTimer.innerText = `${paddedMinutes}:${paddedSeconds}`;
  }

function onSmileyClick() {
    onInit();
}

function onLevelClick(elBtn) {
    if(!gGame.isOn) return;

    const level = elBtn.classList[0];
    switch (level) {
        case 'BEGINNER':
            gLevel = BEGINNER;
            break;
        case 'MEDIUM':
            gLevel = MEDIUM;
            break;
        case 'EXPERT':
            gLevel = EXPERT;
            break;
        default:
            console.log(level);
            break;
    }

    onInit();
}