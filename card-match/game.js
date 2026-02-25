class CardMatchGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.canFlip = true;
        this.difficulty = 'easy';
        
        this.allSymbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎹', '🎲', '🎰', '🎳', '🎬', '⚽', '🏀', '⚾', '🎾', '🏈', '🏐'];
        this.cardSymbols = [];
        
        this.difficultySettings = {
            easy: { pairs: 8, gridClass: 'easy' },
            medium: { pairs: 15, gridClass: 'medium' },
            hard: { pairs: 18, gridClass: 'hard' }
        };
        
        this.cardGrid = document.getElementById('card-grid');
        this.movesDisplay = document.getElementById('moves');
        this.matchesDisplay = document.getElementById('matches');
        this.winMessage = document.getElementById('win-message');
        this.finalMovesDisplay = document.getElementById('final-moves');
        
        this.initializeGame();
        this.setupEventListeners();
        this.setupDifficultyButtons();
        this.setupInstructionsToggle();
    }
    
    initializeGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.canFlip = true;
        
        const pairCount = this.difficultySettings[this.difficulty].pairs;
        this.cardSymbols = this.allSymbols.slice(0, pairCount);
        
        this.updateDisplay();
        this.winMessage.classList.add('hidden');
        this.updateGridClass();
        this.createCards();
        this.shuffleCards();
        this.renderCards();
    }
    
    createCards() {
        this.cards = [];
        this.cardSymbols.forEach((symbol, index) => {
            this.cards.push({ id: index * 2, symbol: symbol, matched: false });
            this.cards.push({ id: index * 2 + 1, symbol: symbol, matched: false });
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderCards() {
        this.cardGrid.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">?</div>
                    <div class="card-face card-back">${card.symbol}</div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => this.handleCardClick(index));
            this.cardGrid.appendChild(cardElement);
        });
    }
    
    handleCardClick(index) {
        if (!this.canFlip) return;
        
        const card = this.cards[index];
        const cardElement = this.cardGrid.children[index];
        
        if (card.matched || cardElement.classList.contains('flipped')) return;
        
        if (this.flippedCards.length < 2) {
            cardElement.classList.add('flipped');
            this.flippedCards.push({ card, element: cardElement, index });
            
            if (this.flippedCards.length === 2) {
                this.moves++;
                this.updateDisplay();
                this.checkMatch();
            }
        }
    }
    
    checkMatch() {
        this.canFlip = false;
        const [first, second] = this.flippedCards;
        
        if (first.card.symbol === second.card.symbol) {
            setTimeout(() => {
                first.element.classList.add('matched');
                second.element.classList.add('matched');
                first.card.matched = true;
                second.card.matched = true;
                
                this.matchedPairs++;
                this.updateDisplay();
                this.flippedCards = [];
                this.canFlip = true;
                
                if (this.matchedPairs === this.cardSymbols.length) {
                    setTimeout(() => this.showWinMessage(), 500);
                }
            }, 500);
        } else {
            setTimeout(() => {
                first.element.classList.remove('flipped');
                second.element.classList.remove('flipped');
                this.flippedCards = [];
                this.canFlip = true;
            }, 1000);
        }
    }
    
    updateDisplay() {
        this.movesDisplay.textContent = this.moves;
        this.matchesDisplay.textContent = `${this.matchedPairs}/${this.cardSymbols.length}`;
    }
    
    showWinMessage() {
        this.finalMovesDisplay.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
    }
    
    updateGridClass() {
        const gridClass = this.difficultySettings[this.difficulty].gridClass;
        this.cardGrid.className = `card-grid ${gridClass}`;
    }
    
    setupDifficultyButtons() {
        const buttons = document.querySelectorAll('.difficulty-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
                this.initializeGame();
            });
        });
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
    new CardMatchGame();
});
