let NUM_IMAGES = 9;

let the_circles = [], lines = [];
let images = [], image_used = [];
let showWhiteCircle = false;
let circleRadius = 0;
let maxDiam = 200;
let lastX = 0, lastY = 0;

let img_num = -1;
let isHoveringOverLine = false;

let hoverStartTime = 1000000000;
let vanishStartTime = 1000000000;
let circlePos = { x: 0, y: 0 };

let show_story = true;
let textbox_alpha = 255;
let story_txt = "Placeholder Story Text\nNext Line Of Story Text\nThird Line";
let poem_txt = "Placeholder Poem Text";

function preload() {
  for (let i = 0; i < NUM_IMAGES; i++) {
    images.push(loadImage(`assets/image${i}.jpg`));
    image_used.push(false)
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

function display_image(img_num, x, y, h, w, alpha) {
  // console.log("display", img_num);
  image_used[img_num] = true;
  imageMode(CENTER);
  tint(255, alpha)
  image(images[img_num], x, y, h, w);
}

function draw() {
  background(0);
  
  for (let c of the_circles) {
    c.update();
    c.display();
  }

  checkIfClose();
  checkWhetherToChoose();
  if (show_story) {
    showTextBox(textbox_alpha, story_txt)
    textbox_alpha -= 0.5;
    if (textbox_alpha <= 0) show_story = false;
    return
  }

  if (showWhiteCircle) {
    noStroke();
    fill(255, 180);
    circle(circlePos.x, circlePos.y, circleRadius);

    if (circleRadius < maxDiam) {
      circleRadius += 4;
      // if (img_num == -1){
      //   img_num = int(random(0, NUM_IMAGES));
      //   while (image_used[img_num]) img_num = int(random(0, NUM_IMAGES));
      // }
      // display_image(img_num, circlePos.x, circlePos.y, circleRadius, circleRadius, 180);
    }

    // We assume that all images are square
    
    if (img_num == -1){
      img_num = int(random(0, NUM_IMAGES));
      while (image_used[img_num]) img_num = int(random(0, NUM_IMAGES));
    }
    display_image(img_num, circlePos.x, circlePos.y, circleRadius, circleRadius, 180);  
  }    
  drawBigCircle();
  if (!show_story && textbox_alpha > 0) showTextBox(textbox_alpha, poem_txt);
  lastX = mouseX, lastY = mouseY;

  // console.log(textbox_alpha)
  
}

function showTextBox(alpha, txt) {
  fill(0, alpha)
  rect(0, 150, 800, 200)
  textFont("monospace");
  textSize(24);
  textAlign(CENTER, CENTER); 
  fill(255, alpha);
  text(txt, 400, 250);
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
let fix_img = [];
let alpha = 180;

function drawBigCircle() {
  for (let i = 0; i < bigX.length; i++) {
    noStroke();
    fill(255, alpha);
    circle(bigX[i], bigY[i], maxDiam);
    display_image(fix_img[i], bigX[i], bigY[i], maxDiam, maxDiam, alpha);
  }
  if (millis() - vanishStartTime >= 15000) alpha -= 1, textbox_alpha = alpha;
  else if (textbox_alpha <= 180 && millis() - vanishStartTime >= 2000) textbox_alpha += 1;
  if (alpha == 0){
    vanishStartTime = 1000000000;
    alpha = 180;
    bigX = [], bigY = [];
    fix_img = [];
    for (let i = 0; i < NUM_IMAGES; i++) {
      image_used[i] = false;
    }
  }
}

function mousePressed() {
  if (showWhiteCircle && circleRadius >= maxDiam && img_num != -1) {
    if (bigX.length < 3) {
      bigX.push(int(mouseX));
      bigY.push(int(mouseY));
      fix_img.push(img_num);
      img_num = -1;
      // showWhiteCircle = false;
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
  for (let i = 0; i < bigX.length; i++) {
    // console.log(bigX[i], bigY[i], maxDiam / 2, mouseX, mouseY)
    let maxRadius = maxDiam / 2;
    if (bigX[i] - maxRadius <= mouseX && mouseX <= bigX[i] + maxRadius && bigY[i] - maxRadius <= mouseY && mouseY <= bigY[i] + maxRadius) return;
  }
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
    img_num = -1;
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