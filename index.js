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
    let gameActive = false;
    function initGame(player1Name, player2Name) {
        resetGame();
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
        if (row === column || row === 3-column-1) {
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
        if(!gameActive) {
            if(!getCurrentPlayerName()) {
                return `Please add your names to start the game`
            }
            return "Reset the game to play again";
        }
        const marker = currentPlayer.getMarker()
        if(gameBoard.placeMarker(marker, row, column)) {
            rounds++;
            if(checkWin(marker, row, column)) {
                gameActive = false;
                return `${currentPlayer.getName()} wins!`
            }
            else if (rounds === 9) {
                gameActive = false;
                return "It's a Draw!"
            }
            else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                return `${getCurrentPlayerName()}'s turn`
            }
        }
        else {
            console.log("Error: enter a valid posittion");
        }
        return "";
    }
    function resetGame() {
        gameBoard.resetBoard();
        rounds = 0;
        currentPlayer = player1;
        gameActive = true;
    }
    function isGameActive() {
        return gameActive;
    }
    function getCurrentPlayerName() {
        if(!currentPlayer) {
            return null;
        }
        return currentPlayer.getName();
    }
    return {initGame, playRound, resetGame, isGameActive, getCurrentPlayerName};
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
const displayController = (function () {
    let ticTacToeContainer;
    let winnerDisplay;
    let form;
    let player1Input;
    let player2Input
    function cacheDom() {
        ticTacToeContainer = document.querySelector('.tic-tac-toe-container');
        infoDisplay = document.querySelector('.info-display');
        form = document.querySelector('.name-form');
        player1Input = document.querySelector('#player-one-name');
        player2Input = document.querySelector('#player-two-name');
        resetButton = document.querySelector('.reset-button')
    }
    function render(info ="") {
        const board = gameBoard.getBoard();
        const frag = document.createDocumentFragment();
        for(let [i, row] of board.entries()) {
            for(let [j, cell] of row.entries()) {
                const El = document.createElement('div');
                El.className = 'cell';
                El.textContent = cell;
                El.dataset.row = i;
                El.dataset.column = j;
                frag.appendChild(El);
            }
        }
        ticTacToeContainer.innerHTML = '';
        ticTacToeContainer.appendChild(frag);
        infoDisplay.textContent = info;
    }
    function bindEvents() {
        ticTacToeContainer.addEventListener('click', handleCellClick);
        form.addEventListener('submit', handleFormSubmit);
        resetButton.addEventListener('click', handleResetButtonClick)
    }
    function handleCellClick(e) {
        if(e.target.className == 'cell') {
            const info = gameController.playRound(e.target.dataset.row, e.target.dataset.column);
            render(info);
        }
    }
    function handleFormSubmit(e) {
        e.preventDefault();
        gameController.initGame(player1Input.value, player2Input.value);
        displayCurrentPlayer();
    }
    function handleResetButtonClick() {
        if (gameController.getCurrentPlayerName()){
            gameController.resetGame();
            displayCurrentPlayer();
        }
    }
    function displayCurrentPlayer() {
        const name = gameController.getCurrentPlayerName();
        render(`${name}'s turn`)
    }
    function init() {
        cacheDom();
        render();
        bindEvents();
    }
    return {init};
})();
displayController.init();