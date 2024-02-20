let bugs;
let width = 800;
let height = 800;
let score;
let time;
let bugSheet;

function setup() {
  createCanvas(width, height);
  bugSheet = 'assets/Bug.png';

  bugs = [];
  for (let i = 0; i < 50; i++)
  {
    let bug = new Bug();
    bugs.push(bug);
  }

  resetGame();
}

function resetGame() {
  score = 0;
  time = 30;
  for (let i = 0; i < bugs.length; i++) {
    let velX = Math.random() * 2.0 - 1.0;
    let velY = Math.random() * 2.0 - 1.0;
    bugs[i].reset(Math.random() * width, Math.random() * height, velX, velY);
  }

  // Countdown timer.
  var timer = setInterval(function() {
    time--;
    if (time < 0) {
      time = 0;
      clearInterval(timer);
    }
  }, 1000);
}

function draw() {
  // Game over.
  if (time <= 0) {
    fill('white');
    stroke('black');
    strokeWeight(4);
    textSize(36);
    textFont('Comic Sans MS');
  
    text(`Game Over!`, width / 2 - 100, height / 2);
    text(`Click to Retry`, width / 2 - 115, height / 2 + 50);

    if (mouse.pressing())
      resetGame();
    return;
  }

  background(220);

  mouse.cursor = 'default';
  for (let i = 0; i < bugs.length; i++)
    bugs[i].update();

  fill('purple');
  stroke('gold');
  strokeWeight(4);
  textSize(36);
  textFont('Comic Sans MS');

  text(`Score: ${score}`, 16, 58);
  text(`Time Remaining: ${time}`, 16, 110);
}

function increaseDifficulty() {
  score++;
  for (let i = 0; i < bugs.length; i++)
    bugs[i].doubleSpeed();
}

class Bug {
  constructor() {
    this.sprite = new Sprite(0, 0, 64, 64);
    this.sprite.spriteSheet = bugSheet;

    this.sprite.addAnis({
      walk: {row: 0, frames: 4},
      squish: {row: 0, col: 4, frames: 1},
      dead: {row: 0, col: 5, frames: 1}
    });

  }

  reset(x, y, velX, velY) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.squishing = false;
    this.dead = false;
    this.sprite.anis.frameDelay = 4;

    this.sprite.changeAni('walk');

    // dont collide with other sprites
    this.sprite.collider = 'kinematic';

    this.sprite.vel.x = velX;
    this.sprite.vel.y = velY;

    this.sprite.autoDraw = false;
  }

  doubleSpeed() {
    if (this.dead)
      return;

    this.sprite.vel.x *= 1.25;
    this.sprite.vel.y *= 1.25;
  }

  updateAniSpeed() {
    let velX = this.sprite.vel.x;
    let velY = this.sprite.vel.y;

    let vel = Math.sqrt(velX * velX + velY * velY);
    let frameDelay = 8 - vel * 0.5;
    if (frameDelay < 0)
      frameDelay = 0;

    this.sprite.anis.frameDelay = Math.round(frameDelay);
  }

  update() {
    this.updateAniSpeed();
    this.sprite.draw();

    if (this.dead)
      return;

    if (this.sprite.x - this.sprite.width/4 < 0) {
      this.sprite.vel.x = abs(this.sprite.vel.x);
    }
    if (this.sprite.x + this.sprite.width/4 > width) {
      this.sprite.vel.x = -abs(this.sprite.vel.x);
    }
    if (this.sprite.y - this.sprite.height/4 < 0) {
      this.sprite.vel.y = abs(this.sprite.vel.y);
    }
    if (this.sprite.y + this.sprite.height/4 > height) {
      this.sprite.vel.y = -abs(this.sprite.vel.y);
    }

    if (this.sprite.mouse.pressing()) {
      this.squishing = true;
      this.sprite.vel.x = 0;
      this.sprite.vel.y = 0;
      this.sprite.changeAni('squish');
    }
    else {
      if (this.sprite.mouse.hovering()) {
        mouse.cursor = 'grab';
  
        if (this.squishing) {
          // we died!
          this.squishing = false;
          this.dead = true;
          this.sprite.changeAni('dead');

          increaseDifficulty();
        }
      }
      else if (this.squishing) {
        // user let us go
        this.squishing = false;
        this.sprite.changeAni('walk');
        let velX = Math.random() * 10.0 - 5.0;
        let velY = Math.random() * 10.0 - 5.0;
        this.sprite.vel.x = velX;
        this.sprite.vel.y = velY;
      }
      else {
        this.sprite.rotation = this.sprite.direction + 90;

      }
    }

  }
}