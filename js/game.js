let playerScore = 0;
let aiScore = 0;
let newRound = false;
class Game {
  constructor(context) {
    this.context = context;
    this.paddles = [];
    this.currentBall = null;
    this.initGame();
  }

  initGame() {
    this.paddles = [];
    let playerPaddle = new Paddle(20, 0);
    playerPaddle.behavior = new PlayerBehavior();

    let aiPaddle = new Paddle(MAX_WIDTH - PADDLE_WIDTH - 20, 400);
    aiPaddle.behavior = new AIBehavior(aiPaddle);

    this.currentBall = new Ball(
      MAX_WIDTH / 2,
      MAX_HEIGTH / 2,
      5,
      getRandomDirection()
    );

    this.paddles.push(playerPaddle, aiPaddle);
  }

  nextFrame(timeDelta) {
    this.update(timeDelta);
    this.draw();
    ballPosition = this.currentBall.position.y;
  }

  update(timeDelta) {
    if (newRound) {
      this.currentBall = new Ball(
        MAX_WIDTH / 2,
        MAX_HEIGTH / 2,
        5,
        getRandomDirection()
      );
      newRound = false;
    }
    this.currentBall.update(timeDelta);
    this.paddles.forEach(object => object.update(timeDelta));
    this.checkCollisions();
  }

  draw() {
    this.drawScore();
    this.paddles.forEach(object => object.draw(this.context));
    this.currentBall.draw(context);
  }

  checkCollisions() {
    const collision = this.paddles.some(paddle => {
      return Box2D.intersects(
        this.currentBall.collisionBox,
        paddle.collisionBox
      );
    });

    if (collision) {
      this.currentBall.paddleCollision();
    }
  }

  drawScore() {
    this.context.save();

    this.context.font = '48px sans-serif';
    this.context.fillStyle = 'grey';
    this.context.fillText(playerScore, 190, 75);
    this.context.fillText(aiScore, 590, 75);

    this.context.restore();
  }

  clearCanvas() {
    this.context.save();
    this.context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGTH);
    this.context.strokeStyle = 'grey';
    this.context.beginPath();
    this.context.moveTo(MAX_WIDTH / 2, 0);
    this.context.lineTo(MAX_WIDTH / 2, MAX_HEIGTH);
    this.context.stroke();
    this.context.restore();
  }
}

let context = CANVAS.getContext('2d');
let game = new Game(context);
// Game loop
let previous, elapsed, timeDelta;
function frame(timestamp) {
  game.clearCanvas();

  if (!previous) {
    previous = timestamp;
  }

  elapsed = timestamp - previous;
  timeDelta = elapsed / 1000;
  game.nextFrame(timeDelta);
  previous = timestamp;
  window.requestAnimationFrame(frame);
}
window.requestAnimationFrame(frame);

RESET_BUTTON.addEventListener('click', event => {
  playerScore = 0;
  aiScore = 0;
  game.initGame();
});
