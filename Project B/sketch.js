let the_circles = [];
let showWhiteCircle = false;
let circleRadius = 0;
let maxRadius = 200;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);

    let speedX = random(-1.5, 1.5);
    let speedY = random(-1.5, 1.5);

    if (abs(speedX) < 0.2) speedX = random([-1, 1]);
    if (abs(speedY) < 0.2) speedY = random([-1, 1]);

    the_circles.push(new MyCircle(x, y, speedX, speedY));
  }
}

function draw() {
  background(0); 

  for (let c of the_circles) {
    c.update();
    c.display();
  }

  checkIfClose();

  if (showWhiteCircle) {
    noStroke();
    fill(255, 180); // 半透明白色
    circle(width / 2, height / 2, circleRadius);

    if (circleRadius < maxRadius) {
      circleRadius += 5;
    }
  }
}

class MyCircle {
  constructor(startX, startY, speedX, speedY) {
    this.x = startX;
    this.y = startY;
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
    push();
    translate(this.x, this.y);
    fill(255);
    circle(0, 0, 5);
    pop();
  }
}

function checkIfClose() {
  stroke(255, 100);
  strokeWeight(1);
  for (let i = 0; i < the_circles.length; i++) {
    for (let j = i + 1; j < the_circles.length; j++) {
      let c1 = the_circles[i];
      let c2 = the_circles[j];
      let d = dist(c1.x, c1.y, c2.x, c2.y);
      if (d < 35) {
        line(c1.x, c1.y, c2.x, c2.y);
      }
    }
  }
}

function mousePressed() {
  for (let i = 0; i < the_circles.length; i++) {
    for (let j = i + 1; j < the_circles.length; j++) {
      let c1 = the_circles[i];
      let c2 = the_circles[j];
      let d = dist(c1.x, c1.y, c2.x, c2.y);

      if (d < 10) {
        let dToLine = distToSegment(mouseX, mouseY, c1.x, c1.y, c2.x, c2.y);
        if (dToLine < 10) {
          showWhiteCircle = true;
          circleRadius = 0;
          return;
        }
      }
    }
  }
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let A = px - x1;
  let B = py - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  let dx = px - xx;
  let dy = py - yy;
  return sqrt(dx * dx + dy * dy);
}
