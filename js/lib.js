class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
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
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    this.checkBounds();
  }

  checkBounds() {
    if (this.position.x >= MAX_WIDTH || this.position.x <= 0) {
      this.direction = new Vector2D(-1 * this.direction.x, this.direction.y);
    }

    if (this.position.y >= MAX_HEIGTH || this.position.y <= 0) {
      this.direction = new Vector2D(this.direction.x, -1 * this.direction.y);
    }
  }
}
