let state = 0;

let bubbles = [];
let tank1;
let ammorefill;
let enemy;
let timer = 1;

let projectileXs = [];
let projectileYs = [];
let projectileVXs = [];
let projectileVYs = [];

let health = 15;
let ammo = 10;
let tankspeed;
let runnerspeed;

let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let img7;
let img8;


let img10;

let tank1Image;
let enemyImage;
let enemyImage2;
let bubbleImage;

let coin;
let coins = 0;




function preload() {
  img1 = loadImage("crosshair.png");
  img2 = loadImage("menu.png");
  img3 = loadImage("P2_wins.png");
  img4 = loadImage("p1_wins.png");
  img5 = loadImage("sky.png");
  img6 = loadImage("fireball.png");
  img7 = loadImage("ammo.png");
  img8 = loadImage("energy.png");
  
   font = loadFont("Game Text.ttf");
  
  img10 = loadImage("Space Invaders.png");

  tank1Image = loadImage("bluetank.png");
  enemyImage = loadImage("enemytank.png");
  enemyImage2 = loadImage("runner.png");
  bubbleImage = loadImage("meteor.png");
  
}

function setup() {
  createCanvas(600, 600);
  
  //used chatgbt for this code to prevent whole website screen from moving when using arrows
  window.addEventListener("keydown", function (e) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === " "
    ) {
      e.preventDefault();
    }
  });

  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(10, 50);

    let b = new Bubble(x, y, r, 0);
    bubbles.push(b);
  }

  tank1 = new Tank(550, 510, 20);
  ammorefill = new Ammorefill(random(width - 25), random(height - 25), 50, 50);
  enemy = new Enemy(50, 90, 20);
  coin = new Coin(random(width - 25), random(height - 25), 50, 50);
}

function draw() {
   imageMode(CORNER);
  textAlign(LEFT);
  background(0);
  image(img5, 0, 0, width, height);

  if (state == 0) {
    menu();
  }
  if (state == 1) {
    game();
  }
  if (state === 2) {
    runnerwin();
  }
  if (state === 3) {
    tankwin();
  }

  if (health === 0) {
    state = 2;
  }
  if (coins === 15) {
    state = 3;
  }
}

function game() {
  tankspeed = 2;
  runnerspeed = 3;

  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].rollover(enemy.x, enemy.y);
    bubbles[i].rollover(tank1.x, tank1.y);

    bubbles[i].move();
    bubbles[i].show();
  }

  timer = timer + 1;

  tank1.show();
  tank1.move();

  enemy.show();
  enemy.move();

  if (timer > 100) {
    coin.show();
  }

  if (ammo < 4) {
    ammorefill.show();
  }

  if (
    tank1.x + tank1.r > ammorefill.x &&
    tank1.x - tank1.r < ammorefill.x + ammorefill.w &&
    tank1.y + tank1.r > ammorefill.y &&
    tank1.y - tank1.r < ammorefill.y + ammorefill.h
  ) {
    ammorefill = new Ammorefill(
      random(width - 25),
      random(height - 25),
      50,
      50
    );
    ammo = 10;
  }
  //collision with coin
  if (
    enemy.x + enemy.r > coin.x &&
    enemy.x - enemy.r < coin.x + coin.w &&
    enemy.y + enemy.r > coin.y &&
    enemy.y - enemy.r < coin.y + coin.h
  ) {
    timer = 0;
    coin = new Coin(random(width - 25), random(height - 25), 50, 50);
    coins = coins + 1;
  }
  drawProjectiles();

  textDisplay();
}

//Chatgpt draw projectiles
function drawProjectiles() {
  for (let i = 0; i < projectileXs.length; i++) {
   imageMode(CENTER);
image(img6, projectileXs[i], projectileYs[i], 25, 25); // Projectile size is 20 (radius 10)
    projectileXs[i] += projectileVXs[i];
    projectileYs[i] += projectileVYs[i];

    // Use the correct radius when checking for collisions
    if (enemy.overlap(projectileXs[i], projectileYs[i], 10)) {
      // 10 is the radius of the projectile
      console.log("hit");
      health -= 1;

      // Remove projectile if hit
      projectileXs.splice(i, 1);
      projectileYs.splice(i, 1);
      projectileVXs.splice(i, 1);
      projectileVYs.splice(i, 1);
      i--;
    }

    // Remove projectile if it goes off the screen
    if (
      projectileXs[i] > width ||
      projectileXs[i] < 0 ||
      projectileYs[i] > height ||
      projectileYs[i] < 0
    ) {
      projectileXs.splice(i, 1);
      projectileYs.splice(i, 1);
      projectileVXs.splice(i, 1);
      projectileVYs.splice(i, 1);
      i--;
    }
  }
}

function textDisplay() {
  fill(255);
  textSize(16);
  text("Ammo: " + ammo, width - 105, height / 25);

  fill(255);
  textSize(16);
  text("Energy: " + coins, width - 590, height / 25);

  fill(255);
  textSize(16);
  text("health: " + health, width - 590, height / 13);

  noCursor();
  image(img1, mouseX - 17, mouseY - 17, 35, 35);
}

