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
        cube.translate([0.4 * i, -0.3, 0]);
        scene.addShape(cube);
    }

    let cameraMovementHandler = new CameraInteractionHandler(scene);
    cameraMovementHandler.registerInputListeners();

    let shapeInteractionHandler = new ShapeInteractionHandler(scene);
    shapeInteractionHandler.registerInputListeners();

    /* --------- Load some data from external files - only works with an http server --------- */
    await loadObjFiles();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

async function loadObjFiles() {
    const bunnyFile = await fetch('3D Objects/bunny.obj').then(result => result.text());
    let bunny = WavefrontObjImporter.importShape(bunnyFile, [0.15, 0.2, 0.5], scene.gl);
    bunny.scale([3, 3, 3]);
    bunny.translate([0, .1, 0]);
    scene.addShape(bunny);

    const teapotFile = await fetch('3D Objects/teapot.obj').then(result => result.text());
    let teapot = WavefrontObjImporter.importShape(teapotFile, [0.1, 0.1, .1], scene.gl);
    teapot.scale([.2, .2, .2]);
    teapot.translate([2, .2, 0]);
    scene.addShape(teapot);
}


function render(now) {
    scene.render(now);
    requestAnimationFrame(render)
}

