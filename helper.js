class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(...vectors) {
        const sum = new Vector2();

        for (let vector of vectors) {
            sum.x += vector.x;
            sum.y += vector.y;
        }
        return sum;
    }

    add(...vectors) {
        const sum = new Vector2(this.x, this.y);

        for (let vector of vectors) {
            sum.x += vector.x;
            sum.y += vector.y;
        }
        return sum;
    }

    sub(...vectors) {
        const result = new Vector2(this.x, this.y);

        for (let vector of vectors) {
            result.x -= vector.x;
            result.y -= vector.y;
        }
        return result;
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    scale(value) {
        return new Vector2(this.x * value, this.y * value);
    }

    normalize(value = 1) {
        if (this.magnitude() !== 0) {
            return this.scale(value / this.magnitude());
        } else {
            return new Vector2();
        }
    }
}

const angleToVector = function (angle) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
};

const vectorToAngle = function (vector) {
    return Math.atan2(vector.y, vector.x);
};
