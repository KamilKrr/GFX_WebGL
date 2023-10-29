const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const locations = {
    attributes: {
        vertexLocation: null,
        colorLocation: null
    }, uniforms: {
        modelViewMatrix: null,
        projectionMatrix: null,
    }
}

let camera = null;
let scene = null;

window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    gl.enable(gl.DEPTH_TEST);
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram(gl, "v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */
    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");

    camera = new Camera(canvas);
    scene = new Scene();
    scene.setCamera(camera);
    scene.setGlContext(gl);

    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, camera.projectionMatrix);
    

    for(let i = 0; i < 4; i++) {
        let cube = new Cube(gl);
        cube.translate([0.4 * i, 0, 0]);
        scene.addShape(cube);
    }

    let cameraMovementHandler = new CameraInteractionHandler(scene);
    //cameraMovementHandler.registerInputListeners();

    let shapeInteractionHandler = new ShapeInteractionHandler(scene);
    shapeInteractionHandler.registerInputListeners();

    /* --------- Load some data from external files - only works with an http server --------- */
    //  await loadSomething();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

/* --------- simple example of loading external files --------- */
async function loadSomething() {
    const data = await fetch('helpers.js').then(result => result.text());
    console.log(data);
}


function render(now) {
    scene.render(now);
    requestAnimationFrame(render)
}

