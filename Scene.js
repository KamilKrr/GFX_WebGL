class Scene {
  constructor() {
    this.camera = null;
    this.shapes = [];
    this.supportShapes = []; // Shapes used for visual support, cannot be selected
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

  addSupportShape(shape) {
    this.supportShapes.push(shape);
  }
  
  render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - this.then;
    delta *= 0.001;
    this.then = now;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const lightPosition = vec4.fromValues(0, 0, 3, 1);
    vec4.transformMat4(lightPosition, lightPosition, this.camera.modelMatrix);
    this.gl.uniform4fv(locations.uniforms.lightViewPosition, lightPosition);

    this.shapes.forEach(shape => {
      shape.draw(this.camera);
    });

    this.supportShapes.forEach(shape => {
      shape.draw(this.camera);
    });
  }
  
}