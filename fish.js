class Fish {
  constructor() {
    this.width = 60;
    this.speed = 3;
    this.range = 200;
    this.hunger = 100;
    this.head = Math.random() * 2 * Math.PI;

    this.position = new Vector2(
      Math.random() * canvas.width,
      sealevel + this.range + Math.random() *
      (canvas.height - sealevel - this.range)
    );

    this.velocity = angleToVector(this.head).scale(this.speed);
    this.avoidanceSurface = new Vector2();
    this.avoidanceBottom = new Vector2();
    this.leveling = new Vector2();
    this.avoidanceSurfaceConstant = 0.5;
    this.avoidanceBottomConstant = 0.1;
    this.levelingConstant = 0.02;

    this.frameIndex = 0;
  }

  move() {
    this.velocity = this.velocity.add(
      this.leveling,
      this.avoidanceSurface,
      this.avoidanceBottom,
    )
    this.velocity = this.velocity.normalize(this.speed);
    this.head = vectorToAngle(this.velocity);
    this.position = this.position.add(this.velocity);

    if (this.position.x < -this.width) 
      this.position.x = canvas.width + this.width
    else if (this.position.x > canvas.width + this.width)
      this.position.x = -this.width
  }
  
  starve() {
    this.hunger -= 0.01;
    return this.hunger < 0 ? true : false
  }

  inNeighborhood(fish) {
    const relPos = fish.position.sub(this.position);
    const dis = relPos.magnitude();

    const cos =
      this.velocity.dot(relPos) /
      this.velocity.magnitude() /
      relPos.magnitude();

    if (dis < this.range && cos < 1 && cos > Math.cos((Math.PI * 3) / 4))
      return true;
    else return false;
  }
  
  avoidBottom() {
    this.avoidanceBottom.set(0, 0);
    if (this.position.y > canvas.height - this.range) 
      this.avoidanceBottom.y = 
        -this.avoidanceBottomConstant / this.range ** 2 * 
        (this.position.y - (canvas.height - this.range)) ** 2
  }

  avoidSurface() {
    this.avoidanceSurface.set(0, 0);
    if (this.position.y < this.range + sealevel) 
      this.avoidanceSurface.y = 
        this.avoidanceSurfaceConstant / this.range ** 2 *
        (this.position.y - (sealevel + this.range)) ** 2
  }

  level() {
    this.leveling.set(this.velocity.x, 0);
    this.leveling = this.leveling.normalize(this.levelingConstant);
  }

  draw() {
    const frame = this.frameSet.frames[this.frameIndex];

    context.save()
    context.translate(this.position.x, this.position.y)
    if (this.velocity.x > 0) {
      context.rotate(this.head)
    } else {
      context.rotate(this.head - Math.PI)
      context.scale(-1, 1)
    }
    context.drawImage(
        frame.img,
        frame.x, 
        frame.y,
        frame.width, 
        frame.height, 
        -this.width / 2,
        -this.width * frame.height / frame.width / 2,
        this.width,
        this.width * frame.height / frame.width
    )
    context.restore()

    this.frameIndex++;
    if (this.frameIndex >= this.frameSet.frames.length)
      this.frameIndex = 0;
}
}

class SchoolingFish extends Fish {
  constructor() {
    super();
    this.avoidance = new Vector2();
    this.avoidanceShark = new Vector2();
    this.alignment = new Vector2();
    this.cohesion = new Vector2();
    this.avoidanceConstant = 0.06;
    this.avoidanceSharkConstant = 0.4;
    this.alignmentConstant = 0.07;
    this.cohesionConstant = 0.06;
    this.frameSet = assets.frameSets.schoolingFish;
  }

  move() {
    super.move()
    this.velocity = this.velocity.add(
      this.avoidance,
      this.avoidanceShark,
      this.alignment,
      this.cohesion,
    );
  }

  avoid(fishes) {
    this.avoidance.set(0, 0);

    for (const fish of fishes) {
      if (this.inNeighborhood(fish)) {
        this.avoidance = this.avoidance.add(
          this.position.sub(fish.position).normalize()
        );
      }
    }

    this.avoidance = this.avoidance.normalize(this.avoidanceConstant)
  }

  align(fishes) {
    this.alignment.set(0, 0);

    for (const fish of fishes) {
      if (this.inNeighborhood(fish)) {
        this.alignment = this.alignment.add(fish.velocity)
      }
    }

    this.alignment = this.alignment.normalize(this.alignmentConstant);
  }

  coerce(fishes) {
    this.alignment.set(0, 0);
    
    for (const fish of fishes) {
      if (this.inNeighborhood(fish)) {
        this.cohesion = this.cohesion.add(
          fish.position.sub(this.position)
        );
      }
    }

    this.cohesion = this.cohesion.normalize(this.cohesionConstant)
  }

  avoidShark(sharks) {
    this.avoidanceShark.set(0, 0);

    for (const shark of sharks) {
      if (this.inNeighborhood(shark)) {
        this.avoidanceShark = this.avoidanceShark.add(
          this.position.sub(shark.position)
        );
      }
    }

    this.avoidanceShark = this.avoidanceShark
      .normalize(this.avoidanceSharkConstant);
  }
}

class Shark extends Fish {
  constructor() {
    super();
    this.size = 3;
    this.speed = 5;
    this.range = 200;
    this.eatRange = 10;
    this.chaseFish = new Vector2()
    this.chaseFishConstant = 0.1;
    this.target = undefined;
  }

  static images = []
  
  static build() {

  }

  move() {
    super.move()
    this.velocity = this.velocity.add(
      this.chaseFish
    );
  }
  
  inEatRange(fish) {
    const relPos = fish.position.sub(this.position);
    const dis = relPos.magnitude();

    return dis < this.eatRange ? true : false;
  }

  chase(fishes) {
    this.chaseFish.set(0, 0);
    let distance = this.range;

    if (!this.target || !this.inNeighborhood(this.target))
      for (const fish of fishes) {
        if (this.inNeighborhood(fish)) {
          const tempDistance = this.position.sub(fish.position).magnitude()
          if (distance > tempDistance) {
            distance = tempDistance;
            this.target = fish;
          }
        }
      }
    
    if (this.target)
      this.chaseFish = this.target.position.sub(this.position).normalize(this.chaseFishConstant)
  }
  
  eat(fishes) {
    const newFishes = []
    for (const fish of fishes) {
      if (this.inEatRange(fish)) {
        this.hunger += 30;
        this.hunger = Math.min(this.hunger, 100);
      } else newFishes.push(fish)     
    }
    
    return newFishes
  }
}

function drawNeighborhood (fish) {
  context.fillStyle = "rgba(241, 241, 241, 0.5)";
  context.beginPath();
  context.moveTo(fish.position.x, fish.position.y);
  context.arc(
    fish.position.x,
    fish.position.y,
    fish.range,
    fish.head - (Math.PI * 3) / 4,
    fish.head + (Math.PI * 3) / 4
  );
  context.fill();

  for (otherFish of fishes) {
    if (fish.inNeighborhood(otherFish)) {
      if (fish.target === otherFish) context.strokeStyle = "red";
      else context.strokeStyle = "rgba(241, 241, 241, 0.5)";
      context.beginPath();
      context.moveTo(fish.position.x, fish.position.y);
      context.lineTo(otherFish.position.x, otherFish.position.y);
      context.stroke();
    }
  }
};
