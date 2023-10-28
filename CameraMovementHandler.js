class CameraMovementHandler {
  
  constructor(projectionMatrix) {
    this.projectionMatrix = projectionMatrix;
    this.isMouseDown = false;
    this.dragStartPosition = {x: 0, y: 0};
  }
  
  registerInputListeners() {

    // KEYBOARD MEVEMENT
    window.addEventListener("keydown", (event) => {
      let velocity = 0.05;

      const callback = {
        "ArrowLeft"  : () => this.#translateProjectionsMatrix([-velocity, 0, 0]),
        "ArrowRight"  : () => this.#translateProjectionsMatrix([velocity, 0, 0]),
        "ArrowUp"  : () => this.#translateProjectionsMatrix([0, velocity, 0]),
        "ArrowDown"  : () => this.#translateProjectionsMatrix([0, -velocity, 0]),
      }[event.key]
      callback?.()
    })
    
    window.addEventListener("mouseup", () => { this.isMouseDown = false; });
    window.addEventListener("mousedown", (event) => {
      this.isMouseDown = true;
      this.dragStartPosition = {x: event.clientX, y: event.clientY};
    });
    
    // MOUSE DRAGGING
    window.addEventListener("mousemove", (event) => {
      if (!this.isMouseDown) return;
      
      let currentPosition = {x: event.clientX, y: event.clientY};
      
      let calibrationFactor = 0.002;
      let deltaX = this.dragStartPosition.x - currentPosition.x;
      let deltaY = this.dragStartPosition.y - currentPosition.y;
      
      deltaX = -calibrationFactor * deltaX;
      deltaY = calibrationFactor * deltaY;
      
      this.dragStartPosition = currentPosition;
      
      this.#translateProjectionsMatrix([deltaX, deltaY, 0]);
    });
  }
  
  #translateProjectionsMatrix(vector) {
    this.projectionMatrix.translate(viewMatrix, viewMatrix, vector)
  }
}