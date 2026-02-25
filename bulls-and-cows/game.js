class BullsAndCowsGame {
    constructor() {
        this.codeLength = 4;
        this.secretCode = [];
        this.currentGuess = [0, 0, 0, 0];
        this.attempts = 0;
        this.gameWon = false;

        this.attemptsDisplay = document.getElementById('attempts');
        this.attemptsHistory = document.getElementById('attempts-history');
        this.winMessage = document.getElementById('win-message');
        this.finalAttemptsDisplay = document.getElementById('final-attempts');
        this.submitBtn = document.getElementById('submit-btn');
        this.digitBoxes = document.querySelectorAll('.digit-box');

        this.initializeGame();
        this.setupEventListeners();
        this.setupInstructionsToggle();
    }

    initializeGame() {
        this.attempts = 0;
        this.currentGuess = [0, 0, 0, 0];
        this.gameWon = false;
        this.updateAttemptsDisplay();
        this.winMessage.classList.add('hidden');
        this.attemptsHistory.innerHTML = '<p class="empty-state">No attempts yet</p>';
        this.generateSecretCode();
        this.updateDigitDisplay();
    }

    generateSecretCode() {
        // TEMP: Fixed code for testing - 2, 7, 4, 9
        this.secretCode = [2, 7, 4, 9];
        return;
        
        // Original random generation (commented out for testing)
        // this.secretCode = [];
        // for (let i = 0; i < this.codeLength; i++) {
        //     this.secretCode.push(Math.floor(Math.random() * 10));
        // }
    }

    setupEventListeners() {
        this.digitBoxes.forEach((box, index) => {
            box.addEventListener('click', () => {
                box.focus();
            });

            box.addEventListener('keydown', (e) => {
                if (this.gameWon) return;

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.incrementDigit(index);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.decrementDigit(index);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (index > 0) {
                        this.digitBoxes[index - 1].focus();
                    }
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (index < this.digitBoxes.length - 1) {
                        this.digitBoxes[index + 1].focus();
                    }
                } else if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    this.setDigit(index, parseInt(e.key));
                }
            });

            const upBtn = box.querySelector('.digit-up');
            const downBtn = box.querySelector('.digit-down');

            upBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.gameWon) {
                    this.incrementDigit(index);
                }
            });

            downBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.gameWon) {
                    this.decrementDigit(index);
                }
            });
        });

        this.submitBtn.addEventListener('click', () => {
            if (!this.gameWon) {
                this.submitGuess();
            }
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.gameWon) {
                this.submitGuess();
            }
        });
    }

    incrementDigit(index) {
        this.currentGuess[index] = (this.currentGuess[index] + 1) % 10;
        this.updateDigitDisplay();
    }

    decrementDigit(index) {
        this.currentGuess[index] = (this.currentGuess[index] - 1 + 10) % 10;
        this.updateDigitDisplay();
    }

    setDigit(index, value) {
        this.currentGuess[index] = value;
        this.updateDigitDisplay();
    }

    updateDigitDisplay() {
        this.digitBoxes.forEach((box, index) => {
            const digitValue = box.querySelector('.digit-value');
            digitValue.textContent = this.currentGuess[index];
        });
    }

    submitGuess() {
        this.attempts++;
        this.updateAttemptsDisplay();

        const feedback = this.calculateFeedback();
        this.displayAttempt(this.currentGuess.slice(), feedback);

        if (feedback.bulls === this.codeLength) {
            this.gameWon = true;
            this.showWinMessage();
        }
    }

    calculateFeedback() {
        let bulls = 0;
        let cows = 0;
        const secretCopy = [...this.secretCode];
        const guessCopy = [...this.currentGuess];

        for (let i = 0; i < this.codeLength; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                bulls++;
                secretCopy[i] = -1;
                guessCopy[i] = -2;
            }
        }

        for (let i = 0; i < this.codeLength; i++) {
            if (guessCopy[i] >= 0) {
                const index = secretCopy.indexOf(guessCopy[i]);
                if (index !== -1) {
                    cows++;
                    secretCopy[index] = -1;
                }
            }
        }

        return { bulls, cows };
    }

    displayAttempt(guess, feedback) {
        if (this.attemptsHistory.querySelector('.empty-state')) {
            this.attemptsHistory.innerHTML = '';
        }

        const attemptItem = document.createElement('div');
        attemptItem.className = 'attempt-item';
        if (feedback.bulls === this.codeLength) {
            attemptItem.classList.add('winning');
        }

        const guessDiv = document.createElement('div');
        guessDiv.className = 'attempt-guess';
        guess.forEach(digit => {
            const digitSpan = document.createElement('div');
            digitSpan.className = 'attempt-digit';
            digitSpan.textContent = digit;
            guessDiv.appendChild(digitSpan);
        });

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'attempt-feedback';

        const bullsRow = document.createElement('div');
        bullsRow.className = 'feedback-row feedback-bulls';
        bullsRow.innerHTML = `<span class="bull-icon">🐂</span> ${feedback.bulls} Bull${feedback.bulls !== 1 ? 's' : ''}`;
        feedbackDiv.appendChild(bullsRow);

        const cowsRow = document.createElement('div');
        cowsRow.className = 'feedback-row feedback-cows';
        cowsRow.innerHTML = `<span class="cow-icon">🐄</span> ${feedback.cows} Cow${feedback.cows !== 1 ? 's' : ''}`;
        feedbackDiv.appendChild(cowsRow);

        attemptItem.appendChild(guessDiv);
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
    new BullsAndCowsGame();
});
