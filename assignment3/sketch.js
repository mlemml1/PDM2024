let guys;

function preload() {
}

function setup() {
  createCanvas(400, 400);

  guys = [];

  guys.push(new SpelunkyGuy(50, 200, 'assets/SpelunkyGuy.png'));
  guys.push(new SpelunkyGuy(150, 150, 'assets/Green.png'));
  guys.push(new SpelunkyGuy(220, 150, 'assets/Robot.png'));
}

function draw() {
  background(100);

  for (let i = 0; i < guys.length; i++) {
    guys[i].update();
  }
}

function keyTyped() {
  for (let i = 0; i < guys.length; i++) {
    guys[i].keyDown();
  }
}

class SpelunkyGuy {
  constructor(x, y, sheet) {
    this.sprite = new Sprite(x, y, 80, 80);
    this.sprite.spriteSheet = sheet;
    this.sprite.anis.frameDelay = 8;

    this.sprite.addAnis({
      stand: {row: 0, frames: 1},
      walkRight: {row: 0, col: 1, frames: 8},
      walkUp: {row: 5, frames: 6},
      walkDown: {row: 5, col: 6, frames: 6}
    });

    this.sprite.changeAni('stand');
    // dont collide with other sprites
    this.sprite.collider = 'none';
  }

  update() {
    this.sprite.rotation = 0;

    if (kb.pressing('a')) {
      this.walkLeft();

      if (this.sprite.x - this.sprite.width/4 < 0) {
        // this.walkRight();
        this.stop();
      }
    }
    else if (kb.pressing('d')) {
      this.walkRight();

      if (this.sprite.x + this.sprite.width/4 > width) {
        // this.walkLeft();
        this.stop();
      }
    }
    else if (kb.pressing('w')) {
      this.walkUp();

      if (this.sprite.y - this.sprite.height/4 < 0) {
        // this.walkDown();
        this.stop();
      }
    }
    else if (kb.pressing('s')) {
      this.walkDown();

      if (this.sprite.y + this.sprite.height/4 > height) {
        // this.walkUp();
        this.stop();
      }
    }
    else
      this.stop();
  }

  walkLeft() {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = -1;
    this.sprite.vel.y = 0;
    this.sprite.scale.x = -1;
  }

  walkRight() {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = 1;
    this.sprite.vel.y = 0;
    this.sprite.scale.x = 1;
  }

  walkUp() {
    this.sprite.changeAni('walkUp');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = -1;
    // this.sprite.scale.x = 1;
  }

  walkDown() {
    this.sprite.changeAni('walkDown');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 1;
    // this.sprite.scale.x = 1;
  }

  stop() {
    this.sprite.changeAni('stand');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
  }
}