'use strict';

function init() {
    !gGame.isOn
    gGame.shownCount = 0
    gGame.minesRevealed = 0
    gGame.secsPassed = 0
    gIsWin = false
    gBoard = createBoard(gLevel.size)
    renderBoard(gBoard)
    faceState()
    renderLives()
    LocalStorage()
}

function createBoard(size) {
    var board = createMat(size)
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var cell = createCell()
            board[i][j] = cell
        }
    }
    return board
}

function createCell() {
    var cell = {
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false,
        isDone: false
    }
    return cell
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var minesAround = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (mat[i][j].isMine) minesAround++
        }
    }
    return minesAround
}

function recrusiveNegsCount(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue

            var elCell = document.querySelector(`.cell-${i}-${j}`)
            var currCell = mat[i][j]

            if (currCell.isMine || currCell.isMarked) continue
            if (currCell.isShown) {
                continue
            } else {
                currCell.isShown = true
                gGame.shownCount++
                elCell.classList.add('occupied')

                if (currCell.minesAroundCount === 0) {
                    recrusiveNegsCount(i, j, gBoard)
                    checkVictory()
                } else {
                    elCell.innerHTML = currCell.minesAroundCount
                }
            }
        }
    }
}

function rdmMines(board, size, minesAmount) {
    for (let i = 0; i < minesAmount; i++) {
        var rI = getRandomIntInclusive(0, size - 1)
        var rJ = getRandomIntInclusive(0, size - 1)
        if (!board[rI][rJ].isMine && !board[rI][rJ].isShown) {
            board[rI][rJ].isMine = true
        } else {
            i--
        }
    }
}

function clickedCell(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    //1st click
    if (!gFirstClick) {
        gFirstClick = true
        gGame.isOn = true
        var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
        if (!cell.isMarked && !cell.isShown) {
            //update the model
            cell.isShown = true
            elCell.classList.add('occupied')
            gGame.shownCount++
            checkVictory()
        }
        //produce Mines
        rdmMines(gBoard, gLevel.size, gLevel.mines)
        //neighboors loop
        for (var a = 0; a < gBoard.length; a++) {
            for (var b = 0; b < gBoard[0].length; b++) {
                var currCell = gBoard[a][b]
                currCell.minesAroundCount = setMinesNegsCount(a, b, gBoard)
            }
        }
        console.log(gBoard);
        //update modell
        // update the DOM
        if (cell.minesAroundCount === 0) {
            recrusiveNegsCount(cellI, cellJ, gBoard)
        } else {
            elCell.innerHTML = cell.minesAroundCount
        }
        //start the timer
        startTimer()
    } else {
        //2nd click and on
        var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
        if (!cell.isMarked && !cell.isShown) {
            //update the model
            cell.isShown = true
            elCell.classList.add('occupied')
            gGame.shownCount++
            checkVictory()
        }
        // update the DOM
        if (!cell.isDone) {
            cell.isDone = true
            if (cell.isMine) {
                elCell.innerHTML = MINE
                gGame.minesRevealed++
                gLevel.lives--
                checkGameOver()
                renderLives()
                elCell.classList.add('cheese')
            } else {
                if (cell.minesAroundCount) {
                    elCell.innerHTML = cell.minesAroundCount
                } else {
                    recrusiveNegsCount(cellI, cellJ, gBoard)
                }
            }
        }

    }
}

function rightClick(elCell, cellI, cellJ) {
    elCell.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()
        return false
    }, false)
    //updat the modell
    var clickedCell = gBoard[cellI][cellJ]

    if (!clickedCell.isMarked) {
        if (gGame.markedCount < gLevel.mines) {
            clickedCell.isMarked = true
            gGame.markedCount++
        }
    } else {
        clickedCell.isMarked = false
        gGame.markedCount--
    }

    //update the dom
    if (!clickedCell.isShown) {
        elCell.innerHTML = clickedCell.isMarked ? FLAG : ''
    }
}

function checkGameOver() {
    if (gLevel.lives === -1) {
        !gGame.isOn
        expendAll(gBoard)
        stopTimer()
        faceState()
    }
}

