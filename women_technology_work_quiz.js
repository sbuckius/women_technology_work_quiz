let imagesData = [];
let boxes = [];
let result = "";
let question = 'Which image represents "work"?';
let correctLabel;
let timeLimit = 10;
let timeLeft;
let points = 0;
let level = 1;
let badge = "";
let gameActive = true;
let numImages = 30;
let imagesToDisplay = 6;
let maxLevels = 5;

let correctSound, wrongSound;
let nextPageShown = false;

function preload() {
  for (let i = 1; i <= numImages; i++) {
    let label = "Image" + i;
    let filename = `brush${i}.jpg`;
    let img = loadImage(filename);
    imagesData.push({ filename, label, img });
  }

  soundFormats('mp3', 'wav');
  correctSound = loadSound('sound3.mp3');
  wrongSound = loadSound('sound5.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CORNER);
  frameRate(30);
  startLevel();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  startLevel(); // re-layout on resize
}

function startLevel() {
  boxes = [];
  result = "";
  gameActive = true;
  timeLeft = timeLimit * 30;

  let selectedImages = shuffle(imagesData).slice(0, imagesToDisplay);
  let correctIndex = floor(random(selectedImages.length));
  correctLabel = selectedImages[correctIndex].label;

  for (let i = 0; i < selectedImages.length; i++) {
    selectedImages[i].isWork = (i === correctIndex);
  }

  let spacing = width / selectedImages.length;
  let boxSize = min(width, height) / 5;

  for (let i = 0; i < selectedImages.length; i++) {
    boxes.push({
      img: selectedImages[i].img,
      label: selectedImages[i].label,
      isWork: selectedImages[i].isWork,
      x: i * spacing + spacing / 2 - boxSize / 2,
      y: height / 2 - boxSize / 2,
      w: boxSize,
      h: boxSize
    });
  }
}

function draw() {
  background(193, 8, 85);

  if (gameActive) {
    timeLeft--;
    if (timeLeft <= 0) {
      result = "⏱ Time's Up!";
      gameActive = false;
      setTimeout(startLevel, 1000);
    }
  }

  fill(0);
  textSize(height * 0.03);
  text(`Level ${level} — ${question}`, width / 2, height * 0.05);

  for (let box of boxes) {
    image(box.img, box.x, box.y, box.w, box.h);
  }

  if (result) {
    textSize(height * 0.04);
    fill(result === "You Win!" ? "green" : "red");
    text(result, width / 2, height - height * 0.1);
  }

  textSize(height * 0.025);
  fill(0);
  text(`⏳ ${Math.ceil(timeLeft / 30)}s`, width - 60, 30);
  text(`⭐ Points: ${points}`, 100, 30);
  if (badge) {
    text(`🏅 Badge: ${badge}`, width / 2, height - 20);
  }

  if (!gameActive && level > maxLevels && !nextPageShown) {
    showNextLink();
    nextPageShown = true;
  }
}

function mousePressed() {
  if (!gameActive) return;

  for (let box of boxes) {
    if (
      mouseX > box.x &&
      mouseX < box.x + box.w &&
      mouseY > box.y &&
      mouseY < box.y + box.h
    ) {
      gameActive = false;

      if (box.isWork) {
        correctSound.play();
        result = "You Win!";
        let bonus = Math.ceil(timeLeft / 30) * 10;
        points += bonus;

        if (points >= 300 && !badge) badge = "Work Wizard";
        else if (points >= 150 && !badge) badge = "Productivity Pro";
        else if (points >= 75 && !badge) badge = "Office Rookie";

        setTimeout(() => {
          level++;
          if (level > maxLevels) {
            // end game, show link
          } else {
            startLevel();
          }
        }, 1000);
      } else {
        wrongSound.play();
        result = "❌ Try Again!";
        setTimeout(startLevel, 1000);
      }
      break;
    }
  }
}

function showNextLink() {
  let link = createA(
    "https://sbuckius.github.io/robot_instruction_01/",
    "→ Continue to the next experience",
    "_self"
  );
  link.position(width / 2 - 120, height - 40);
  link.style("font-size", `${height * 0.025}px`);
  link.style("color", "blue");
  link.style("text-decoration", "none");
}