//Chatgpt projectile angles
function mousePressed() {
  if ((ammo > 0) & (state === 1)) {
    let angle = atan2(mouseY - tank1.y, mouseX - tank1.x);
    let speed = 5;
    projectileXs.push(tank1.x);
    projectileYs.push(tank1.y);
    projectileVXs.push(cos(angle) * speed);
    projectileVYs.push(sin(angle) * speed);
    ammo -= 1;
  }
}

class Tank {
  constructor(tempX, tempY, tempR) {
    this.x = tempX;
    this.y = tempY;
    this.r = tempR;
  }

  move() {
    if (keyIsDown(UP_ARROW)) {
      this.y -= tankspeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += tankspeed;
    }
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= tankspeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += tankspeed;
    }

    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }

  show() {
    noStroke();
    fill(0, 0, 255);
    image(tank1Image, this.x, this.y, 80, 60);
  }
}

class Ammorefill {
  constructor(tempX, tempY, tempW, tempH) {
    this.x = tempX;
    this.y = tempY;
    this.w = tempW;
    this.h = tempH;
  }

  show() {
    imageMode(CORNER);
image(img7, this.x, this.y, this.w, this.h);
  }
}

class Enemy {
  constructor(tempX, tempY, tempR) {
    this.x = tempX;
    this.y = tempY;
    this.r = tempR;
  }

  show() {
    noStroke();
    image(enemyImage, this.x, this.y, 80, 60);
  }

  //overlap to check if the enemy is hit buy projectile
  overlap(objectX, objectY, objectR) {
    let d = dist(this.x, this.y, objectX, objectY);

    if (d < this.r * 0.5 + objectR) {
      return true;
    } else {
      return false;
    }
  }

  move() {
    if (keyIsDown(87)) {
      this.y -= runnerspeed;
    }
    if (keyIsDown(83)) {
      this.y += runnerspeed;
    }
    if (keyIsDown(65)) {
      this.x -= runnerspeed;
    }
    if (keyIsDown(68)) {
      this.x += runnerspeed;
    }
    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }
}

class Coin {
  constructor(tempX, tempY, tempW, tempH) {
    this.x = tempX;
    this.y = tempY;
    this.w = tempW;
    this.h = tempH;
  }

  show() {
       imageMode(CORNER); // or CENTER if you prefer centering
    image(img8, this.x, this.y, this.w, this.h);
  }
}

class Bubble {
  constructor(tempX, tempY, tempR, tempB) {
    this.x = tempX;
    this.y = tempY;
    this.r = tempR;
  }

  rollover(px, py) {
    let d = dist(px, py, this.x, this.y);

    if (d < this.r) {
      if (px === enemy.x && py === enemy.y) {
        runnerspeed = 1;
      }
      if (px === tank1.x && py === tank1.y) {
        tankspeed = 0.5;
      }
    }
  }

  move() {
    this.x = this.x + random(-2, 2);
    this.y = this.y + random(-2, 2);
    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }

  show() {
    imageMode(CENTER);
image(bubbleImage, this.x, this.y, this.r * 2, this.r * 2);
  }
}

function menu() {
  background(0);
  imageMode(CORNER);
  image(img10, 65, 65, 525, 375);

  fill(255, 255, 0);
  textSize(35);
  textFont(font);
  text("ALien Warfare", 120, 50);
      fill(255, 255, 0);
   textSize(17);
   text("Press Space to start|Return to restart", 15, 430);
  fill(0, 0, 255);
  textSize(12);
  text("Player 1 Controls: Up, Down, Left Right Arrows to move and ", 15, 450);
  text("click to shoot", 15, 470);
   text("Player 1 Objective: Stop the enemy alien from collecting", 15, 490);
    text("all the energons by shooting it down and refiling your ammo by ", 15, 510);
    text("entering ammo zones", 15, 530);
  
   fill(255, 0, 0);
  text("Player 2 Controls: use w, a, s, d to move", 15, 550);
    text("Player 2 Objective: Collect 15 energons and avoid being ", 15, 570);
    text("shot down to escape", 15, 590);
   
}

function keyPressed() {
  if (state === 0 && keyCode === 32) {
    state = 1;
  }

  if ((state === 2 || state === 3) && keyCode === 13) {
    state = 0;
    health = 10;
    ammo = 10;
    coins = 0;
    timer = 1;
    tank1.x = 550;
    tank1.y = 560;
    enemy.x = 50;
    enemy.y = 60;

    projectileXs = [];
    projectileYs = [];
    projectileVXs = [];
    projectileVYs = [];
  }
}

function runnerwin() {
  imageMode(CORNER);
  image(img4, 0, 0, width, height);
    fill(0,0,255);
  textSize(30)
  textAlign(CENTER);
   text("Player 1", 300, 150);
     text("Wins", 300, 485);
}

function tankwin() {
imageMode(CORNER);
    image(img3, 0, 0, width, height);

     fill(255,0,0);
  textSize(30)
  textAlign(CENTER);
   text("Player 2", 300, 150);
     text("Wins", 300, 485);

}

