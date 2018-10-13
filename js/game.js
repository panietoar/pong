class Game {
  constructor(context) {
    this.context = context;
    this.paddles = [];
    this.ball = null;
    this.initGame();
    this.previous = undefined;
    this.elapsed = 0;
  }

  initGame() {
    this.paddles = [];
    let playerPaddle = new Paddle(20, 0);
    playerPaddle.behavior = new PlayerBehavior();

    let aiPaddle = new Paddle(MAX_WIDTH - PADDLE_WIDTH - 20, 400);
    aiPaddle.behavior = new AIBehavior(aiPaddle);

    this.ball = Ball.createBall(0);

    this.paddles.push(playerPaddle, aiPaddle);
    window.requestAnimationFrame(this.frame.bind(this));
  }

  nextFrame(timeDelta) {
    this.update(timeDelta);
    this.draw();
    Global.ballPosition = this.ball.position.y;
  }

  update(timeDelta) {
    if (Global.newRound) {
      this.ball = Ball.createBall(0);
      Global.newRound = false;
    }
    this.ball.update(timeDelta);
    this.paddles.forEach(object => object.update(timeDelta));
    this.checkCollisions();
  }

  draw() {
    this.drawScore();
    this.paddles.forEach(object => object.draw(this.context));
    this.ball.draw(context);
  }

  checkCollisions() {
    const collision = this.paddles.some(paddle => {
      return Box2D.intersects(
        this.ball.collisionBox,
        paddle.collisionBox
      );
    });

    if (collision) {
      this.ball.paddleCollision();
    }
  }

  drawScore() {
    this.context.save();

    this.context.font = '48px sans-serif';
    this.context.fillStyle = 'grey';
    this.context.fillText(Global.playerScore, 190, 75);
    this.context.fillText(Global.aiScore, 590, 75);

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

  frame(timestamp) {
    this.clearCanvas();

    if (!this.previous) {
      this.previous = timestamp;
    }

    this.elapsed = timestamp - this.previous;
    const timeDelta = this.elapsed / 1000;
    this.nextFrame(timeDelta);
    this.previous = timestamp;
    window.requestAnimationFrame(this.frame.bind(this));
  }
}

let context = CANVAS.getContext('2d');
let game = new Game(context);

RESET_BUTTON.addEventListener('click', event => {
  Global.playerScore = 0;
  Global.aiScore = 0;
  game.initGame();
});
