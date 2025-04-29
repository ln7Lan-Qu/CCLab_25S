let bghue;
let instruments = [];
let beep;
let interacted = false;
let colorModeOption = "H"; // 当前颜色模式，"H" 默认，"L" 蓝色

function preload() {
  beep = loadSound("assets/sound/beat.mp3");
}

function setup() {
  let w = min(800, windowWidth);
  let canvas = createCanvas(w, 500);
  canvas.parent("p5-canvas-container");
  colorMode(HSB);
  bghue = random(255);
  let a = new Instrument(width / 2, height / 2);
  instruments.push(a);
}

function draw() {
  background(bghue, 180, 27);
  fill(bghue, 180, 30);
  noStroke();
  rect(50, 50, width - 100, height - 100);

  if (interacted) {
    for (let i = 0; i < instruments.length; i++) {
      instruments[i].update();
      instruments[i].display();
    }

    fill(255);
    textAlign(CENTER);
    text("click to add instruments", width / 2, height - 20);
  } else {
    fill(255);
    textAlign(CENTER);
    text("click the canvas to begin the experience!", width / 2, height / 2);
  }

  // 显示当前模式文字
  fill(255);
  textAlign(LEFT);
  textSize(14);
  text("Press L for blue tones, H for default colors", 60, height - 40);
  text("Current Mode: " + colorModeOption, 60, height - 25);
}

class Instrument {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.possibleSize = [10, 30, 50, 70, 90];
    this.size = random(this.possibleSize);
    this.strokeThickness = this.size / 10; // 控制圆环宽度
    this.dia = 1;
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
    this.setHue();
    this.myRate = map(this.size, 10, 90, 5, 0.1);
  }

  setHue() {
    if (colorModeOption === "H") {
      this.myHue = random(0, 50); // 默认红黄系
    } else if (colorModeOption === "L") {
      this.myHue = random(180, 240); // 蓝色系
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      this.speedX = -this.speedX;
      beep.rate(this.myRate);
      beep.play();
    }

    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.speedY = -this.speedY;
      beep.rate(this.myRate);
      beep.play();
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    noFill(); // 中间保持透明
    stroke(this.myHue, 255, 255); // 设置颜色
    strokeWeight(this.strokeThickness); // 设置圆环的宽度
    circle(0, 0, this.size); // 画圆环
    pop();
  }

  checkIfClicked() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < this.size / 2) {
      this.setHue();
    }
  }
}

function mousePressed() {
  interacted = true;

  for (let i = 0; i < instruments.length; i++) {
    instruments[i].checkIfClicked();
  }
}

function keyPressed() {
  console.log(key);

  if (key === " ") {
    if (
      interacted &&
      mouseX > 50 &&
      mouseX < width - 50 &&
      mouseY > 50 &&
      mouseY < height - 50
    ) {
      let a = new Instrument(mouseX, mouseY);
      instruments.push(a);
    }
  }

  if (key === "L") {
    colorModeOption = "L";
    console.log("Switched to blue tones");
  }

  if (key === "H") {
    colorModeOption = "H";
    console.log("Switched to default hue tones");
  }
}
