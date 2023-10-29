class Scene {
  constructor() {
    this.camera = null;
    this.shapes = [];
    this.then = 0;
    this.gl = null;
  }
  
  setCamera(camera) {
    this.camera = camera;
  }
  
  setGlContext(gl) {
    this.gl = gl;
  }
  
  addShape(shape) {
    this.shapes.push(shape);
  }
  
  
  render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - this.then;
    delta *= 0.001;
    this.then = now;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.shapes.forEach(shape => {
      /* --------- scale rotation amount by time difference --------- */
      shape.rotate(1 * delta, [0, 1, 1]);
      shape.draw(this.camera);
    });
  }
  
}