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
  constructor() {
    super();
  }

  getNewPosition() {
    let randomMovement = getRandomInt(-8, 10);
    this.position += randomMovement;
    return this.position;
  }
}
