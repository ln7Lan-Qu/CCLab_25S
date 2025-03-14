/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

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
let startTime;
let circleGenerated = false;
let creatureLastX, creatureLastY;

let X1, Y1, X2, Y2, X3, Y3, X4, Y4;

let bg;

let eggD=20;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");

    bg = createGraphics(800, 500);
  
    angle = random(0,360);
  
    //background
    bg.background(124,252,0);
    //sky_changing_weather
    let color1 = bg.color(176, 224, 230);
    let color2 = bg.color(25, 25, 112);
    let inter = bg.random(1); 
    let blendedColor = bg.lerpColor(color1, color2, inter);
    bg.noStroke();
    bg.fill(blendedColor);
    bg.rect(0, 0, 800, 100);
    
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
      let col_offset = random(0, 3);
      if(col_offset <= 1) bg.fill(random(100, 235), 255, 255);
      else if(col_offset <= 2) bg.fill(255, random(100, 235), 255);
      else bg.fill(255, 255, random(100, 235));

      let theta = random(0, PI/2);
      let sinx = sin(theta) * 15, cosx = cos(theta) * 15;
      bg.circle(x+cosx, y+sinx, 40);
      bg.circle(x-sinx, y+cosx, 40);
      bg.circle(x-cosx, y-sinx, 40);
      bg.circle(x+sinx, y-cosx, 40);
      bg.fill(random(230, 255), random(230, 255), 0)
      bg.circle(x, y, 25);
    }
  }
  //stones
  for (let i = 0; i < 25; i++) {
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
    image(bg, 0, 0);
    // background(220);
    
    newDew();
  
  
    // Non-spinning Creatures
    if(isdead){
      X1 = lerp(X1, 385, 0.004);
      Y1 = lerp(Y1, 185, 0.004);
      X2 = lerp(X2, 415, 0.004);
      Y2 = lerp(Y2, 185, 0.004);
      X3 = lerp(X3, 385, 0.004);
      Y3 = lerp(Y3, 215, 0.004);
      X4 = lerp(X4, 415, 0.004);
      Y4 = lerp(Y4, 215, 0.004);
    }
    drawCreature(X1, Y1, 315, 'b');
    drawCreature(X2, Y2, 45, 'b');
    drawCreature(X3, Y3, 225, 'b');
    drawCreature(X4, Y4, 135, 'b');
    
    // The Spinning Creature
    let angleRad = radians(angle);
    push();
    translate(400, 250);
    rotate(angleRad);
    let creatureR = slimeR + noise(frameCount * 0.05) * freq;
    let theta = atan(1 / 4), delta = -atan(1 / 8);
    let sacR = sqrt(80 * 80 + 20 * 20), bodyR = sqrt(80 * 80 + 10 * 10);
    let sacX = 400 + sacR * cos(theta + angleRad), sacY = 250 + sacR * sin(theta + angleRad);
    let bodyX = 400 + bodyR * cos(delta + angleRad), bodyY = 250 + bodyR * sin(delta + angleRad);
  
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
        angle -= 0.5;
      } else {
        drawCreature(creatureR, 0, 0, 'y');
        if (freq > 0) freq -= 0.5;
        angle -= 0.5;
      }
      creatureLastX = bodyX;
      creatureLastY = bodyY;
    }
    pop();
  
    spawnWhiteCircle(); 
  
    fill(255);
    noStroke();
    circle(whiteCircleX, whiteCircleY, eggD);
    noStroke();
    fill(255,250,205,200);
    quad(0, 0, xl, 500, xl+200, 500, 80, 0);
    fill(240,230,140,200);
    ellipse(xl+100,500,200,50);
  
    moveEgg();  
    
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
    let elapsedTime = millis() - startTime;
  
    if (elapsedTime >= 3000 && !isdead && !circleGenerated) { 
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
    for(let i = 0; i < 30; i++){
      let newDewX = map(sin((i+0.1)*cX), -1, 1, 50, 750);
      let newDewY = map(cos((i+0.1)*cY), -1, 1, 100, 350);
      fill(255,101,154,100);
      ellipse(newDewX,newDewY,20,10);
    }
}

