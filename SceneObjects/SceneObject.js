class SceneObject {
  constructor() {
    /* --------- initialize model matrix --------- */
    this.modelMatrix = mat4.create();
  }

  rotate(angle, axis, global = false) {
    if (!global) {
      mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
    } else {
      const rotationMatrix = mat4.create();
      mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
      mat4.mul(this.modelMatrix, rotationMatrix, this.modelMatrix)

    }
  }

  scale(vector, global = false) {
    if (!global) {
      mat4.scale(this.modelMatrix, this.modelMatrix, vector);
    } else {
    }
  }

  translate(vector) {
    mat4.translate(this.modelMatrix, this.modelMatrix, vector);
  }
  
}