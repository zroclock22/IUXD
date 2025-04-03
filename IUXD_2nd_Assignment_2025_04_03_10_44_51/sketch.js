// 6가지 색의 원 관련 변수 선언
let colors = [
  [255, 255, 100], // Yellow
  [71, 205, 255], // Blue
  [255, 94, 94], // Red
  [255, 172, 255], // Pink
  [231, 231, 231], // Gray
  [51, 51, 51], // Charcoal
];

let labels = ["Yellow", "Blue", "Red", "Pink", "Gray", "Charcoal"];
let cols = 3,
  rows = 2;
let gap = 20;
let circleSize = 138;
let paddingX = 20,
  paddingY = 81;

let blendBoxX = gap,
  blendBoxY = 397;
let blendBoxSize = circleSize;

let currentColor; // 선택된 색을 저장할 변수
let penSize = 10; // 초기 펜 크기
let penSizeSlider; // 슬라이더 객체

let currentBlendMode; // 선택한 블렌드 모드를 저장할 변수(초기 값은 BLEND)
let isDrawing = false;

let showPopup = false; // 팝업 상태 변수

function preload() {
  picNicFont = loadFont("PicNic-Regular.otf"); // 폰트 로드

  // 이미지 로드
  multiplyImage = loadImage("multiplyImage.png");
  overlayImage = loadImage("overlayImage.png");
  normalImage = loadImage("normalImage.png");
}

function setup() {
  createCanvas(1440, 900);
  background(255);
  pixelDensity(4);

  currentColor = colors[0]; // 기본 색은 Yellow

  noStroke();

  uiLayer = createGraphics(494, 839-200);
  uiLayer.background(255);

  paintLayer = createGraphics(946, 839-200);
  paintLayer.clear();

  popupLayer = createGraphics(452, 184);
  popupLayer.background(255);

  // 펜 크기 슬라이더 생성
  penSizeSlider = createSlider(1, 20, penSize, 1); // 최소 1, 최대 20, 기본값 5
  penSizeSlider.position(20, 575);
  penSizeSlider.style("width", "200px"); // 슬라이더 길이 설정
}

function draw() {
  // 상단 그리기
  noStroke();
  fill(255);
  rect(0, 0, 1440, 60);

  textFont(picNicFont);
  textSize(43);
  fill(0);
  textAlign(LEFT, CENTER);
  text("Goorim Pan", 20, 20);
  textAlign(CENTER, CENTER);
  text("About", width / 2, 20);

  // 팝업 레이어 표시
  if (showPopup) {
    drawPopup();
  } else;

  image(uiLayer, 0, 61);
  image(paintLayer, 494, 61);

  // 6가지 색의 원 그리기
  let startX = paddingX + circleSize / 2;
  let startY = paddingY + circleSize / 2;

  textFont("IBM Plex Mono");
  textSize(16);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let index = i * cols + j;
      let x = startX + j * (circleSize + gap);
      let y = startY + i * (circleSize + gap);

      // 원 스타일 설정
      stroke(0);
      strokeWeight(1);
      fill(colors[index]);
      ellipse(x, y, circleSize, circleSize);

      // 텍스트 표시
      fill(0);
      text(labels[index], x, y);

      // 색 선택 인터랙션
      if (dist(mouseX, mouseY, x, y) < circleSize / 2 && mouseIsPressed) {
        currentColor = colors[index]; // 선택된 색을 currentColor에 저장
      }
    }
  }

  // 블렌드 모드 사각형 그리기
  fill(200);
  stroke(0);
  strokeWeight(1);

  image(multiplyImage, blendBoxX, blendBoxY, blendBoxSize, blendBoxSize);
  image(
    overlayImage,
    blendBoxX + blendBoxSize + gap,
    blendBoxY,
    blendBoxSize,
    blendBoxSize
  );
  image(
    normalImage,
    blendBoxX + (blendBoxSize + gap) * 2,
    blendBoxY,
    blendBoxSize,
    blendBoxSize
  );

  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Multiply", blendBoxX + blendBoxSize / 2, blendBoxY + blendBoxSize / 2);
  text(
    "Overlay",
    blendBoxX + blendBoxSize + gap + blendBoxSize / 2,
    blendBoxY + blendBoxSize / 2
  );
  text(
    "Normal",
    blendBoxX + (blendBoxSize + gap) * 2 + blendBoxSize / 2,
    blendBoxY + blendBoxSize / 2
  );

  // 펜 크기 업데이트
  penSize = penSizeSlider.value(); // 슬라이더 값으로 펜 크기 업데이트

  // 펜 크기 표시
  stroke(0);
  strokeWeight(1);
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Pen Size: " + penSize, 20, 555);

  paintLayer.textSize(32);
  paintLayer.textAlign(CENTER, CENTER);
  paintLayer.fill(100);
  paintLayer.textFont(picNicFont);
  paintLayer.textSize(43);
  paintLayer.strokeWeight(penSize);
  paintLayer.text(
    "Draw Anything!",
    paintLayer.width / 2,
    paintLayer.height / 2
  );

  if (mouseIsPressed && mouseY > 61) {
    paintLayer.blendMode(currentBlendMode);
    paintLayer.stroke(currentColor);
    paintLayer.strokeWeight(penSize);
    paintLayer.line(pmouseX - 494, pmouseY - 61, mouseX - 494, mouseY - 61);
  }

  // 주의사항 텍스트
  noStroke();
  textSize(16);
  textFont("Noto Sans KR");
  textAlign(LEFT, CENTER);

  let cautionText =
    "원을 드래그하여 색을 고르고, 사각형을 클릭하여 혼합 모드를 골라보세요. 색을 바꿔가면서 그렸을 때 혼합 모드의 효과가 잘 보여요!";
  text(cautionText, 20, 650, 454);

  // 라인 그리기
  stroke(0);
  strokeWeight(1);

  line(20, 61, 20 + 464, 61);
  line(505, 61, 505 + 432, 61);
  line(956, 61, 906 + 464, 61);
  line(20 + 464 + 10, 61 + 10-1, 20 + 464 + 10, 61 + 10 + 818-1);
  line(20, 61 + 838-1, 20 + 464, 61 + 838-1);
  
  line(505, 61 + 838, 1440 - 20, 61 + 838);
  line(1440 - 20, 71, 1440 - 20, 900 - 1-20);

  if (!isDrawing) {
    currentBlendMode = BLEND;
  }
}

