# 🎮 CrashDown

CrashDown is a colorful grid-based puzzle game built with vanilla JavaScript, HTML, and CSS. Click on matching adjacent blocks to clear them, earn points, and survive as new rows crash down from the top.

---

## 🚀 Features

- ✅ Dynamic 10x10 interactive grid
- 🎨 Four colored block types (red, green, blue, yellow)
- 🧠 Chain-matching logic using flood fill
- ⏱️ Live timer and score tracker
- 🔊 Sound effects and background music toggle (press `M`)
- 🏆 Leaderboard stored in localStorage (top 5 scores)
- 📈 Next incoming row preview
- 📉 Gravity and auto-centering of remaining blocks

---

## 🧩 Gameplay

1. **Objective:** Match and remove adjacent blocks of the same color (minimum of 2).
2. **Turns:** You get 3 clicks. Then a new row appears from the bottom.
3. **Game Over:** When the grid is completely filled.
4. **Scoring:** Each block removed increases your score by 1.
5. **Music Toggle:** Press `M` to start or pause the background music.

---

## 🛠️ Setup & Usage

### 🔧 Requirements
- A modern browser (Chrome, Firefox, Edge, Safari)
- No external dependencies

### ▶️ Running the Game

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Enter your name to start playing.
