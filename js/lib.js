let Global = {
  playerScore: 0,
  aiScore: 0,
  newRound: false,
  ballPosition: 0
}

class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Box2D {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static intersects(box1, box2) {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.height + box1.y > box2.y
    );
  }
}

class GameObject {
  constructor(positionX = 0, positionY = 0) {
    this.position = new Vector2D(positionX, positionY);
    this.width = 0;
    this.height = 0;
  }

  draw(context) {
    context.save();

    context.fillStyle = 'white';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
    context.restore();
  }

  update(timeDelta) {
    console.log('base object updated');
  }

  get collisionBox() {
    return new Box2D(this.position.x, this.position.y, this.width, this.height);
  }
}

class Paddle extends GameObject {
  constructor(positionX = 0, positionY = 0) {
    super(positionX, positionY);
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.behavior = null;
  }

  update() {
    let newPosition = this.behavior && this.behavior.getNewPosition();
    if (newPosition < MAX_HEIGTH - PADDLE_HEIGHT && newPosition > 0) {
      this.position.y = newPosition;
    }
  }
}

class Ball extends GameObject {
  constructor(
    positionX = 0,
    positionY = 0,
    speed = 1,
    direction = new Vector2D(0, 0)
  ) {
    super(positionX, positionY);
    this.width = BALL_SIZE;
    this.height = BALL_SIZE;
    this.direction = direction;
    this.speed = speed;
  }

  update(timeDelta) {
    this.speed = this.speed >= MAX_SPEED ? MAX_SPEED : this.speed;
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    this.checkBounds();
  }

  checkBounds() {
    if (this.position.x >= MAX_WIDTH) {
      Global.playerScore += 1;
      Global.newRound = true;
    }
    if (this.position.x <= 0) {
      Global.aiScore += 1;
      Global.newRound = true;
    }

    if (this.position.y >= MAX_HEIGTH || this.position.y <= 0) {
      this.direction = new Vector2D(this.direction.x, -1 * this.direction.y);
      this.speedUp();
    }
  }

  paddleCollision() {
    this.speedUp();
    this.reverseXDirection();
  }

  speedUp() {
    this.speed += 0.1;
  }

  reverseXDirection() {
    this.direction = new Vector2D(-1 * this.direction.x, this.direction.y);
  }

  static createBall(initialDirection) {
    return new Ball(
      MAX_WIDTH / 2,
      MAX_HEIGTH / 2,
      INITIAL_BALL_SPEED,
      randomDirections[initialDirection]
    );
  }
}

//utils
let randomDirections = [new Vector2D(-1, -1), new Vector2D(-1, 1)];
