class SlidingPuzzle {
    constructor() {
        this.grid = [];
        this.emptyPos = { row: 2, col: 2 };
        this.moves = 0;
        this.gridElement = document.getElementById('puzzle-grid');
        this.movesElement = document.getElementById('moves');
        this.winMessage = document.getElementById('win-message');
        this.finalMovesElement = document.getElementById('final-moves');
        
        this.init();
        this.setupEventListeners();
        this.setupInstructionsToggle();
    }
    
    init() {
        this.grid = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 0]
        ];
        this.emptyPos = { row: 2, col: 2 };
        this.moves = 0;
        this.updateMovesDisplay();
        this.shuffle();
        this.render();
    }
    
    setupEventListeners() {
        document.getElementById('shuffle-btn').addEventListener('click', () => {
            this.winMessage.classList.add('hidden');
            this.init();
        });
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.winMessage.classList.add('hidden');
            this.init();
        });
    }
    
    shuffle() {
        const moves = 100;
        for (let i = 0; i < moves; i++) {
            const validMoves = this.getValidMoves();
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            this.swapTiles(randomMove.row, randomMove.col, false);
        }
        this.moves = 0;
        this.updateMovesDisplay();
    }
    
    getValidMoves() {
        const moves = [];
        const { row, col } = this.emptyPos;
        
        if (row > 0) moves.push({ row: row - 1, col });
        if (row < 2) moves.push({ row: row + 1, col });
        if (col > 0) moves.push({ row, col: col - 1 });
        if (col < 2) moves.push({ row, col: col + 1 });
        
        return moves;
    }
    
    isValidMove(row, col) {
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    swapTiles(row, col, countMove = true) {
        if (!this.isValidMove(row, col)) return false;
        
        const temp = this.grid[row][col];
        this.grid[row][col] = this.grid[this.emptyPos.row][this.emptyPos.col];
        this.grid[this.emptyPos.row][this.emptyPos.col] = temp;
        
        this.emptyPos = { row, col };
        
        if (countMove) {
            this.moves++;
            this.updateMovesDisplay();
        }
        
        return true;
    }
    
    handleTileClick(row, col) {
        if (this.grid[row][col] === 0) return;
        
        if (this.swapTiles(row, col)) {
            this.render();
            
            if (this.checkWin()) {
                setTimeout(() => {
                    this.showWinMessage();
                }, 300);
            }
        }
    }
    
    checkWin() {
        const target = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 0]
        ];
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[i][j] !== target[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    showWinMessage() {
        this.finalMovesElement.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
    }
    
    updateMovesDisplay() {
        this.movesElement.textContent = this.moves;
    }
    
    render() {
        this.gridElement.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                const value = this.grid[i][j];
                
                if (value === 0) {
                    tile.classList.add('empty');
                } else {
                    tile.textContent = value;
                    
                    if (this.isValidMove(i, j)) {
                        tile.classList.add('clickable');
                    }
                    
                    tile.addEventListener('click', () => this.handleTileClick(i, j));
                }
                
                this.gridElement.appendChild(tile);
            }
        }
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
    new SlidingPuzzle();
});
