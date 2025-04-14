let confettis = [];
let numConfetti = 100;
let backgroundHUE;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  
  colorMode(HSB);
  backgroundHUE = random(0, 255);
}

function draw() {
  background(backgroundHUE, 10, 190);

  if(mousePressed == True){
    for (let i = 0; i < 5; i++) {
      confettis.push(new Confetti(mouseX, mouseY));
    }
  }

  for (let i = 0; i < confettis.length; i++) {
    confettis[i].update();
    confettis[i].checkOutOfCanvas();
    confettis[i].display();
  }

  text(confettis.length, 20, 20);

  // 倒序遍历以避免删除时跳过元素
  for (let i = confettis.length - 1; i >= 0; i--) {
    if (confettis[i].onCanvas == false) {
      confettis.splice(i, 1);
    }
  }
}

class Confetti {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);

    this.confettiHue = random(255);
    
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -3);   

    this.onCanvas = true;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.speedY += 0.1;
    this.speedX += 0.01;
  }

  checkOutOfCanvas() {
    if (this.x < 0 || this.x > width || this.y > height) {
      this.onCanvas = false;
    }
  }

  display() {    
    push();
    translate(this.x, this.y);
    fill(this.confettiHue, 255, 255);
    noStroke();
    circle(0, 0, this.size);
    pop();
  }
}

function mousePressed() {
  for (let i = 0; i < numConfetti; i++) {
    confettis.push(new Confetti(mouseX, mouseY));
  }
}
