/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let darkness_alpha = 0, col;

let angle = 0;
let xl = 0;
let spotX = 0;
let spotY = 0;
let cX = 0, cY = 0;
let freq = 0;
let slimeopacity = 255, slimeR = 80;
let isdead = false;
let lerpX = 0, lerpY = 0;
let whiteCircleX, whiteCircleY;
let eggX = 400, eggY = 250;
let startTime;
let circleGenerated = false;
let creatureLastX, creatureLastY;

let X1, Y1, X2, Y2, X3, Y3, X4, Y4;

let bg;

let eggD = 20;


function setup() {
  createCanvas(800, 500);
  bg = createGraphics(800, 500);
  
  angle = random(0,360);
  
  //background
  
  // bg.background(255, 255, 255, 0);
  bg.fill(124,252,0);
  //sky_changing_weather
  // let color1 = bg.color(176, 224, 230);
  // let color2 = bg.color(25, 25, 112);
  // let inter = bg.random(1); 
  // let blendedColor = bg.lerpColor(color1, color2, inter);
  bg.noStroke();
  // bg.fill(blendedColor);
  bg.rect(0, 100, 800, 800);
  
  //grass
  for (let i = 0; i < 8; i++) {
      let base_y = 150 + 30*i;
    for (let j = 0; j < 50-5*i; j++) {
      bg.fill(20 - 2*i, 120 + 15*i, 20 - 2*i);
      let w = random(i+1, i+2), x = random(0, 800), y = base_y + random(-30, 30);
      let h = random(y/4, y-10);
      bg.rect(x, y-h, w, h);
    }
    // dew
    for (let i = 0; i < 12; i++) {
      let xe = random(0, 800);
      let ye = base_y + random(-50, 0);
      bg.fill(17, 101, 154, random(150, 230)); 
      bg.ellipse(xe, ye, 20, 10);
    }
  }

  
  //small flowers
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j++){
      if(j >= 3 && j <= 4) continue;
      let x = random(100*j+20, 100*(j+1)-20), y = random(100+80*i, 180+80*i);
      bg.noStroke();
      
      bg.fill(255, 253, 223);
      let theta = random(0, PI/2);
      let sinx = sin(theta) * 15, cosx = cos(theta) * 15;
      bg.circle(x+cosx, y+sinx, 40);
      bg.circle(x-sinx, y+cosx, 40);
      bg.circle(x-cosx, y-sinx, 40);
      bg.circle(x+sinx, y-cosx, 40);
      let col_offset = random(0, 3);
      if(col_offset <= 1) bg.fill(random(0, 100), 255, 255);
      else if(col_offset <= 2) bg.fill(255, random(0, 100), 255);
      else bg.fill(255, 255, random(0, 100));
      
      bg.circle(x, y, 25);
    }
  }
  //stones
  for (let i = 0; i < 35; i++) {
    let xs = random(0, 800);
    let ys = random(350, 500);
    bg.fill(random(100, 220)); 
    bg.ellipse(xs, ys, 120, 80);
  }
  
  
  //light
  xl = random(50,600);
  
  cX = random(100, 500);
  cY = random(100, 500);
  
  startTime = millis(); 
  creatureLastX = 400; 
  creatureLastY = 250;
  
  X1 = random(50, 300), X2 = random(500, 750);
  X3 = random(50, 300), X4 = random(500, 750);
  Y1 = random(120, 180), Y2 = random(120, 180);
  Y3 = random(220, 280), Y4 = random(220, 280);
  
}

