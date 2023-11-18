class Shape extends SceneObject {
    constructor(gl) {
        super();
        
        this.gl = gl;
        this.vertices = [];
        this.colors = [];
        this.normals = [];

        this.buffers = {
            /* --------- initialize buffers --------- */
            vertexBuffer: this.gl.createBuffer(),
            colorBuffer: this.gl.createBuffer(),
            normalBuffer: this.gl.createBuffer(),
        }

        this.isHidden = false;


        this.normalMatrix = mat3.create();
    }

    initData(vertices, colors, normals) {
        /* --------- flatten & convert data to 32 bit float arrays --------- */
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());
        this.normals = new Float32Array(normals.flat());

        /* --------- send data to buffers --------- */
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);
    }

    draw(camera) {
        if(this.isHidden) return;
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.gl, this.buffers.vertexBuffer, locations.attributes.vertexLocation);
        Shape.setupAttribute(this.gl, this.buffers.colorBuffer, locations.attributes.colorLocation);
        Shape.setupAttribute(this.gl, this.buffers.normalBuffer, locations.attributes.normalLocation, true);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, this.modelMatrix, this.scaleMatrixLocal);
        mat4.mul(modelViewMatrix, this.scaleMatrixGlobal, modelViewMatrix);
        mat4.mul(modelViewMatrix, camera.modelMatrix, modelViewMatrix);

        mat3.normalFromMat4(this.normalMatrix, modelViewMatrix);
        this.gl.uniformMatrix3fv(locations.uniforms.normalMatrix, this.gl.FALSE, this.normalMatrix);

        /* --------- send modelView matrix to GPU --------- */
        this.gl.uniformMatrix4fv(locations.uniforms.modelViewMatrix, this.gl.FALSE, modelViewMatrix);

        /* --------- draw the shape --------- */
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 4);
    }

    hide() {
        this.isHidden = true;
    }

    show() {
        this.isHidden = false;
    }

    static setupAttribute(gl, buffer, location, isNormal = false) {
        if (location === -1) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            isNormal ? 3 : 4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            (isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}
