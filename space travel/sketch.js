let stars = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(0);
  for (let i = 0; i < 1; i++) {
    stars.push(new Star());
  }
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].display();
  }

 
  if (stars.length > 300) {
    stars.splice(0, stars.length - 300);
  }

  console.log(stars.length);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Star {
  constructor() {
    this.s = 0.02;
    this.a = random(360);
    this.originX = mouseX;
    this.type = 0;
  }

  update() {
    this.s *= 1.04;
    this.originX = lerp(this.originX, width / 2, 0.02);

    let r = random();
    if (r < 0.01) {
      this.type = "ring";
    } else {
      this.type = "star";
    }
  }

  display() {
    push();
    translate(this.originX, height / 2);
    rotate(radians(this.a));
    scale(this.s);

    if (this.type == "star") {
      noStroke();
      fill(255);
      circle(0, 200, 20); 
    } else if (this.type == "ring") {
      stroke(255, 100);
      noFill();
      circle(0, 0, 200);
    }
    pop();
  }
}
