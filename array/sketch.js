let greeting = ["Hello", "Ni hao", "Namaste", "Hola", "Bonjour", "Hej", "Ahoj", "Xin chao", "Jambo", "Zdravstvuyte"];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  textAlign(CENTER, CENTER); 
  textSize(24); 
  fill(255);
}

function draw() {
  background(10, 20, 220);
  
  for (let i = 0; i < greeting.length; i++) {
    let message = greeting[i];
    let y = height / 2 + i * 30;
    text(message, width / 2, y);
  }
}
