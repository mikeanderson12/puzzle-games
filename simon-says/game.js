class SimonGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.highScore = localStorage.getItem('simonHighScore') || 0;
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.isShowingSequence = false;
        
        // Audio context for sound generation
        this.audioContext = null;
        this.sounds = [329.63, 261.63, 220.00, 164.81]; // E4, C4, A3, E3
        
        this.buttons = document.querySelectorAll('.simon-button');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.levelDisplay = document.getElementById('level-count');
        this.scoreDisplay = document.getElementById('current-score');
        this.highScoreDisplay = document.getElementById('high-score');
        this.messageDisplay = document.getElementById('message');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.finalLevel = document.getElementById('final-level');
        this.finalScore = document.getElementById('final-score');
        this.finalMessage = document.getElementById('final-message');
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.setupEventListeners();
        this.setupInstructionsToggle();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.isPlayerTurn) {
                    const color = button.dataset.color;
                    const index = parseInt(button.dataset.sound);
                    this.handlePlayerInput(color, index);
                }
            });
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
    
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playSound(frequency, duration = 300) {
        this.initAudio();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
    
    playErrorSound() {
        this.initAudio();
        
        // Create a buzzer-style "ehhhhhh" sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 150; // Low buzzer frequency
        
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        
        oscillator.start(now);
        oscillator.stop(now + 0.8);
    }
    
    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.isPlaying = true;
        
        this.startBtn.classList.add('hidden');
        this.gameOverMessage.classList.add('hidden');
        this.showMessage('Watch carefully!');
        
        this.updateDisplay();
        this.nextRound();
    }
    
    nextRound() {
        if (this.isShowingSequence || !this.isPlaying) return;
        
        this.playerSequence = [];
        this.isPlayerTurn = false;
        this.isShowingSequence = true;
        this.addToSequence();
        
        setTimeout(() => {
            this.playSequence();
        }, 1000);
    }
    
    addToSequence() {
        const randomIndex = Math.floor(Math.random() * 4);
        this.sequence.push(randomIndex);
    }
    
    async playSequence() {
        this.isShowingSequence = true;
        this.disableButtons();
        this.showMessage('Watch carefully!');
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.wait(200);
            await this.lightUpButton(this.sequence[i]);
        }
        
        this.enableButtons();
        this.isPlayerTurn = true;
        this.isShowingSequence = false;
        this.showMessage('Your turn!');
    }
    
    async lightUpButton(index) {
        const button = this.buttons[index];
        const frequency = this.sounds[index];
        
        button.classList.add('active');
        this.playSound(frequency);
        
        await this.wait(400);
        
        button.classList.remove('active');
    }
    
    async handlePlayerInput(color, index) {
        // Prevent multiple inputs while processing
        if (!this.isPlayerTurn) return;
        
        this.playerSequence.push(index);
        await this.lightUpButton(index);
        
        const currentStep = this.playerSequence.length - 1;
        
        // Check if the player's input matches the sequence
        if (this.playerSequence[currentStep] !== this.sequence[currentStep]) {
            this.isPlayerTurn = false;
            this.playErrorSound();
            this.gameOver(false);
            return;
        }
        
        // Increment score for correct button press
        this.score++;
        this.updateDisplay();
        
        // Check if player completed the sequence
        if (this.playerSequence.length === this.sequence.length) {
            this.isPlayerTurn = false;
            this.disableButtons();
            this.showMessage('Correct! Next level...');
            
            this.level++;
            this.updateDisplay();
            
            setTimeout(() => {
                this.nextRound();
            }, 800);
        }
    }
    
    gameOver(won = false) {
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.disableButtons();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('simonHighScore', this.highScore);
            this.updateDisplay();
        }
        
        this.finalLevel.textContent = this.level;
        this.finalScore.textContent = this.score;
        
        if (won) {
            this.finalMessage.textContent = 'Congratulations! You won!';
        } else {
            this.finalMessage.textContent = 'Oops! Wrong button. Try again!';
        }
        
        this.showMessage('Game Over!');
        this.gameOverMessage.classList.remove('hidden');
    }
    
    resetGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.isShowingSequence = false;
        
        this.startBtn.classList.remove('hidden');
        this.gameOverMessage.classList.add('hidden');
        this.hideMessage();
        this.enableButtons();
        this.updateDisplay();
    }
    
    disableButtons() {
        this.buttons.forEach(button => {
            button.classList.add('disabled');
        });
    }
    
    enableButtons() {
        this.buttons.forEach(button => {
            button.classList.remove('disabled');
        });
    }
    
    showMessage(text) {
        this.messageDisplay.textContent = text;
        this.messageDisplay.classList.remove('hidden');
    }
    
    hideMessage() {
        this.messageDisplay.classList.add('hidden');
    }
    
    updateDisplay() {
        this.levelDisplay.textContent = this.level;
        this.scoreDisplay.textContent = this.score;
        this.highScoreDisplay.textContent = this.highScore;
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimonGame();
});
