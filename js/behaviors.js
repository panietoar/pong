class Behavior {
  constructor() {
    this.position = 0;
  }

  getNewPosition() {
    console.log('default behavior');
  }
}

class PlayerBehavior extends Behavior {
  constructor() {
    super();
    this.mousePosition = 0;
    CANVAS.addEventListener('mousemove', event => {
      this.mousePosition = event.clientY - PADDLE_HEIGHT / 2;
    });
  }

  getNewPosition() {
    if (
      this.mousePosition < MAX_HEIGTH - PADDLE_HEIGHT &&
      this.mousePosition > 0
    ) {
      this.position = this.mousePosition;
    }
    return this.position;
  }
}

class AIBehavior extends Behavior {
  constructor(paddle) {
    super();
    this.paddle = paddle;
  }

  getNewPosition() {
    this.position = this.paddle.position.y;
    let difference = this.position - Global.ballPosition;
    let yDirection = difference <= 0 ? 1 : -1;

    let movement = this.position + yDirection * AI_PADDLE_SPEED;
    return movement;
  }
}
