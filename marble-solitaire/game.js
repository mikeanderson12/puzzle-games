class MarbleSolitaire {
    constructor() {
        this.boardSize = 7;
        this.board = [];
        this.selectedCell = null;
        this.marbleCount = 32;
        this.moveCount = 0;
        this.gameOver = false;
        
        this.gameBoard = document.getElementById('game-board');
        this.marblesDisplay = document.getElementById('marbles-count');
        this.movesDisplay = document.getElementById('moves-count');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.resultTitle = document.getElementById('result-title');
        this.resultMessage = document.getElementById('result-message');
        this.finalMarbles = document.getElementById('final-marbles');
        this.finalMoves = document.getElementById('final-moves');
        
        this.initializeGame();
        this.setupEventListeners();
        this.setupInstructionsToggle();
    }
    
    initializeGame() {
        this.board = [];
        this.selectedCell = null;
        this.marbleCount = 32;
        this.moveCount = 0;
        this.gameOver = false;
        this.gameOverMessage.classList.add('hidden');
        
        // Create the cross-shaped board
        // Pattern: 0 = invalid, 1 = marble, 2 = hole
        const pattern = [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 1], // Center is empty (hole)
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0]
        ];
        
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                this.board[row][col] = pattern[row][col];
            }
        }
        
        this.updateDisplay();
        this.renderBoard();
    }
    
    renderBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const cellState = this.board[row][col];
                
                if (cellState === 0) {
                    cell.classList.add('invalid');
                } else if (cellState === 1) {
                    cell.classList.add('marble');
                } else if (cellState === 2) {
                    cell.classList.add('hole');
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                this.gameBoard.appendChild(cell);
            }
        }
    }
    
    handleCellClick(row, col) {
        if (this.gameOver) return;
        
        const cellState = this.board[row][col];
        
        // If clicking a marble, select it
        if (cellState === 1) {
            this.selectMarble(row, col);
        }
        // If clicking a hole and we have a marble selected, try to move
        else if (cellState === 2 && this.selectedCell) {
            this.tryMove(row, col);
        }
    }
    
    selectMarble(row, col) {
        this.selectedCell = { row, col };
        this.renderBoard();
        this.highlightValidMoves();
    }
    
    highlightValidMoves() {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        
        // Mark the selected marble
        const selectedElement = this.gameBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        // Check all four directions for valid moves
        const directions = [
            { dr: -2, dc: 0 },  // Up
            { dr: 2, dc: 0 },   // Down
            { dr: 0, dc: -2 },  // Left
            { dr: 0, dc: 2 }    // Right
        ];
        
        for (const dir of directions) {
            const targetRow = row + dir.dr;
            const targetCol = col + dir.dc;
            const middleRow = row + dir.dr / 2;
            const middleCol = col + dir.dc / 2;
            
            if (this.isValidMove(row, col, targetRow, targetCol)) {
                const targetElement = this.gameBoard.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`);
                if (targetElement) {
                    targetElement.classList.add('valid-move');
                }
            }
        }
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Check if target is within bounds
        if (toRow < 0 || toRow >= this.boardSize || toCol < 0 || toCol >= this.boardSize) {
            return false;
        }
        
        // Check if target is a hole
        if (this.board[toRow][toCol] !== 2) {
            return false;
        }
        
        // Check if there's a marble in between
        const middleRow = (fromRow + toRow) / 2;
        const middleCol = (fromCol + toCol) / 2;
        
        if (this.board[middleRow][middleCol] !== 1) {
            return false;
        }
        
        // Check if it's exactly 2 spaces away (no diagonal)
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        return (rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2);
    }
    
    tryMove(toRow, toCol) {
        const { row: fromRow, col: fromCol } = this.selectedCell;
        
        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
            // Calculate middle position
            const middleRow = (fromRow + toRow) / 2;
            const middleCol = (fromCol + toCol) / 2;
            
            // Make the move
            this.board[fromRow][fromCol] = 2; // Original position becomes hole
            this.board[middleRow][middleCol] = 2; // Jumped marble becomes hole
            this.board[toRow][toCol] = 1; // Target position gets the marble
            
            this.marbleCount--;
            this.moveCount++;
            this.selectedCell = null;
            
            this.updateDisplay();
            this.renderBoard();
            
            // Check if game is over
            setTimeout(() => {
                if (!this.hasValidMoves()) {
                    this.endGame();
                }
            }, 300);
        } else {
            // Invalid move, deselect
            this.selectedCell = null;
            this.renderBoard();
        }
    }
    
    hasValidMoves() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 1) {
                    // Check all four directions
                    const directions = [
                        { dr: -2, dc: 0 },
                        { dr: 2, dc: 0 },
                        { dr: 0, dc: -2 },
                        { dr: 0, dc: 2 }
                    ];
                    
                    for (const dir of directions) {
                        const targetRow = row + dir.dr;
                        const targetCol = col + dir.dc;
                        
                        if (this.isValidMove(row, col, targetRow, targetCol)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    endGame() {
        this.gameOver = true;
        this.finalMarbles.textContent = this.marbleCount;
        this.finalMoves.textContent = this.moveCount;
        
        // Determine result message
        let title = 'Game Over!';
        let message = '';
        
        if (this.marbleCount === 1) {
            title = '🏆 You\'re a Genius!';
            message = 'Perfect! You finished with just one marble!';
        } else if (this.marbleCount === 2) {
            title = '🌟 Very Intelligent!';
            message = 'Excellent work! Only 2 marbles left!';
        } else if (this.marbleCount === 3) {
            title = '⭐ Intelligent!';
            message = 'Great job! You left 3 marbles.';
        } else {
            title = '💪 More Practice!';
            message = `You finished with ${this.marbleCount} marbles. Try again!`;
        }
        
        this.resultTitle.textContent = title;
        this.resultMessage.textContent = message;
        this.gameOverMessage.classList.remove('hidden');
    }
    
    updateDisplay() {
        this.marblesDisplay.textContent = this.marbleCount;
        this.movesDisplay.textContent = this.moveCount;
    }
    
    setupEventListeners() {
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.initializeGame();
        });
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.initializeGame();
        });
    }
    
    setupInstructionsToggle() {
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
    new MarbleSolitaire();
});
