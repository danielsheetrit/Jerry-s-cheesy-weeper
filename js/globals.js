const EMPTY = ''
const MINE = '🧀'
const FLAG = '🚩'
const SAD = '😭' 
const HAPPY = '😀'
const WINNER = '😎' 

var gBoard
var gCountInterval
var gFirstClick = false
var gIsWin = false
var gLocalStorage = window.localStorage
var timer = document.querySelector('.time');

var gLevel = {
    size: 4,
    lives: 1,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesRevealed: 0
}