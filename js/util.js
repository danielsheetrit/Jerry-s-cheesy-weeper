function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderBoard(mat) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}"
            onclick="clickedCell(${i},${j})" 
            oncontextmenu="rightClick(this, ${i}, ${j} ); return false;"
            ></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elWraper = document.querySelector('.board-wraper');
    elWraper.innerHTML = strHTML;
}