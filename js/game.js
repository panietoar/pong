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
    Global.playerScore = 0;
    Global.aiScore = 0;
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
  }
  
  update(timeDelta) {
    if (Global.newRound) {
      this.ball = Ball.createBall(Global.lastScorer);
      Global.newRound = false;
    }
    this.ball && this.ball.update(timeDelta);
    Global.ballPosition = this.ball && this.ball.position.y;
    this.paddles.forEach(object => object.update(timeDelta));
    this.checkCollisions();
    this.checkVictory();
  }

  draw() {
    this.drawScore();
    this.paddles.forEach(object => object.draw(this.context));
    this.ball && this.ball.draw(context);
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

  checkVictory() {
    if(Global.playerScore === 2 || Global.aiScore === 2) {
      this.endGame();
    }
  }

  endGame() {
    this.paddles = [];
    this.ball = null;

    this.context.save();

    this.context.font = '64px sans-serif';
    this.context.fillStyle = 'grey';
    this.context.fillText(`Player ${Global.lastScorer + 1} Won!`, 200, 280);

    this.context.restore();

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
