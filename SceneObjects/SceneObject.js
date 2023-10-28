class SceneObject {
  constructor() {
    /* --------- initialize model matrix --------- */
    this.modelMatrix = mat4.create();
  }

  rotate(angle, axis, global = false) {
    /**
         * The transformation functions that glMatrix provides apply the new transformation as the right hand operand,
         * which means the new transformation will be the first one to be applied (this will result in a local transformation)
         *
         * The function call below would look like this if you write down the matrices directly:
         * transformationMatrix * rotationMatrix
         */
    if (!global) {
      mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
    } else {
      /**
      * To get global transformations, you need to apply the new transformation after all the other transformations, i.e. as the left-most operand:
      * rotationMatrix * transformationMatrix
      * 
      * You can do this manually by construction the transformation matrix and then using mat4.multiply(out, leftOperand, rightOperand).
      */
      const rotationMatrix = mat4.create();
      mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
      mat4.mul(this.modelMatrix, rotationMatrix, this.modelMatrix)

    }
  }

  translate(vector) {
    mat4.translate(this.modelMatrix, this.modelMatrix, vector);
  }
  
}