function mousePressed() {
  isDrawing = true;
  if (mouseX > 650 && mouseX < 850 && mouseY < 61) {
    showPopup = true;
    return;
  }

  if (
    mouseX > blendBoxX &&
    mouseX < blendBoxX + blendBoxSize &&
    mouseY > blendBoxY &&
    mouseY < blendBoxY + blendBoxSize
  ) {
    currentBlendMode = MULTIPLY;
  } else if (
    mouseX > blendBoxX + blendBoxSize + gap &&
    mouseX < blendBoxX + 2 * blendBoxSize + gap &&
    mouseY > blendBoxY &&
    mouseY < blendBoxY + blendBoxSize
  ) {
    currentBlendMode = OVERLAY;
  } else if (
    mouseX > blendBoxX + 2 * (blendBoxSize + gap) &&
    mouseX < blendBoxX + 3 * blendBoxSize + 2 * gap &&
    mouseY > blendBoxY &&
    mouseY < blendBoxY + blendBoxSize
  ) {
    currentBlendMode = BLEND;
  }
  
  if(
  mouseX > 0 &&
  mouseX < 220 &&
  mouseY > 0 &&
  mouseY < 61){
    paintLayer.background(255);
  }
}


function drawPopup() {
  // 팝업 레이어 그리기

  noStroke();
  fill(255);
  popupLayer.rect(0, 0, 452, 184); // 팝업 박스

  fill(0);
  popupLayer.textSize(16);
  popupLayer.textFont("Noto Sans KR");
  popupLayer.textAlign(LEFT, CENTER);

  let aboutText =
    "그림판은 빠르고 간단하게 이미지를 편집하거나 낙서를 할 수 있는 도구입니다. 누구나 쉽게 다룰 수 있어 포토샵과 같은 그래픽 디자인 소프트웨어 대신 쓰는 도구이기도 하지요. 일반인들도 그림판으로 예술적인 작품을 만들 수 있다면 어떨까요? 최소한의 노력만으로도요. Goorim Pan은 시간이 넉넉지 않더라도, 경험이 적더라도, 미적 감각이 부족하더라도 심미적인 작품을 만들 수 있도록 도와줍니다. 창작의 즐거움을 경험할 수 있도록요.";
  popupLayer.text(aboutText, 20, 0, 400, 184);

  stroke(0);
  strokeWeight(1);
  popupLayer.line(10, 183, 10 + 432, 183);
  popupLayer.line(451, 10, 451, 184 - 10);
  image(popupLayer, 494, 61);
}
