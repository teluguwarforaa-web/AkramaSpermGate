const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const resultScreen = document.getElementById("resultScreen");
const finalScore = document.getElementById("finalScore");

const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");

// IMAGES
const spermImg = new Image();
spermImg.src = "sperm.png";

const gateTopImg = new Image();
gateTopImg.src = "gateTop.png";

const gateBottomImg = new Image();
gateBottomImg.src = "gateBottom.png";

let gameStarted = false;
let score = 0;

let sperm = {};
let gates = [];

function resetGame() {
  sperm = {
    x: 80,
    y: canvas.height / 2,
    gravity: 0.5,
    velocity: 0,
    lift: -10
  };

  gates = [];
  score = 0;
  document.getElementById("score").innerText = "Babies: 0";
}

resetGame();

// mobile audio fix
document.body.addEventListener("click", () => {
  bgMusic.load();
  victorySound.load();
}, { once: true });

startBtn.onclick = () => {
  startScreen.style.display = "none";
  resultScreen.style.display = "none";

  resetGame();
  gameStarted = true;

  bgMusic.currentTime = 0;
  bgMusic.play();
};

restartBtn.onclick = () => {
  resultScreen.style.display = "none";

  resetGame();
  gameStarted = true;

  bgMusic.currentTime = 0;
  bgMusic.play();
};

canvas.addEventListener("click", () => {
  if (gameStarted) sperm.velocity = sperm.lift;
});

function createGate() {
  let gap = 180;
  let top = Math.random() * (canvas.height - gap - 100) + 50;

  gates.push({
    x: canvas.width,
    top: top,
    bottom: top + gap,
    width: 80,
    passed: false
  });
}

function update() {
  if (!gameStarted) return;

  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (Math.random() < 0.02) createGate();

  for (let g of gates) {
    g.x -= 3;

    // collision
    if (
      sperm.x + 20 > g.x &&
      sperm.x < g.x + g.width &&
      (sperm.y < g.top || sperm.y + 20 > g.bottom)
    ) {
      gameOver();
    }

    if (!g.passed && g.x + g.width < sperm.x) {
      g.passed = true;
      score++;
      document.getElementById("score").innerText = "Babies: " + score;
    }
  }

  if (sperm.y > canvas.height || sperm.y < 0) gameOver();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // sperm image
  ctx.drawImage(spermImg, sperm.x, sperm.y, 40, 40);

  // gate images
  for (let g of gates) {
    ctx.drawImage(gateTopImg, g.x, 0, g.width, g.top);
    ctx.drawImage(
      gateBottomImg,
      g.x,
      g.bottom,
      g.width,
      canvas.height - g.bottom
    );
  }
}

function gameOver() {
  gameStarted = false;

  bgMusic.pause();
  bgMusic.currentTime = 0;

  resultScreen.style.display = "flex";
  finalScore.innerText = "Final Babies: " + score;

  setTimeout(() => {
    victorySound.currentTime = 0;
    victorySound.play();
  }, 200);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
