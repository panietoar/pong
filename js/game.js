class Game {
  constructor(context) {
    this.context = context;
    this.gameObjects = [];

    this.initGame();
  }

  initGame() {
    let playerPaddle = new Paddle(20, 0);
    playerPaddle.behavior = new PlayerBehavior();

    let aiPaddle = new Paddle(MAX_WIDTH - PADDLE_WIDTH - 20, 0);
    aiPaddle.behavior = new AIBehavior();

    let ball = new Ball(0, 0, 2.5, new Vector2D(1, 1));

    this.gameObjects.push(playerPaddle, aiPaddle, ball);
  }

  nextFrame(timeDelta) {
    this.update(timeDelta);
    this.draw();
  }

  update(timeDelta) {
    this.gameObjects.forEach(object => object.update(timeDelta));
  }

  draw() {
    this.gameObjects.forEach(object => object.draw(this.context));
  }

  clearCanvas() {
    this.context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGTH);
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
