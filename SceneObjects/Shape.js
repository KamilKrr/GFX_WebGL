class Shape extends SceneObject {
    constructor(gl) {
        super();
        
        this.gl = gl;
        this.vertices = [];
        this.colors = [];

        this.buffers = {
            /* --------- initialize buffers --------- */
            vertexBuffer: this.gl.createBuffer(),
            colorBuffer: this.gl.createBuffer(),
        }
    }

    initData(vertices, colors) {
        /* --------- flatten & convert data to 32 bit float arrays --------- */
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());

        /* --------- send data to buffers --------- */
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
    }

    draw(camera) {
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.gl, this.buffers.vertexBuffer, locations.attributes.vertexLocation);
        Shape.setupAttribute(this.gl, this.buffers.colorBuffer, locations.attributes.colorLocation);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, camera.modelMatrix, this.modelMatrix);

        /* --------- send modelView matrix to GPU --------- */
        this.gl.uniformMatrix4fv(locations.uniforms.modelViewMatrix, this.gl.FALSE, modelViewMatrix);

        /* --------- draw the shape --------- */
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 4);
    }

    static setupAttribute(gl, buffer, location) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            4 * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}
