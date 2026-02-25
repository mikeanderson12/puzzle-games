class SudokuGame {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.givenCells = new Set();
        this.selectedCell = null;
        this.difficulty = 'easy';
        this.hintsRemaining = 0;
        this.mistakes = 0;
        this.timerSeconds = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        
        this.gridElement = document.getElementById('sudoku-grid');
        this.timerDisplay = document.getElementById('timer');
        this.hintsDisplay = document.getElementById('hints-count');
        this.mistakesDisplay = document.getElementById('mistakes-count');
        this.winMessage = document.getElementById('win-message');
        this.finalTime = document.getElementById('final-time');
        this.finalMistakes = document.getElementById('final-mistakes');
        this.newGameBtn = document.getElementById('new-game-btn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupInstructionsToggle();
        this.generatePuzzle();
        this.renderGrid();
        this.updateNewGameButtonStyle();
    }
    
    setupEventListeners() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });
        
        // Control buttons
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.giveHint());
        document.getElementById('check-btn').addEventListener('click', () => this.checkSolution());
        document.getElementById('play-again-btn').addEventListener('click', () => this.newGame());
        
        // Number pad
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const number = parseInt(btn.dataset.number);
                this.placeNumber(number);
            });
        });
        
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.selectedCell === null) return;
            
            if (e.key >= '1' && e.key <= '9') {
                this.placeNumber(parseInt(e.key));
            } else if (e.key === 'Delete' || e.key === 'Backspace' || e.key === '0') {
                this.placeNumber(0);
            }
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
    
    updateNewGameButtonStyle() {
        if (this.gameStarted && this.timerInterval) {
            // Timer is running - purple button
            this.newGameBtn.classList.remove('timer-stopped');
        } else {
            // Timer is stopped - red button
            this.newGameBtn.classList.add('timer-stopped');
        }
    }
    
    generatePuzzle() {
        // Generate a complete valid Sudoku solution
        this.solution = this.generateCompleteSudoku();
        
        // Copy solution to grid
        this.grid = this.solution.map(row => [...row]);
        
        // Remove numbers based on difficulty
        const cellsToRemove = {
            'easy': 35,
            'medium': 45,
            'hard': 55
        }[this.difficulty];
        
        this.givenCells.clear();
        const cellsToKeep = 81 - cellsToRemove;
        const positions = [];
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push([i, j]);
            }
        }
        
        // Shuffle positions
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // Keep only the required number of cells
        for (let i = 0; i < cellsToKeep; i++) {
            const [row, col] = positions[i];
            this.givenCells.add(`${row},${col}`);
        }
        
        // Clear non-given cells
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!this.givenCells.has(`${i},${j}`)) {
                    this.grid[i][j] = 0;
                }
            }
        }
    }
    
    generateCompleteSudoku() {
        const grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillGrid(grid);
        return grid;
    }
    
    fillGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    // Shuffle numbers
                    for (let i = numbers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                    }
                    
                    for (const num of numbers) {
                        if (this.isValidPlacement(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.fillGrid(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    isValidPlacement(grid, row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === num) return false;
        }
        
        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }
        
        return true;
    }
    
    renderGrid() {
        this.gridElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const value = this.grid[row][col];
                if (value !== 0) {
                    cell.textContent = value;
                }
                
                if (this.givenCells.has(`${row},${col}`)) {
                    cell.classList.add('given');
                }
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                
                this.gridElement.appendChild(cell);
            }
        }
        
        this.updateNumberButtons();
    }
    
    selectCell(row, col) {
        if (this.givenCells.has(`${row},${col}`)) return;
        
        this.selectedCell = { row, col };
        
        // Update visual selection
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        const cell = this.gridElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('selected');
        }
    }
    
    placeNumber(num) {
        if (this.selectedCell === null) return;
        
        const { row, col } = this.selectedCell;
        if (this.givenCells.has(`${row},${col}`)) return;
        
        this.grid[row][col] = num;
        
        const cell = this.gridElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = num === 0 ? '' : num;
            cell.classList.remove('error', 'correct', 'hint');
            
            // Check if placement is correct
            if (num !== 0 && num !== this.solution[row][col]) {
                cell.classList.add('error');
                this.mistakes++;
                this.updateDisplay();
            } else if (num !== 0) {
                cell.classList.add('correct');
            }
        }
        
        // Update number button states
        this.updateNumberButtons();
        
        // Check if puzzle is complete
        if (this.isPuzzleComplete()) {
            this.winGame();
        }
    }
    
    updateNumberButtons() {
        // Count how many of each number (1-9) are on the board
        const counts = Array(10).fill(0);
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = this.grid[row][col];
                if (num !== 0) {
                    counts[num]++;
                }
            }
        }
        
        // Update button states
        document.querySelectorAll('.number-btn').forEach(btn => {
            const num = parseInt(btn.dataset.number);
            if (num >= 1 && num <= 9) {
                if (counts[num] >= 9) {
                    btn.classList.add('completed');
                    btn.disabled = true;
                } else {
                    btn.classList.remove('completed');
                    btn.disabled = false;
                }
            }
        });
    }
    
    giveHint() {
        if (this.hintsRemaining <= 0) {
            alert('No hints remaining!');
            return;
        }
        
        // Find an empty cell
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0 && !this.givenCells.has(`${row},${col}`)) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) return;
        
        // Pick a random empty cell
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomCell;
        
        this.grid[row][col] = this.solution[row][col];
        this.hintsRemaining--;
        this.updateDisplay();
        
        const cell = this.gridElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = this.solution[row][col];
            cell.classList.add('hint');
            cell.classList.remove('error');
        }
        
        this.updateNumberButtons();
        
        if (this.isPuzzleComplete()) {
            this.winGame();
        }
    }
    
    checkSolution() {
        let hasErrors = false;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) continue;
                if (this.givenCells.has(`${row},${col}`)) continue;
                
                const cell = this.gridElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (this.grid[row][col] !== this.solution[row][col]) {
                    cell.classList.add('error');
                    cell.classList.remove('correct');
                    hasErrors = true;
                } else {
                    cell.classList.add('correct');
                    cell.classList.remove('error');
                }
            }
        }
        
        if (!hasErrors && this.isPuzzleComplete()) {
            alert('Perfect! All cells are correct!');
        } else if (!hasErrors) {
            alert('So far so good! Keep going!');
        } else {
            alert('Some cells are incorrect. They are marked in red.');
        }
    }
    
    isPuzzleComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) return false;
                if (this.grid[row][col] !== this.solution[row][col]) return false;
            }
        }
        return true;
    }
    
    winGame() {
        this.stopTimer();
        this.finalTime.textContent = this.timerDisplay.textContent;
        this.finalMistakes.textContent = this.mistakes;
        this.winMessage.classList.remove('hidden');
    }
    
    newGame() {
        this.stopTimer();
        this.timerSeconds = 0;
        this.hintsRemaining = 3;
        this.mistakes = 0;
        this.selectedCell = null;
        this.gameStarted = true;
        this.winMessage.classList.add('hidden');
        
        this.generatePuzzle();
        this.renderGrid();
        this.updateDisplay();
        this.startTimer();
        this.updateNewGameButtonStyle();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.updateNewGameButtonStyle();
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateDisplay() {
        this.hintsDisplay.textContent = this.hintsRemaining;
        this.mistakesDisplay.textContent = this.mistakes;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
