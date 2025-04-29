let balls = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(20, 20, 50);

  let b = new Ball(100, 250);
  balls.push(b);

  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].update();
    balls[i].checkOutOfCanvas();
    balls[i].display();

    if (!balls[i].onCanvas) {
      balls.splice(i, 1);
    }
  }

  // text on canvas
  fill(255);
  textSize(20);
  text("number of balls in array: " + balls.length, 20, 40);
}

class Ball {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.xSpeed = random(1, 3);
    this.ySpeed = random(-0.5, 0.5);
    this.size = random(10, 30);
    this.onCanvas = true;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  checkOutOfCanvas() {
    if (this.x > width || this.y < 0 || this.y > height) {
      this.onCanvas = false;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(200, 200);
    noStroke();
    circle(0, 0, this.size);
    pop();
  }
}
