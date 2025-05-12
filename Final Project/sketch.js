/* To-do: 
1. Fade-in, Fade-out effect for two scenes (Difficult)
2. Hide dots and lines for existing pictures
3. Show story of each picture in scene 2 when clicked
4. After 3 pictures, show poem, all pictures have order shuffled and face down
*/

let NUM_IMAGES = 12;
let canvasLength = 800;
let canvasHeight = 525;

let STORY = 0, STARMAP = 1, PHOTOBOOTH = 2, ENDING = 3;
let state = STORY;

let storyFrames = 1250;
let storyText = [
  "[System Alert]: Neural Link Disrupted\nYour stream of consciousness is drifting off its assigned path.",
  "Signal instability detected...\nYou've been auto-connected to Abandoned Database No.073-A.\n ⚠️ Warning: This database is located in the Forgetting Zone.\nIt contains corrupted, scattered, and sealed fragments of lost memories.",
  "Data is unstable.\nLogic is broken.\nMeaning is... unclear.",
  "These fragments once belonged to human minds...\nNow long forgotten.",
  "You can disconnect now.\nOr—\nTap into the data links.\nAwaken the sleeping ghosts of information.\nWander through the chaos.\nAnd uncover answers the world chose to forget.",
]

let spots = [];
let connections = [];
let photos = [];
let activeImg = [];

let images = [], loading_spinner;

let lastMouseX = -1, lastMouseY = -1, framesStayed = 0;

let descFrames = 2000;

