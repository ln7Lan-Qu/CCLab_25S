let NUM_OF_PARTICLES = 40;
let MAX_OF_PARTICLES = 500;

let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  noCursor();
  colorMode(RGB);
}

let cursorX = -1;
let cursorY = -1;

function draw() {
  background(255);
  c1 = color(0, 155, 235);
  c2 = color(0, 40, 175);
  for (let i = 0; i <= 500; i++) {
    let inter = map(i, 0, 500, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, i, 800, i);
  }
  
  noStroke();
  textSize(96);
  if(cursorX == -1){
    cursorX = mouseX, cursorY = mouseY;
  }
  else{
    cursorX = lerp(cursorX, mouseX, 0.01);
    cursorY = lerp(cursorY, mouseY, 0.01);
  }
  text('🪼', cursorX, cursorY);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.checkOutOfCanvas();
    p.display();
  }

  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, particles.length - MAX_OF_PARTICLES);
  }
}

function mousePressed() {
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles.push(new Particle(cursorX + 60, cursorY + 30));
  }
}

class Particle {
  constructor(startX, startY) {
    this.x = startX + random(-10, 10);
    this.y = startY + random(-10, 10);
    this.dia = random(40, 80);
    this.frame = 0;

    this.onCanvas = true;

    this.speedX = random(-2, 2);
    this.speedY = random(1, 2);

    let lightBlue = color(150, 200, 255, 120);
    let lightGreen = color(180, 255, 200, 120);
    let lightPurple = color(220, 180, 255, 120);

    let c1 = random([lightBlue, lightGreen, lightPurple]);
    let c2 = random([lightBlue, lightGreen, lightPurple]);
    this.blendedColor = lerpColor(c1, c2, random(0.3, 0.7));
  }

  update() {
    this.frame += 1;
    // if (this.y < 0) {
    //   this.speedY *= -1; // simulate gravity
    //   this.speedY = max(this.speedY, 0.5)
    //   this.y += this.speedY;
    // } else {
    //   this.x += this.speedX;
    //   this.y += this.speedY;
    // }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.frame % 5 == 0){
      this.speedY -= 0.05;
    }
  }

  checkOutOfCanvas() {
    if (this.x < 0 || this.x > width || this.y > height) {
      this.onCanvas = false;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();

    fill(this.blendedColor);
    circle(0, 0, this.dia);

    fill(255, 220, 0, 20);
    circle(0, 0, this.dia * 0.5);

    fill(255);
    circle(this.dia * 0.2, -this.dia * 0.2, this.dia * 0.2);

    pop();
  }
}
