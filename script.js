class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
  }

  draw(context) {
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.game.keys.indexOf("ArrowLeft") >= 0) this.x -= this.speed;
    if (this.game.keys.indexOf("ArrowRight") >= 0) this.x += this.speed;

    // Horizontal boundaries
    if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    else if (this.x > this.game.width - this.width * 0.5)
      this.x = this.game.width - this.width * 0.5;
  }

  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
  }
}

class Projectile {
  constructor() {
    this.height = 40;
    this.width = 8;
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) this.reset();
    }
  }

  start(x, y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.free = false;
  }

  reset() {
    this.free = true;
  }
}

class Enemy {
  constructor(game) {
    this.game = game;
    this.width;
    this.height;
    this.x = 0;
    this.y = 0;
  }

  draw(context) {
    context.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {}
}

class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;
    this.x;
    this.y;
  }

  render() {
    // TODO: Take it from here (35:40)
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.keys = [];

    this.projectilePool = [];
    this.numberOfProjectiles = 10;
    this.createProjectiles();

    this.columns = 3;
    this.rows = 3;
    this.enemySize = 60;

    window.addEventListener("keydown", (event) => {
      if (!this.keys.includes(event.key)) this.keys.push(event.key);
      if (event.key === "1") this.player.shoot();
    });

    window.addEventListener("keyup", (event) => {
      const keyIdx = this.keys.findIndex((key) => event.key === key);
      if (keyIdx >= 0) this.keys.splice(keyIdx, 1);
    });
  }

  // Draws and updates the game, runs 60 times per second
  render(context) {
    this.player.draw(context);
    this.player.update();
    this.projectilePool.forEach((projectile) => {
      projectile.draw(context);
      projectile.update();
    });
  }

  // Create projectiles object pool
  createProjectiles() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      this.projectilePool.push(new Projectile());
    }
  }

  getProjectile() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      if (this.projectilePool[i].free) return this.projectilePool[i];
    }
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  canvas.width = 600;
  canvas.height = 800;
  ctx.fillStyle = "white";

  const game = new Game(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
