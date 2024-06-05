class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get magnitude() {
    return Math.sqrt(this.magSq);
  }

  get magSq() {
    return this.x ** 2 + this.y ** 2;
  }

  add(vector: Vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
  }

  static add(vec1: Vector, vec2: Vector) {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  subtract(vector: Vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
  }

  static subtract(vec1: Vector, vec2: Vector) {
    return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
  }

  multiply(scalar: number) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
  }

  static multiply(vector: Vector, scalar: number) {
    return new Vector(vector.x * scalar, vector.y * scalar);
  }

  divide(scalar: number) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
  }

  static divide(vector: Vector, scalar: number) {
    return new Vector(vector.x / scalar, vector.y / scalar);
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  static dot(vec1: Vector, vec2: Vector) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  }

  limit(max: number) {
    const mSq = this.magSq;
    if (mSq > max * max) {
      this.divide(Math.sqrt(mSq));
    }
    return this;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  normalize() {
    if (this.magnitude === 0) return;
    this.divide(this.magnitude);
  }

  normal() {
    return new Vector(this.y * -1, this.x);
  }
}

export default Vector;
