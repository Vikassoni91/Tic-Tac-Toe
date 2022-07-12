var board;

// Initialize Players and Available Spots
const computer = 'X';
const Human = 'O'

// Combo of ID of Squares to Win 
const winCombos = [
    [0, 3, 6],
    [2, 5, 8],
    [0, 1, 2],
    [1, 4, 7],
    [6, 4, 2],
    [0, 4, 8],
    [6, 7, 8],
    [3, 4, 5],
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, Human)
        if (!checkTie()) {
			setTimeout(function() {
				turn(bestSpot(), computer);
			}, 400);
        }
    }
}

// Exec Turn
function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let win = checkWinner(board, player);
    if (win) {
        gameOver(win);
    }
}

// Checks for a Winner
function checkWinner(mimic_board, player) {
    let winner = null;
    let plays = [];
    for (let i = 0; i < mimic_board.length; i++) {
        if (mimic_board[i] === player) {
            plays.push(i);
        }
    }
    for (let i = 0; i < winCombos.length; i++) {
        if (plays.includes(winCombos[i][0]) && plays.includes(winCombos[i][1]) &&
            plays.includes(winCombos[i][2])) {
            winner = { i, player };
            break;
        }
    }
    return winner;
}

// Stops the game and outputs result
function gameOver(winner) {
    for (let i of winCombos[winner.i]) {
        document.getElementById(i).style.backgroundColor =
            winner.player == Human ? "green" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(winner.player == Human ? "You Win!" : "You Lose, try again?");
}

// Gives the Result
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

// fubds and Returns number of empty spots on board
function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

// computer uses minimax algorithm to find the best spot
function bestSpot() {
	return minimax(board, computer).index;
}

//  Tie Check
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "orange";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("TIE GAME !!")
		return true;
	}
	return false;
}



// gives the other player
function otherplayer(player){
    return ('O'+'X').replace(player,"");
}

// Minimax Algorithm 

function minimax(mimic_board, player) {
    let openSpots = emptySquares();

    if (checkWinner(mimic_board, Human)) {
        return {score: -10};
    } else if (checkWinner(mimic_board, computer)) {
        return {score: 10};
    } else if (openSpots.length === 0) {
        return {score: 0};
    }
    
    let BEST_Move =-1;
    let Heigest_score=Infinity;

    if(player==computer)  Heigest_score=-Infinity;

    for (let i = 0; i <9; i++) {
        if(typeof mimic_board[i]!='number') continue;
        let move=mimic_board[i];
        mimic_board[i] = player;
        let temp= minimax(mimic_board,otherplayer(player));
        if(temp.score> Heigest_score && player==computer){
               Heigest_score=temp.score;
              BEST_Move=move;
        }
        if(temp.score< Heigest_score && player==Human){
             Heigest_score=temp.score;
            BEST_Move=move;
        }
        mimic_board[i] = move;
    }
    return {index:BEST_Move,score: Heigest_score};
}