function draw() {
  let color_morning = color(176, 232, 240);
  let color_noon = color(48, 176, 255);
  let color_night = color(0, 16, 160);
  if (frameCount % 2000 == 1){
    col = color_morning, darkness_alpha = 0;
    isdead = false;
    X1 = random(50, 300), X2 = random(500, 750);
    X3 = random(50, 300), X4 = random(500, 750);
    Y1 = random(120, 180), Y2 = random(120, 180);
    Y3 = random(220, 280), Y4 = random(220, 280);
    circleGenerated = false;
    eggD = 20;
    if(frameCount > 2000) eggX = whiteCircleX, eggY = whiteCircleY;
    if(eggX <= 50 || eggX >= 750 || eggY <= 50 || eggY >= 450) eggX = 400, eggY = 250;
  }
  else if(frameCount % 2000 < 400){
    col = lerpColor(col, color_noon, 0.005);
  }
  else if(frameCount % 2000 < 800){
    col = lerpColor(col, color_night, 0.001);
  }
  else if(frameCount % 2000 < 1200){
    col = lerpColor(col, color_night, 0.01);
  }
  else if(frameCount % 2000 < 1600){
    col = lerpColor(col, color_night, 0.05);
  }
  
  background(col);
  // print(frameCount, col);
  image(bg, 0, 0);
  
  newDew();
  moveTorch();

  // Non-spinning Creatures
  if(isdead){
    X1 = lerp(X1, 385, 0.01);
    Y1 = lerp(Y1, 185, 0.01);
    X2 = lerp(X2, 415, 0.01);
    Y2 = lerp(Y2, 185, 0.01);
    X3 = lerp(X3, 385, 0.01);
    Y3 = lerp(Y3, 215, 0.01);
    X4 = lerp(X4, 415, 0.01);
    Y4 = lerp(Y4, 215, 0.01);
  }
  drawCreature(X1, Y1, 315, 'b');
  drawCreature(X2, Y2, 45, 'b');
  drawCreature(X3, Y3, 225, 'b');
  drawCreature(X4, Y4, 135, 'b');
  
  // The Spinning Creature
  let angleRad = radians(angle);
  push();
  translate(eggX, eggY);
  rotate(angleRad);
  let creatureR = slimeR + noise(frameCount * 0.05) * freq;
  let theta = atan(1 / 4), delta = -atan(1 / 8);
  let sacR = sqrt(80 * 80 + 20 * 20), bodyR = sqrt(80 * 80 + 10 * 10);
  let sacX = eggX + sacR * cos(theta + angleRad), sacY = eggY + sacR * sin(theta + angleRad);
  let bodyX = eggX + bodyR * cos(delta + angleRad), bodyY = eggY + bodyR * sin(delta + angleRad);
  
  let anglemove = 0.5;
  if(bodyY <= bodyX * 500 / xl && bodyX <= bodyY * (xl + 120) / 500 + 80){
    anglemove = 0;
  }
  

  if ((mouseIsPressed && sqrt(sq(mouseX - sacX) + sq(mouseY - sacY)) <= 20) || (isdead && slimeopacity > 0)) {
    isdead = true;
    push();
    translate(creatureR, 0);
    slimeR = creatureR;
    freq = 0;
    noStroke();
    fill(120, 255, 60, slimeopacity);
    slimeopacity -= 1;
    let blobDetail = 20;
    beginShape();
    for (let i = 0; i < blobDetail; i++) {
      let angle2 = map(i, 0, blobDetail, 0, TWO_PI);
      let r = 50 * 0.5 + noise(cos(angle2) * 2, sin(angle2) * 2, frameCount * 0.02) * 50 * 0.3;
      let xOffset = cos(angle2) * r;
      let yOffset = sin(angle2) * r;
      vertex(xOffset, yOffset);
    }
    endShape(CLOSE);
    pop();
  }

  if (!isdead) {
    if (mouseIsPressed && sqrt(sq(mouseX - bodyX) + sq(mouseY - bodyY)) <= 25) {
      freq = 100;
      drawCreature(creatureR, 0, 0, 'y');
      angle -= anglemove;
    } else {
      drawCreature(creatureR, 0, 0, 'y');
      if (freq > 0) freq -= 0.5;
      angle -= anglemove;
    }
    creatureLastX = bodyX;
    creatureLastY = bodyY;
  }
  pop();

  spawnWhiteCircle(); 
  
  if(frameCount % 2000 >= 200){
    fill(255);
    stroke(255, 204, 0);
    strokeWeight(6);
    circle(whiteCircleX, whiteCircleY, eggD);
  }
  
  noStroke();
  fill(255,250,205,200);
  quad(0, 0, xl, 500, xl+200, 500, 80, 0);
  fill(240,230,140,200);
  ellipse(xl+100,500,200,50);

  moveEgg();  
  
  if(frameCount % 2000 >= 1600 && frameCount % 2000 <= 1900){
    darkness_alpha += 255 / 300;
  }
  background(0, 0, 0, darkness_alpha);
}

function drawCreature(x, y, ang, sacCol) {
  push();
  translate(x, y);
  rotate(radians(ang));
  noStroke();

  fill(255);
  circle(0, -10, 40);

  fill(0);
  ellipse(-5, -22, 8, 15);
  ellipse(5, -22, 8, 15);

  if(sacCol == 'y') fill(255, 204, 0);
  else fill(148, 220, 255);
  circle(0, 20, 40);

  spotX = 0, spotY = 0;
  fill(144, 0, 0);
  for (let i = 0; i < 63; i++) {
    spotX = -12 + 3 * (i % 9);
    spotY = 8 + 4 * int(i / 9);
    let dx = -1 + int(sin(i) * cX) % 3;
    let dy = -1 + (int(cos(i) * cY) % 9) / 3;
    spotX += dx;
    spotY += dy;
    circle(spotX, spotY, 4);
  }

  stroke(173, 255, 47);
  strokeWeight(6);
  noFill();
  arc(0, 5, 30, 5, PI, 0);
  strokeWeight(1);
  pop();
}

function spawnWhiteCircle() {

  if (frameCount % 2000 >= 200 && !isdead && !circleGenerated) { 
    whiteCircleX = creatureLastX;
    whiteCircleY = creatureLastY; 
    circleGenerated = true;
  }
}

function moveEgg() {
    if (mouseIsPressed == true && mouseX > whiteCircleX - eggD - 20 && mouseX < whiteCircleX + eggD + 20 && mouseY < whiteCircleY + eggD + 20 && mouseY > whiteCircleY - eggD - 20) {
      whiteCircleX = mouseX;
      whiteCircleY = mouseY;
      for (let i = 0; i < 30; i++){
        newDewX = map(sin((i+0.1)*cX), -1, 1, 50, 750);
        newDewY = map(cos((i+0.1)*cY), -1, 1, 100, 350);
        if (sq(mouseX - newDewX) + sq(mouseY - newDewY) <= sq(eggD/2)){
          eggD+=0.1;
          eggD=min(40, eggD);
        }
      }
    }
}

function newDew(){
  for(let i = 0; i < 10; i++){
    let newDewX = map(sin((i+0.1)*cX), -1, 1, 50, 750);
    let newDewY = map(cos((i+0.1)*cY), -1, 1, 150, 300);
    fill(20, 100, 220);
    ellipse(newDewX,newDewY,20,10);
  }
}

function moveTorch(){
  if(keyIsDown(65) || keyIsDown(LEFT_ARROW)){
    xl -= 5;
    xl = max(xl, 20);
  }
  else if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)){
    xl += 5;
    xl = min(xl, 1100);
  }
}

