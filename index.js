const gameBoard = (function() {
    const board = [[" ", " ", " "],
                        [" ", " ", " "],
                        [" ", " ", " "]
        ];
    function isBlankSpace(row, column) {
        return board[row][column] === " ";
    }
    function placeMarker(marker, row, column){
        if(row < 0 || row >= 3 || column < 0 || column >= 3) {
            return false;
        }
        if(isBlankSpace(row, column)) {
            board[row][column] = marker;
            return true;
        }
        else {
            return false
        }
    }
    function resetBoard() {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                board[i][j] = " ";
            }
        }
    }
    function getBoard() {
        return board;
    }
    return {placeMarker, resetBoard, getBoard};
})();
const gameController = (function () {
    let currentPlayer;
    let player1;
    let player2
    let rounds = 0;
    let gameOver = false;
    function initGame(player1Name, player2Name) {
        player1 = createPlayer(player1Name, 'X');
        player2 = createPlayer(player2Name, 'O');
        currentPlayer = player1;
    }
    function checkWin(marker, row, column) {
        const board = gameBoard.getBoard();
        let horizontal = true;
        let vertical = true;
        let diagonal = true;
        for (let i = 0; i < 3; i++) {
            if(board[row][i] != marker) {
                horizontal = false;
            }
            if(board[i][column] != marker) {
                vertical = false;
            }
        }
        if (row === column || row === 3-column-1){
            let leftToRight = true;
            let rightToLeft = true;
            for (let i = 0; i < 3; i++) {
                if(board[i][i] != marker) {
                    leftToRight = false;
                }
                if(board[i][3-i-1] != marker) {
                    rightToLeft = false;
                }
            }
            diagonal = leftToRight || rightToLeft;
        }
        else {
            diagonal = false;
        }
        return horizontal || vertical || diagonal;
    }
    function playRound(row, column) {
        if(gameOver) {
            console.log("Reset the game to play again");
            return;
        }
        const marker = currentPlayer.getMarker()
        if(gameBoard.placeMarker(marker, row, column)) {
            rounds++;
            if(checkWin(marker, row, column)) {
                console.log(`${currentPlayer.getName()} wins!`);
                gameOver = true;
            }
            else if (rounds === 9) {
                console.log("Draw");
                gameOver = true;
            }
            else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            }
        }
        else {
            console.log("Error: enter a valid posittion");
        }
        console.log(gameBoard.getBoard());
    }
    function resetGame() {
        gameBoard.resetBoard();
        rounds = 0;
        currentPlayer = player1;
        gameOver = false;
    }
    return {initGame, playRound, resetGame};
})();
const createPlayer = function(name, marker) {
    const playerName = name;
    const playerMarker = marker;
    function getName() {
        return playerName;
    }
    function getMarker() {
        return playerMarker;
    }
    return {getName, getMarker};
}
