let dancer;

function setup() {

  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");


  dancer = new Silken_Wraith(width / 2, height / 2);
}

function draw() {

  background(0);
  drawFloor();

  dancer.update();
  dancer.display();
}


class Silken_Wraith {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.blue = color(0, 185, 255)
    this.green = color(255, 50, 50)
    this.col = this.blue
    this.angle = 0;
    this.anglechange = 0.5;
    this.numRectangles = 400;
    this.colors = ['#FF4500', '#FF6347', '#FFD700', '#FFA500', '#FF8C00'];
    this.rectangles = [];
    this.generateRectangles();
  }


  generateRectangles() {
    noStroke();
    let topX = this.x;
    let topY = this.y - 90;
    let bottomY = this.y + 90;
    let halfBase = (bottomY - topY) * 0.414; 

    for (let i = 0; i < this.numRectangles; i++) {
      let y = random(topY, bottomY);
      let currentHalfWidth = map(y, topY, bottomY, 0, halfBase);
      let x = random(topX - currentHalfWidth, topX + currentHalfWidth);
      let w = random(10, 30);
      let h = random(10, 30);
      let colorIndex = floor(random(this.colors.length));
      let alphaValue = random(80, 160);
      let col = color(this.colors[colorIndex]);
      let offset = int(random(0, 100)) * 1;
      col.setAlpha(alphaValue);
      this.rectangles.push({ x, y, w, h, col, offset });
    }
  }


  update() {
    this.angle -= this.anglechange;
    this.x -= this.anglechange * 6;
    for (let r of this.rectangles) r.x -= this.anglechange * 2;
    if(this.angle <= -20 || this.angle >= 20) this.anglechange *= -1;
    for (let r of this.rectangles){
      let currentHalfWidth = map(r.y, this.y - 90, this.y + 90, 0, 180 * 0.414);
      // let currentHalfWidth = 100;
      console.log(currentHalfWidth)
      let timeSignature = frameCount + r.offset;
      if(timeSignature % 100 < 50) r.x = lerp(r.x, this.x + currentHalfWidth, 0.005 * (timeSignature % 100));
      else r.x = lerp(r.x, this.x - currentHalfWidth, 0.005 * ((timeSignature + 50) % 100));
      // console.log(r.x, r.y)
    }
    if(frameCount % 300 < 50) this.col = lerpColor(this.col, this.green, 0.01);
    else if(frameCount % 300 < 150) this.col = lerpColor(this.col, this.green, 0.03);
    else if(frameCount % 300 < 200) this.col = lerpColor(this.col, this.blue, 0.01);
    else this.col = lerpColor(this.col, this.blue, 0.03);
  }


  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));

    fill(this.col);
    circle(-40, -60, 45);
    
    noFill(); 
    strokeWeight(20);
    stroke(this.col);
    arc(0, 0, 100, 50, PI, -PI/8);

    this.drawReferenceShapes();

    fill(255, 255, 255);
    quad(0, -40, 20, 10, 0, 60, -20, 10);

    for (let r of this.rectangles) {
      fill(r.col);
      rectMode(CENTER);
      noStroke();
      rect(r.x - this.x, r.y - this.y, r.w, r.h);
    }
    
    noFill(); 
    strokeWeight(20);
    stroke(this.col);
    arc(0, 0, 100, 50, HALF_PI, PI);
    pop();
  }

  // reference shapes for positioning (optional)
  drawReferenceShapes() {
    noFill();
    strokeWeight(1);
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}
