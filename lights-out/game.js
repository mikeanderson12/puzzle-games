class LightsOutGame {
    constructor() {
        this.gridSize = 5;
        this.board = [];
        this.moves = 0;
        this.gameBoard = document.getElementById('game-board');
        this.movesDisplay = document.getElementById('moves');
        this.winMessage = document.getElementById('win-message');
        this.finalMovesDisplay = document.getElementById('final-moves');
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.moves = 0;
        this.updateMovesDisplay();
        this.winMessage.classList.add('hidden');
        this.createBoard();
        this.randomizeBoard();
    }

    createBoard() {
        this.gameBoard.innerHTML = '';
        this.board = [];

        for (let row = 0; row < this.gridSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                this.board[row][col] = false;
                
                const light = document.createElement('button');
                light.className = 'light off';
                light.dataset.row = row;
                light.dataset.col = col;
                light.addEventListener('click', () => this.handleLightClick(row, col));
                
                this.gameBoard.appendChild(light);
            }
        }
    }

    randomizeBoard() {
        const minMoves = 5;
        const maxMoves = 15;
        const randomMoves = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
        
        for (let i = 0; i < randomMoves; i++) {
            const randomRow = Math.floor(Math.random() * this.gridSize);
            const randomCol = Math.floor(Math.random() * this.gridSize);
            this.toggleLights(randomRow, randomCol, false);
        }
        
        this.moves = 0;
        this.updateMovesDisplay();
    }

    handleLightClick(row, col) {
        if (this.winMessage.classList.contains('hidden')) {
            this.moves++;
            this.updateMovesDisplay();
            this.toggleLights(row, col, true);
            
            setTimeout(() => {
                if (this.checkWin()) {
                    this.showWinMessage();
                }
            }, 300);
        }
    }

    toggleLights(row, col, animate) {
        this.toggleLight(row, col, animate);
        
        if (row > 0) this.toggleLight(row - 1, col, animate);
        if (row < this.gridSize - 1) this.toggleLight(row + 1, col, animate);
        if (col > 0) this.toggleLight(row, col - 1, animate);
        if (col < this.gridSize - 1) this.toggleLight(row, col + 1, animate);
    }

    toggleLight(row, col, animate) {
        this.board[row][col] = !this.board[row][col];
        const lightElement = this.getLightElement(row, col);
        
        if (animate) {
            lightElement.classList.add('toggling');
            setTimeout(() => {
                lightElement.classList.remove('toggling');
            }, 300);
        }
        
        if (this.board[row][col]) {
            lightElement.classList.remove('off');
            lightElement.classList.add('on');
        } else {
            lightElement.classList.remove('on');
            lightElement.classList.add('off');
        }
    }

    getLightElement(row, col) {
        return this.gameBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    checkWin() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.board[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    showWinMessage() {
        this.finalMovesDisplay.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
    }

    updateMovesDisplay() {
        this.movesDisplay.textContent = this.moves;
    }

    setupEventListeners() {
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        const helpButton = document.getElementById('help-button');
        const modal = document.getElementById('instructions-modal');
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (helpButton && modal) {
            helpButton.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
            
            modalClose.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            
            modalOverlay.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LightsOutGame();
});
