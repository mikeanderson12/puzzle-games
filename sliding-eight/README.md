# Sliding 8 Puzzle

A fun and interactive 3×3 sliding puzzle game built with vanilla HTML, CSS, and JavaScript. Test your problem-solving skills by arranging numbered tiles in order!

Enjoy the puzzle! 🧩


## How to Play

### Objective
Arrange the tiles in numerical order from 1 to 8, with the empty space in the bottom-right corner:

```
1 2 3
4 5 6
7 8 □
```

### Rules
1. The puzzle consists of a 3×3 grid with eight numbered tiles (1-8) and one empty space
2. You can slide any tile that is **adjacent** to the empty space (up, down, left, or right)
3. Click on a tile next to the empty space to slide it into that space
4. The tile's previous position becomes the new empty space
5. Continue sliding tiles until you achieve the goal configuration

### Tips
- Only tiles directly adjacent to the empty space can be moved (no diagonal moves)
- The puzzle starts in a shuffled but solvable configuration
- Your move count is tracked - try to solve it in as few moves as possible!
- Click "New Game" to shuffle and start over


## How to Start

### Option 1: Open Directly in Browser
1. Navigate to the project folder
2. Double-click `index.html` or right-click and select "Open with" your preferred browser

### Option 2: From Terminal/Command Line
```bash
# Navigate to the project directory
cd /path/to/sliding-eight

# macOS
open index.html

# Windows
start index.html
```


## Project Structure

```
sliding-eight/
├── index.html      # Main HTML structure
├── styles.css      # Styling and animations
├── script.js       # Game logic and functionality
└── README.md       # This file
```

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Move Counter**: Tracks the number of moves you make
- **Auto-Shuffle**: Puzzle is automatically shuffled at the start using valid moves (ensuring it's always solvable)
- **Win Detection**: Automatically detects when you've solved the puzzle
- **Modern UI**: Beautiful gradient design with smooth animations
- **New Game Button**: Start a fresh puzzle anytime

## Technical Details

- **No Dependencies**: Built with pure HTML, CSS, and JavaScript
- **No Build Process**: Just open and play
- **Browser Compatibility**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## Game Strategy

The 8-puzzle is a classic problem in computer science and AI. Here are some strategies:

- **Corner-First**: Try to get the corners in place first
- **Row-by-Row**: Solve the top row, then the middle row, then the bottom
- **Think Ahead**: Plan your moves several steps in advance
- **Practice**: The more you play, the better you'll recognize patterns


## Example

![Example](slide8.png)