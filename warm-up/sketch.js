let circles = []; 

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

 
  for (let i = 0; i < width / 10; i++) {
    circles.push(i * 20); 
  }
}

function draw() {
  background(220);
  for (let i = 0; i < circles.length; i++) {
    noStroke();
    fill(100);
    circle(circles[i]+random(-1,1), height / 2, 10); 
  }
}
