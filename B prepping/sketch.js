let the_circles = [], lines = [], images = [];
let showWhiteCircle = false;
let circleRadius = 0;
let maxRadius = 200;
let lastX = 0, lastY = 0;

let isHoveringOverLine = false;

let hoverStartTime = 1000000000;
let vanishStartTime = 1000000000;
let circlePos = { x: 0, y: 0 };

function preload() {
  for (let i = 1; i <= 9; i++) {
    images.push(loadImage("assets/image${i}.jpg"));
  }
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  for (let i = 0; i < 400; i++) {
    let x = random(width);
    let y = random(height);

    let speedX = random(-0.5, 0.5);
    let speedY = random(-0.5, 0.5);

    while (abs(speedX) < 0.1) speedX = random(-0.5, 0.5);
    while (abs(speedY) < 0.1) speedY = random(-0.5, 0.5);

    the_circles.push(new MyCircle(x, y, speedX, speedY));
  }
}

function draw() {
  background(0);

  for (let c of the_circles) {
    c.update();
    c.display();
  }

  drawBigCircle();
  checkIfClose();
  checkWhetherToChoose();

  if (showWhiteCircle) {
    noStroke();
    fill(255, 180);
    circle(circlePos.x, circlePos.y, circleRadius);

    if (circleRadius < maxRadius) {
      circleRadius += 4;
    }
  }
  lastX = mouseX, lastY = mouseY;
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

class MyLine {
  constructor(circle1, circle2) {
    this.c1 = circle1;
    this.c2 = circle2;
  }
}

let bigX = [];
let bigY = [];
let alpha = 180;

function drawBigCircle() {
  for (let i = 0; i < bigX.length; i++) {
    noStroke();
    fill(255, alpha);
    circle(bigX[i], bigY[i], maxRadius);
  }
  if (millis() - vanishStartTime >= 15000) alpha -= 1;
  if (alpha == 0){
    vanishStartTime = 1000000000;
    alpha = 180;
    bigX = [], bigY = [];
  }
}

function mousePressed() {
  if (showWhiteCircle && circleRadius >= maxRadius) {
    if (bigX.length < 3) {
      bigX.push(int(mouseX));
      bigY.push(int(mouseY));
      if (bigX.length == 3) vanishStartTime = millis();
    }
  }
}

function checkIfClose() {
  stroke(255, 100);
  strokeWeight(1);
  lines = []
  for (let i = 0; i < the_circles.length; i++) {
    for (let j = i + 1; j < the_circles.length; j++) {
      let c1 = the_circles[i];
      let c2 = the_circles[j];
      let d = dist(c1.x, c1.y, c2.x, c2.y);
      if (d < 35) {
        lines.push(new MyLine(c1, c2))
        line(c1.x, c1.y, c2.x, c2.y);
      }
    }
  }
}

function checkWhetherToChoose() {
  for (let i = 0; i < lines.length; i++){
    let d = dist(lines[i].c1.x, lines[i].c1.y, lines[i].c2.x, lines[i].c2.y);

    if (d < 20) {
      let dToLine = distToSegment(mouseX, mouseY, lines[i].c1.x, lines[i].c1.y, lines[i].c2.x, lines[i].c2.y);
      if (dToLine < 10) {
        isHoveringOverLine = true;

        if (hoverStartTime === 1000000000) {
          hoverStartTime = millis();
          circleRadius = 0; 
        }

        if (millis() - hoverStartTime >= 500 && bigX.length < 3) {
          showWhiteCircle = true;
          circlePos = { x: mouseX, y: mouseY };
        }
      }
    }
  }

  if (lastX != mouseX || lastY != mouseY){
    isHoveringOverLine = false;
    showWhiteCircle = false;
    hoverStartTime = 1000000000; 
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