let backgroundText = [
  "Parchment manuscripts are hand-crafted documentary media used across Eurasia from the 2nd century BCE through the 15th century CE, fashioned by cleaning, stretching, and smoothing animal hides. Their durability surpassed that of papyrus, making them the preferred medium for religious texts, anatomical atlases, and legal codices. Notable examples include the Vienna Dioscorides and the Lindisfarne Gospels. The complex production process required several days per leaf, and thus was typically sponsored by monastic communities or royal patrons.\n\nAfter the 22nd century, with the advent of holographic storage and ethical constraints on biogenic materials, physical parchment was classified as “non-renewable cultural heritage.” Today, only 3.7 percent of undigitized fragments endure in deep-freeze gene vaults within the Arctic Circle; undeciphered botanical symbols among them now guide paleoclimate reconstruction efforts.",
  "A public park was an open urban space of the pre–space-flight era (20th–21st centuries), featuring landscaped lawns, pathways, and seating areas designed for air purification, social gathering, and immersive encounters with nature. At its zenith, parks collectively covered some 3.8 million square kilometers globally (per the Old World Urban Records).\n\nFollowing implementation of the 2135 Climate Emergency Act, 97 percent of parks were repurposed into vertical farms or carbon-capture installations. The last remaining real-world park—Singapore’s Bishan Park—closed in 2189; its soil samples now reside in the Mars Bayer Ecological Museum. Virtual parks, such as the “Nostalgia Protocol,” still simulate standardized turf shadows and synthesized birdcalls, yet user engagement remains below 0.03 percent.",
  "Turquoise lakes are glacial meltwater bodies enriched with suspended carbonate minerals, predominantly found in the Himalayas and the Rocky Mountains. Their vivid hues arise from Rayleigh scattering and mineral particulates, with pH levels typically between 6.8 and 7.5.\n\nBy the 22nd century, glacial retreat had dulled 83 percent of these lakes, and by 2241 the remaining waters were converted into deuterium extraction plants. The largest surviving virtual reconstruction, the “Mirror of Heaven Project,” uses nanoparticle suspensions to emulate reflective surfaces, serving as sensory-deprivation therapy for space settlers. The last recorded natural turquoise sheen was observed on Antarctica’s Lake L-07 in 2305.",
  "A nebula is an interstellar cloud of dust and ionized gas, long revered as an astronomical aesthetic symbol by terrestrial civilizations. In 2357, quantum telescopes detected neuron-like electromagnetic pulse networks within the Orion Nebula. The “Nebular Consciousness Hypothesis” of 2480 sparked ethical debates and prompted the Interstellar Development Agency’s “Nebula Contact Prohibition.” Contemporary cultural imagery of nebulae is largely derived from 21st-century Hubble reconstructions; holographic projections of these forms now feature in Pluto Memorial Gardens’ funerary rites, symbolizing an “unfinished cosmic dialogue.”",
  "The maple leaf is the emblematic foliage of temperate Acer species, whose palmate lobes and autumnal crimson transition once defined the seasonal landscapes of Earth’s northern latitudes.\n\nBy 2098, global warming had disrupted anthocyanin synthesis, and the last natural red maples were documented in Greenland’s gene reserve in 2123. Today, electronic maple leaves function as emotional regulators—emitting simulated tannin scents and color-changing projections to treat seasonal affective disorder. On Kepler-22b, Canadian descendants maintain the virtual leaf as a sovereignty emblem, generating 920 million daily holographic badges.",
  "The pipe organ is a mechanical aerophone of the Industrial Age, driven by bellows that channel air through ranks of pipes spanning 16 Hz to 16 kHz. Bach’s Toccata and Fugue in D minor epitomizes its repertoire.\n\nIn 2199, Freiburg Cathedral’s final playable organ went silent; its 7.5 tons of metal pipes were repurposed as counterweights for space elevators. The AI-driven “BWV∞” restoration project can generate infinite variations, though detractors argue it lacks the “unpredictable air-vibrato” of its analog predecessor. In modern vacuum environments, organ-wave propagation models inform tests of quantum-entangled communication fidelity.",
  "A road is the fundamental unit of terrestrial transport networks, paved with asphalt or concrete and equipped with lighting and signaling systems. At its apex in 2025, roads spanned over 65 million kilometers.\n\nWith the rise of autonomous transport, surface thoroughfares were gradually dismantled under the 2147 Global Land Reclamation Act, their materials recycled for Martian dome construction. The longest extant road remnant, a 3.2 km segment of Highway 66, is preserved within a protected zone maintained at 50 °C to inhibit vegetation; its crack patterns now serve as a natural entropy source for random-number generation.",
  "The Renaissance was a cultural movement centered in 14th–17th century Italy, emphasizing humanism and revival of classical antiquity. Key achievements included linear perspective and anatomical painting.\n\nIn 2563, the Historical Compression Protocol labeled it a “redundant civilization node,” allocating only 0.0004 percent of the collective human consciousness to its memory. A virtual Florence model appears in the “Cognitive Archaeology Game” as an introductory level, wherein players avert the Medici Bank’s collapse within 12 hours to unlock Da Vinci’s skillset. Contemporary art engines deem its aesthetic value beneath the chaos threshold of algorithmically generated art.",
  "A sunset is the optical phenomenon of the sun descending below the horizon due to Earth’s rotation, with correlated color temperatures between 2200 K and 3000 K.\n\nAfter humanity’s relocation to orbital habitats in 2791, natural sunsets became illegal experiences. Black-market “retinal sunset serums” induce L-opsin protein mutations in cone cells, producing 23-second orange-red hallucinations. The final lawful sunset viewing occurred in 2874 at the Mare Tranquillitatis Dome Theater on the Moon, using holographic diffraction data drawn from Earth’s atmospheric particulates.",
  "Eagles are large raptors of the Accipitridae family, boasting wingspans up to 2.3 meters and visual acuity eight times that of humans.\n\nThe last wild specimen, the Spanish imperial eagle, perished in 2284 after a collision with a drone. Bionic eagles now serve as planetary surveillance drones, fitted with gallium-arsenide solar skins and quantum imaging cameras, though they lack natural hunting-dive modules. Their genomes are archived in the Earth Memory Bank as “irreversibly missing social species,” since simulating territorial behavior demands excessive computational resources.",
  "Machu Picchu is the 15th-century mountain stronghold of the Inca Empire, constructed using precise megalithic stone-cutting techniques.\n\nIn 2415, Andean climate engineering dispersed nanofluid agents that dissolved 12 thousand tons of its stone into atmospheric regulation particles. A virtual reconstruction resides in the “Lost Civilizations Protocol” Level 9, though visitors often bypass the guided tour to flock directly to the “Sun Gate selfie point.” Inca descendants on TRAPPIST-1e erected symbolic stone walls, which collapse an average of 2.7 times per year due to differing gravity.",
  "A plain is an expansive, gently sloped landform under 200 meters elevation, once encompassing one-third of Earth’s terrestrial surface.\n\nAfter the North China Plain’s desertification in the 22nd century, its soil microbiota was repurposed as a Mars agricultural substrate. The largest extant real plain is Antarctica’s artificial photosynthetic platform (140 thousand km²), though it is classified as an “industrial plain unit.” In virtual geography exams, 97 percent of students erroneously define plains as “precursors to drone landing pads.”",
];

let poemText = [
  "Ancient ciphers trace the contours of time, unveiling the paths of destiny.",
  "To dwell in serene delight beneath the emerald canopy.",
  "Waters of ice and stone whisper their ageless turquoise.",
  "Celestial mists shimmer with ever-shifting hues across the void.",
  "Where scarlet leaves drift earthward, new shoots rise in their stead.",
  "Majestic harmonies soar, then linger in the hush that follows.",
  "In ceaseless streams of countless souls, we brush past one another.",
  "Behind redbrick bastions, the Renaissance spirit took root beneath soaring domes.",
  "Each sunrise and sunset weaves the cycle of day and night without cease.",
  "An eagle’s broad wings cleave the icy heights of distant summits.",
  "Stone pinnacles of civilization lie buried beneath moss and lichen’s gentle claim.",
  "I yearn for the mist-laden plains where dawn’s golden beams dance.",
];

