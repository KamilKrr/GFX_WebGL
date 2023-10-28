const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

const locations = {
    attributes: {
        vertexLocation: null,
        colorLocation: null
    }, uniforms: {
        modelViewMatrix: null,
        projectionMatrix: null,
    }
}

const viewMatrix = mat4.create();

window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    gl.enable(gl.DEPTH_TEST);
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */
    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");

    /* --------- create & send projection matrix --------- */
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    /* --------- create view matrix --------- */
    mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);

    /* --------- translate view matrix --------- */
    mat4.translate(viewMatrix, viewMatrix, [-0.5, 0, 0])

    /* --------- create 2 cubes and translate them away from each other --------- */
    let shapeFactory = new ShapeFactory();
    shapes.push(shapeFactory.createCube());
    shapes[0].translate([0.2, 0, 0]);

    shapes.push(shapeFactory.createCube());
    shapes[1].translate([-0.2, 0, 0]);

    shapes.push(shapeFactory.createCube());
    shapes[2].translate([0.6, 0, 0]);

    shapes.push(shapeFactory.createCube());
    shapes[3].translate([1., 0, 0]);

    /* --------- Attach event listener for keyboard events to the window --------- */
    window.addEventListener("keydown", (event) => {
        /* ----- this event contains all the information you will need to process user interaction ---- */
        console.log(event)

        let velocity = 0.01;

        const callback = {
            "ArrowLeft"  : () => mat4.translate(viewMatrix, viewMatrix, [-velocity, 0, 0]),
            "ArrowRight"  : () => mat4.translate(viewMatrix, viewMatrix, [velocity, 0, 0]),
            "ArrowUp"  : () => mat4.translate(viewMatrix, viewMatrix, [0, velocity, 0]),
            "ArrowDown"  : () => mat4.translate(viewMatrix, viewMatrix, [0, -velocity, 0]),
        }[event.key]
        callback?.()
    })

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

let then = 0;

function render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {
        /* --------- scale rotation amount by time difference --------- */
        shape.rotate(1 * delta, [0, 1, 1]);
        shape.draw();
    });

    requestAnimationFrame(render)
}

