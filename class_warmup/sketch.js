let the_circles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  colorMode(RGB);
  
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);

   
    let lightBlue = color(150, 200, 255, 100);
    let lightGreen = color(180, 255, 200, 100);
    let lightPurple = color(220, 180, 255, 100);

    let c1 = random([lightBlue, lightGreen, lightPurple]);
    let c2 = random([lightBlue, lightGreen, lightPurple]);
    let blendedColor = lerpColor(c1, c2, random(0.3, 0.7));

    let speedX = random(-1.5, 1.5);
    let speedY = random(-1.5, 1.5);

    if (abs(speedX) < 0.2) speedX = random([-1, 1]);
    if (abs(speedY) < 0.2) speedY = random([-1, 1]);

    the_circles.push(new MyCircle(x, y, blendedColor, speedX, speedY));
  }
}

function draw() {
  background(240); 

  for (let c of the_circles) {
    c.update();
    c.display();
  }
}

class MyCircle {
  constructor(startX, startY, c, speedX, speedY) {
    this.x = startX;
    this.y = startY;
    this.col = c;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }

    display() {
    noStroke();
    
    fill(this.col);
    push();
    translate(this.x, this.y);
    circle(0, 0, 60);
    
    fill(255, 220, 0, 20);
    circle(0, 0, 30);

    fill(255);
    circle(12, 12, 15);
    
    pop();
  }

}