function checkVictory() {
    var cellCount = gLevel.size ** 2
    var noMinesCells = cellCount - gLevel.mines
    if (gGame.isOn) {
        if (gLevel.lives !== -1 && gGame.shownCount >= noMinesCells) {
            if ((noMinesCells + gGame.minesRevealed) - gGame.markedCount ===
                gGame.shownCount - gGame.markedCount) {
                var elFace = document.querySelector('.face')
                elFace.innerText = WINNER
                gIsWin = true
                !gGame.isOn
                gSec = gGame.secsPassed
                LocalStorage(timer.innerText)
                stopTimer()
            }
        }
    }
}

function expendAll(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (!currCell.isMarked) {
                if (currCell.isMine) {
                    elCell.innerHTML = MINE
                } else {
                    elCell.innerHTML = currCell.minesAroundCount === 0 ? '' : currCell.minesAroundCount
                }
            }
        }
    }
}

function levels(size) {
    if (size === 12) {
        gLevel.size = size
        gLevel.lives = 3
        gLevel.mines = 30
    } else if (size === 8) {
        gLevel.size = size
        gLevel.lives = 2
        gLevel.mines = 12
    } else {
        gLevel.size = size
        gLevel.lives = 1
        gLevel.mines = 2
    }
    gFirstClick = false
    gIsWin = false
    stopTimer()
    init()
}

function faceState() {
    var elFace = document.querySelector('.face')
    elFace.innerText = gLevel.lives === -1 ? SAD : HAPPY
}

function restart() {
    !gGame.isOn
    gIsWin = false
    init()
    faceState()
    stopTimer()
    levels(gLevel.size)
    gFirstClick = false
}

function startTimer() {
    var countMil = 0;
    var countSec = 1;
    gCountInterval = setInterval(() => {
        timer.innerText = `${countSec}:${countMil}`
        countMil++;
        gGame.secsPassed++
        if (countMil > 100) {
            countSec++;
            countMil = 0;
        }
    }, 10)
}

function stopTimer() {
    var elTimeText = document.querySelector('.time')
    if (gLevel.lives !== -1 && !gIsWin) elTimeText.innerHTML = '00:00'
    clearInterval(gCountInterval);
}

function renderLives() {
    var elLives = document.querySelector('.lives-text')
    var elLivesWrap = document.querySelector('.lives-wraper')
    switch (gLevel.lives) {
        case 3:
            elLives.innerHTML = '🧀 🧀 🧀'
            elLivesWrap.style.width = 170 + 'px'
            break;
        case 2:
            elLives.innerHTML = '🧀 🧀'
            elLivesWrap.style.width = 140 + 'px'
            break;
        case 1:
            elLives.innerHTML = '🧀'
            elLivesWrap.style.width = 110 + 'px'
            break;
        case 0:
            elLives.innerHTML = '❌'
            elLivesWrap.style.width = 105 + 'px'
            break;
    }
}

function LocalStorage(bestTime) {
    var elLclStrg = document.querySelector('.best-score')

    if (gLevel.mines === 2) gLocalStorage.currLevel = 'Easy'
    if (gLevel.mines === 12) gLocalStorage.currLevel = 'Medium'
    if (gLevel.mines === 30) gLocalStorage.currLevel = 'Hard'

    var getNum = gLocalStorage.getItem('highscore')
    var num = Number(`${getNum}`)

    if (gIsWin) {
        if (gGame.secsPassed < num) {
            gLocalStorage.highscore = gGame.secsPassed
            gLocalStorage.besttime = bestTime
        }
    }

    var player = {
        name: gLocalStorage.name,
        level: gLocalStorage.currLevel,
        bestTime: gLocalStorage.besttime
    }

    gLocalStorage.setItem('player', `${player.name}`)
    gLocalStorage.setItem('level', `${player.level}`)
    gLocalStorage.setItem('score', `${player.bestTime}`)

    elLclStrg.innerHTML =
        `<ul>
    <li>Name: ${gLocalStorage.name}</li>
    <li>Current Level: ${gLocalStorage.currLevel}</li>
    <li>Best time: ${gLocalStorage.besttime}'s</li>
    </ul>`;
}

function playerName() {
    gLocalStorage.name = prompt(`Who's Playin'?`)
}