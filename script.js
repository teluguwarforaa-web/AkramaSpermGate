const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// FULL SCREEN
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Images
const spermImg = new Image();
spermImg.src = "sperm.png";

const gateTop = new Image();
gateTop.src = "gate-top.png";

const gateBottom = new Image();
gateBottom.src = "gate-bottom.png";

// Game variables
let sperm = {
  x: 80,
  y: canvas.height / 2,
  radius: 20,
  gravity: 0.5,
  lift: -10,
  velocity: 0
};

let walls = [];
let frame = 0;
let babies = 0;
let gameOver = false;
let gameStarted = false;

// Audio
const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");

// Start screen
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

// Draw sperm
function drawSperm() {
  ctx.drawImage(
    spermImg,
    sperm.x - sperm.radius,
    sperm.y - sperm.radius,
    sperm.radius * 2,
    sperm.radius * 2
  );
}

// Update sperm
function updateSperm() {
  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (sperm.y > canvas.height || sperm.y < 0) {
    endGame();
  }
}

// Create gates
function createWall() {
  let gap = canvas.height * 0.25;
  let topHeight = Math.random() * (canvas.height - gap - 100) + 50;

  walls.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: canvas.width * 0.15,
    passed: false
  });
}

// Draw gates
function drawWalls() {
  walls.forEach(wall => {

    wall.x -= canvas.width * 0.005;

    ctx.drawImage(gateTop, wall.x, 0, wall.width, wall.top);

    ctx.drawImage(
      gateBottom,
      wall.x,
      wall.bottom,
      wall.width,
      canvas.height - wall.bottom
    );

    // Collision
    if (
      sperm.x + sperm.radius > wall.x &&
      sperm.x - sperm.radius < wall.x + wall.width &&
      (sperm.y < wall.top || sperm.y > wall.bottom)
    ) {
      endGame();
    }

    // Score
    if (!wall.passed && wall.x + wall.width < sperm.x) {
      babies++;
      wall.passed = true;
      document.getElementById("score").innerText = "Babies: " + babies;

      if (babies % 10 === 0) {
        victorySound.play();
      }
    }
  });

  walls = walls.filter(w => w.x + w.width > 0);
}

// Jump
function swim() {
  if (!gameStarted) return;
  sperm.velocity = sperm.lift;
  bgMusic.play();
}

// End game
function endGame() {
  gameOver = true;
  bgMusic.pause();
  victorySound.play();

  setTimeout(() => {
    alert("Journey ended! Babies: " + babies);
    location.reload();
  }, 200);
}

// Game loop
function gameLoop() {
  if (!gameStarted || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateSperm();
  drawSperm();

  if (frame % 90 === 0) {
    createWall();
  }

  drawWalls();

  frame++;
  requestAnimationFrame(gameLoop);
}

// Start button
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameStarted = true;
  gameLoop();
});

// Controls
document.addEventListener("click", swim);
document.addEventListener("touchstart", swim);
