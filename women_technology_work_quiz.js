let totalImages = 30; // 6 questions × 5 images
let imagePrefix = "brush";
let imageExtension = ".jpg";

let images = [];
let imageSets = [];
let questions = [];
let feedbackTexts = [];

let imagesPerSet = 5;
let numQuestions = 6;

let currentSet = 0;
let currentImageIndex = 0;

let showImage = true;
let showFeedback = false;
let showFinal = false;

let frameInterval = 15;
let lastSwitchFrame = 0;

let linkURL = "https://sarahbuckius.com";
let finalLink;

let imgW, imgH;
let baseFont;

function preload() {
  for (let i = 1; i <= totalImages; i++) {
    images.push(loadImage(`${imagePrefix}${i}${imageExtension}`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  updateSizing();

  for (let i = 0; i < images.length; i += imagesPerSet) {
    imageSets.push(images.slice(i, i + imagesPerSet));
    questions.push("Which image speaks to you the most? (Set " + (i / imagesPerSet + 1) + ")");
    feedbackTexts.push("You selected from set " + (i / imagesPerSet + 1) + ".");
  }

  finalLink = createA(linkURL, "Click here to continue", "_blank");
  finalLink.style("color", "#00ffff");
  finalLink.style("font-size", `${baseFont}px`);
  finalLink.style("text-decoration", "none");
  finalLink.hide();

  lastSwitchFrame = frameCount;
}

function draw() {
  background(30);
  fill(255);
  textSize(baseFont);

  if (showFinal) {
    textSize(baseFont * 1.2);
    text("Thank you!", width / 2, height / 2 - imgH / 2);
    finalLink.position(width / 2 - finalLink.elt.offsetWidth / 2, height / 2 + imgH / 4);
    finalLink.show();
    return;
  } else {
    finalLink.hide();
  }

  if (showFeedback) {
    textSize(baseFont);
    text(feedbackTexts[currentSet], width / 2, height / 2 - 20);
    text("Click to continue.", width / 2, height / 2 + 20);
    return;
  }

  textSize(baseFont * 1.2);
  text(questions[currentSet], width / 2, baseFont * 1.6);

  if (showImage) {
    if (frameCount - lastSwitchFrame >= frameInterval) {
      currentImageIndex = (currentImageIndex + 1) % imageSets[currentSet].length;
      lastSwitchFrame = frameCount;
    }

    imageMode(CENTER);
    let img = imageSets[currentSet][currentImageIndex];
    image(img, width / 2, height / 2 + 20, imgW, imgH);
  }
}

function mousePressed() {
  if (showFeedback) {
    currentSet++;
    if (currentSet >= numQuestions) {
      showFinal = true;
    } else {
      currentImageIndex = 0;
      lastSwitchFrame = frameCount;
      showImage = true;
      showFeedback = false;
    }
    return;
  }

  if (showImage) {
    showImage = false;
    showFeedback = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateSizing();
}

// Dynamically scale sizes based on screen size
function updateSizing() {
  imgW = min(width, height) * 0.6;
  imgH = imgW;
  baseFont = width < 500 ? 16 : 20;
}
