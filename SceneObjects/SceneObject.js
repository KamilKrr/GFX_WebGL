class SceneObject {
  constructor() {
    /* --------- initialize model matrix --------- */
    this.modelMatrix = mat4.create();
    this.scaleMatrix = mat4.create();
  }

  rotate(angle, axis, global = false) {
    if (!global) {
      mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
    } else {
      const rotationMatrix = mat4.create();
      mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
      mat4.mul(this.modelMatrix, rotationMatrix, this.modelMatrix);
    }
  }

  scale(vector, global = false) {
    if (!global) {
      mat4.scale(this.scaleMatrix, this.scaleMatrix, vector);
    } else {
      const scaleMatrix = mat4.create();
      mat4.scale(scaleMatrix, scaleMatrix, vector);
      mat4.mul(this.scaleMatrix, scaleMatrix, this.scaleMatrix);
    }
  }

  translate(vector, global = false) {
    if (!global) {
      mat4.translate(this.modelMatrix, this.modelMatrix, vector);
    } else {
      const transformMatrix = mat4.create();
      mat4.translate(transformMatrix, transformMatrix, vector);
      mat4.mul(this.modelMatrix, transformMatrix, this.modelMatrix);
    }
  }
}