function preload() {
  for (let i = 0; i < NUM_IMAGES; i++) {
    images.push(loadImage(`assets/image${i}.jpg`));
  }
  loading_spinner = loadImage(`assets/loading.jpg`); // Does p5.js support gif?
}

function setup() {
  canvasLength = windowWidth;
  canvasHeight = windowHeight;
  let canvas = createCanvas(canvasLength, canvasHeight);
  canvas.parent("p5-canvas-container");

  noCursor(); 

  // 创建点阵
  spotSpacing = canvasLength / 32;
  for (let x = spotSpacing; x < width; x += spotSpacing) {
    for (let y = spotSpacing; y < height; y += spotSpacing) {
      spots.push(new Spot(x, y));
    }
  }

  // 创建连线对象
  for (let i = 0; i < spots.length; i++) {
    for (let j = i + 1; j < spots.length; j++) {
      let d = dist(spots[i].x, spots[i].y, spots[j].x, spots[j].y);
      if (d < spotSpacing + 5) {
        connections.push(new Connection(spots[i], spots[j]));
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let img_num = i * 4 + j;
      photos.push(new Picture(images[img_num], (1/8 + 1/4 * j) * canvasLength, (1/6 + 1/3 * i) * canvasHeight));
    }
  }
}

function draw() {
  background(0);
  if (state == STORY) {
    showStory();
    if (frameCount == storyFrames){
      for (let spot of spots) spot.reset();
      for (let c of connections) c.reset();
      state = STARMAP;
    }
  }
  else if (state == STARMAP) {
    for (let spot of spots) {
      spot.update();
      spot.display();
    }
    for (let c of connections) {
      c.update();
      c.display();
    }
    if (mouseX != lastMouseX || mouseY != lastMouseY || mouseX < 0 || mouseX > canvasLength || mouseY < 0 || mouseY > canvasHeight) {
      framesStayed = 0;
      lastMouseX = mouseX, lastMouseY = mouseY;
    }
    else framesStayed += 1;
    if (framesStayed == 150) {
      pic_id = int(mouseX / (canvasLength / 4)) + int(mouseY / (canvasHeight / 3)) * 4;
      if (photos[pic_id].notCorrupt){
        for (let spot of spots) {
          if (spot.follow) spot.alphaChange = -2;
          else spot.alphaChange = -5;
        }
        for (let c of connections) {
          if (c.a.follow && c.b.follow) c.alphaChange = -2;
          else c.alphaChange = -5;
        }
        
        if (!photos[pic_id].show) {
          photos[pic_id].show = true;
          photos[pic_id].notCorrupt = false;
          activeImg.push(pic_id);
        }
      }
    }
    let stateChange = true;
    for (let spot of spots) {
      if (spot.alpha > 0) {
        stateChange = false;
        break;
      }
    }
    if (stateChange) {
      for (let photo of photos) photo.reset();
      state = PHOTOBOOTH;
      framesStayed = 0;
    }
  }
  else if (state == PHOTOBOOTH) {
    framesStayed += 1;
    for (let photo of photos) {
      photo.update();
      photo.display();
    }
    if (framesStayed >= 150) {
      showPoem(backgroundText[activeImg[activeImg.length - 1]], framesStayed - 150);
      if (framesStayed >= 150 + descFrames) {
        for (let photo of photos) photo.alphaChange = -2;
      }
    }
    let stateChange = true;
    if (activeImg.length < 3) {
      for (let photo of photos) {
        if (photo.alpha > 0) {
          stateChange = false;
          break;
        }
      }
    }
    else {
      poemtxt = poemText[activeImg[0]] + '\n' + poemText[activeImg[1]] + '\n' + poemText[activeImg[2]];
      showPoem(poemtxt, framesStayed - descFrames - 150);
      if (framesStayed <= descFrames * 2 + 150) stateChange = false;
    }
    if (stateChange) {
      let allCorrupt = true;
      for (let photo of photos) {
        if (photo.notCorrupt) allCorrupt = false;
      }
      if (allCorrupt) state = ENDING;
      else {
        for (let spot of spots) spot.reset();
        for (let c of connections) c.reset();
        if (activeImg.length == 3) {
          activeImg = [];
          for (let photo of photos) photo.show = false;
        }
        framesStayed = 0;
        lastMouseX = -1, lastMouseY = -1;
        state = STARMAP;
      }
    }
  }
  else if (state == ENDING) {
    imageMode(CENTER);
    tint(255);
    image(loading_spinner, canvasLength / 2, canvasHeight / 2, canvasLength, canvasHeight);
  }
}

class Spot {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.alpha = 0;
    this.alphaChange = 0;
    this.follow = false;
  }

  update() {
    this.alpha += this.alphaChange;
    this.alpha = min(255, max(0, this.alpha))

    this.x += random(-1, 1);
    this.y += random(-1, 1);

    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < canvasLength / 8 && mouseX >= 0 && mouseX <= canvasLength && mouseY >= 0 && mouseY <= canvasHeight) {
      this.follow = true;
      this.x = lerp(this.x, mouseX, 0.05);
      this.y = lerp(this.y, mouseY, 0.05);
    }
    else this.follow = false;

    this.x = lerp(this.x, this.baseX, 0.01);
    this.y = lerp(this.y, this.baseY, 0.01);
  }

  display() {
    if (this.alpha > 0) {
      fill(255, this.alpha);
      noStroke();
      if (this.follow) ellipse(this.x, this.y, 7, 7);
      else ellipse(this.x, this.y, 5, 5);
    }
  }

  reset() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.alpha = 0;
    this.alphaChange = 2;
  }
}

