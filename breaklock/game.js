class BreakLockGame {
    constructor() {
        this.gridSize = 3;
        this.dots = [];
        this.secretPattern = [];
        this.currentPattern = [];
        this.attempts = 0;
        this.difficulty = 'easy';
        this.patternLengths = {
            easy: 4,
            medium: 5,
            hard: 6
        };
        this.isDrawing = false;
        this.gameWon = false;

        this.dotGrid = document.getElementById('dot-grid');
        this.canvas = document.getElementById('pattern-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.attemptsDisplay = document.getElementById('attempts');
        this.currentPatternDisplay = document.getElementById('current-pattern-display');
        this.attemptsHistory = document.getElementById('attempts-history');
        this.winMessage = document.getElementById('win-message');
        this.finalAttemptsDisplay = document.getElementById('final-attempts');
        this.submitBtn = document.getElementById('submit-btn');
        this.clearBtn = document.getElementById('clear-btn');

        this.initializeCanvas();
        this.initializeGame();
        this.setupEventListeners();
        this.setupInstructionsToggle();
    }

    initializeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        window.addEventListener('resize', () => {
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.redrawPattern();
        });
    }

    initializeGame() {
        this.attempts = 0;
        this.currentPattern = [];
        this.gameWon = false;
        this.updateAttemptsDisplay();
        this.winMessage.classList.add('hidden');
        this.attemptsHistory.innerHTML = '<p class="empty-state">No attempts yet</p>';
        this.clearCanvas();
        this.createDotGrid();
        this.setupDotListeners();
        this.generateSecretPattern();
        this.updateCurrentPatternDisplay();
        this.submitBtn.disabled = true;
    }

    createDotGrid() {
        this.dotGrid.innerHTML = '';
        this.dots = [];

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.dataset.row = row;
                dot.dataset.col = col;
                dot.dataset.index = row * this.gridSize + col;
                
                this.dotGrid.appendChild(dot);
                this.dots.push(dot);
            }
        }
    }

    generateSecretPattern() {
        const patternLength = this.patternLengths[this.difficulty];
        const availableDots = Array.from({length: 9}, (_, i) => i);
        this.secretPattern = [];

        for (let i = 0; i < patternLength; i++) {
            const randomIndex = Math.floor(Math.random() * availableDots.length);
            this.secretPattern.push(availableDots[randomIndex]);
            availableDots.splice(randomIndex, 1);
        }
    }

    setupDotListeners() {
        this.dots.forEach(dot => {
            dot.addEventListener('mousedown', (e) => this.startDrawing(e));
            dot.addEventListener('mouseenter', (e) => this.continueDrawing(e));
            dot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startDrawing(e);
            });
            dot.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.classList.contains('dot')) {
                    this.continueDrawing({target: element});
                }
            });
        });
    }

    setupEventListeners() {
        this.setupDotListeners();

        document.addEventListener('mouseup', () => this.stopDrawing());
        document.addEventListener('touchend', () => this.stopDrawing());

        this.submitBtn.addEventListener('click', () => this.submitPattern());
        this.clearBtn.addEventListener('click', () => this.clearPattern());

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.gameWon) return;
                
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.initializeGame();
            });
        });
    }

    startDrawing(e) {
        if (this.gameWon) return;
        
        this.isDrawing = true;
        const dotIndex = parseInt(e.target.dataset.index);
        
        if (!this.currentPattern.includes(dotIndex)) {
            this.currentPattern.push(dotIndex);
            e.target.classList.add('selected', 'active');
            this.updateCurrentPatternDisplay();
            this.redrawPattern();
            this.checkSubmitButton();
        }
    }

    continueDrawing(e) {
        if (!this.isDrawing || this.gameWon) return;
        
        const dotIndex = parseInt(e.target.dataset.index);
        const patternLength = this.patternLengths[this.difficulty];
        
        if (!this.currentPattern.includes(dotIndex) && this.currentPattern.length < patternLength) {
            this.currentPattern.push(dotIndex);
            e.target.classList.add('selected', 'active');
            this.updateCurrentPatternDisplay();
            this.redrawPattern();
            this.checkSubmitButton();
        }
    }

    stopDrawing() {
        this.isDrawing = false;
        this.dots.forEach(dot => dot.classList.remove('active'));
    }

    clearPattern() {
        this.currentPattern = [];
        this.dots.forEach(dot => dot.classList.remove('selected', 'active'));
        this.updateCurrentPatternDisplay();
        this.clearCanvas();
        this.checkSubmitButton();
    }

    checkSubmitButton() {
        const patternLength = this.patternLengths[this.difficulty];
        this.submitBtn.disabled = this.currentPattern.length !== patternLength;
    }

    updateCurrentPatternDisplay() {
        if (this.currentPattern.length === 0) {
            this.currentPatternDisplay.textContent = 'Draw a pattern to begin';
            this.currentPatternDisplay.classList.remove('has-pattern');
        } else {
            this.currentPatternDisplay.innerHTML = this.currentPattern
                .map(index => `<span>${index + 1}</span>`)
                .join(' → ');
            this.currentPatternDisplay.classList.add('has-pattern');
        }
    }

    redrawPattern() {
        this.clearCanvas();
        
        if (this.currentPattern.length < 2) return;

        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        this.ctx.strokeStyle = gradient;

        this.ctx.beginPath();
        
        for (let i = 0; i < this.currentPattern.length; i++) {
            const dotIndex = this.currentPattern[i];
            const dot = this.dots[dotIndex];
            const rect = dot.getBoundingClientRect();
            const containerRect = this.canvas.getBoundingClientRect();
            
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    submitPattern() {
        if (this.gameWon) return;
        
        this.attempts++;
        this.updateAttemptsDisplay();

        const feedback = this.calculateFeedback();
        this.displayAttempt(this.currentPattern.slice(), feedback);

        if (feedback.correct === this.patternLengths[this.difficulty]) {
            this.gameWon = true;
            this.showWinMessage();
        } else {
            this.clearPattern();
        }
    }

    calculateFeedback() {
        let correct = 0;
        let wrongPosition = 0;
        const secretCopy = [...this.secretPattern];
        const patternCopy = [...this.currentPattern];

        for (let i = 0; i < patternCopy.length; i++) {
            if (patternCopy[i] === secretCopy[i]) {
                correct++;
                secretCopy[i] = -1;
                patternCopy[i] = -2;
            }
        }

        for (let i = 0; i < patternCopy.length; i++) {
            if (patternCopy[i] >= 0) {
                const index = secretCopy.indexOf(patternCopy[i]);
                if (index !== -1) {
                    wrongPosition++;
                    secretCopy[index] = -1;
                }
            }
        }

        return { correct, wrongPosition };
    }

    displayAttempt(pattern, feedback) {
        if (this.attemptsHistory.querySelector('.empty-state')) {
            this.attemptsHistory.innerHTML = '';
        }

        const attemptItem = document.createElement('div');
        attemptItem.className = 'attempt-item';

        const patternDiv = document.createElement('div');
        patternDiv.className = 'attempt-pattern';
        patternDiv.innerHTML = pattern.map(index => `<span>${index + 1}</span>`).join(' → ');

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'attempt-feedback';
        
        for (let i = 0; i < feedback.correct; i++) {
            feedbackDiv.innerHTML += '<span class="feedback-correct">●</span>';
        }
        for (let i = 0; i < feedback.wrongPosition; i++) {
            feedbackDiv.innerHTML += '<span class="feedback-wrong-position">○</span>';
        }

        attemptItem.appendChild(patternDiv);
        attemptItem.appendChild(feedbackDiv);
        
        this.attemptsHistory.insertBefore(attemptItem, this.attemptsHistory.firstChild);
    }

    showWinMessage() {
        this.finalAttemptsDisplay.textContent = this.attempts;
        this.winMessage.classList.remove('hidden');
    }

    updateAttemptsDisplay() {
        this.attemptsDisplay.textContent = this.attempts;
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
    new BreakLockGame();
});