class Connection {
  constructor(spotA, spotB) {
    this.a = spotA;
    this.b = spotB;
    this.alpha = 0;
    this.alphaChange = 0;
  }

  update() {
    this.alpha += this.alphaChange;
    this.alpha = min(255, max(0, this.alpha))
  }

  display() {
    let d = dist(this.a.x, this.a.y, this.b.x, this.b.y);
    if (d < canvasLength / 8 && this.a.alpha > 0 && this.b.alpha > 0) {
      stroke(255, map(d, 0, canvasLength / 8, 255, 0) * (this.alpha / 255));
      strokeWeight(1.5);
      line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
  }

  reset() {
    this.alpha = 0;
    this.alphaChange = 2;
  }
}

class Picture {
  constructor(pic, posX, posY) {
    this.pic = pic;
    this.posX = posX;
    this.posY = posY;
    this.show = false;
    this.notCorrupt = true;
    this.alpha = 0;
    this.alphaChange = 0;
  }

  update() {
    this.alpha += this.alphaChange;
    this.alpha = min(255, max(0, this.alpha))
  }

  display() {
    if (this.alpha > 0){
      if (this.show) {
        imageMode(CENTER);
        tint(255, this.alpha)
        image(this.pic, this.posX, this.posY, canvasLength / 4 - 10, canvasHeight / 3 - 10);
      }
      else {
        imageMode(CENTER);
        tint(255, this.alpha)
        image(loading_spinner, this.posX, this.posY, canvasLength / 4 - 10, canvasHeight / 3 - 10);
      }
    }
  }

  reset() {
    this.alpha = 0;
    this.alphaChange = 2;
  }
}

function showStory() {
  let alpha = 255, singleStoryFrames = storyFrames / storyText.length;
  if (frameCount % singleStoryFrames <= singleStoryFrames / 4) {
    alpha = map(frameCount % singleStoryFrames, 0, singleStoryFrames / 4, 0, 255);
  }
  else if (frameCount % singleStoryFrames >= singleStoryFrames / 4 * 3) {
    alpha = map(singleStoryFrames - frameCount % singleStoryFrames, 0, singleStoryFrames / 4, 0, 255);
  }
  console.log(alpha);

  noStroke();
  // fill(0, alpha);
  // rect(0, canvasHeight / 2 - 75, canvasLength, canvasHeight / 2 + 75);
  currentStory = int(frameCount / storyFrames * 5)
  textFont('Georgia');
  textSize(canvasLength * 0.03);
  textWrap(WORD);
  textAlign(LEFT, CENTER); 
  fill(255, alpha);
  text(storyText[currentStory], 50, canvasHeight / 2, canvasLength - 100);

  stroke(255, alpha);
  strokeWeight(3);
  line(50, canvasHeight / 4, canvasLength - 50, canvasHeight / 4);
  line(50, canvasHeight / 4 * 3, canvasLength - 50, canvasHeight / 4 * 3);
}

function showPoem(txt, frame) {
  let alpha = 255;
  if (frame < descFrames / 10) alpha = map(frame, 0, descFrames / 10, 0, 255);
  else if (frame > descFrames / 10 * 9) alpha = map(descFrames - frame, 0, descFrames / 10, 0, 255);
  
  noStroke();
  fill(0, alpha);
  rect(0, canvasHeight / 2 - 200, canvasLength, 400);
  textFont('Georgia');
  textSize(canvasLength * 0.016);
  textWrap(WORD);
  textAlign(LEFT, CENTER); 
  fill(255, alpha);
  text(txt, 50, canvasHeight / 2, canvasLength - 100);
}