class WavefrontObjImporter {
  static importShape(file, color, gl) {
    let parsed = this.#parseFile(file);
    let vertices = this.#expandVertices(parsed.vertices, parsed.faces);
    let colors = [];
    
    let r = 0.0;
    vertices.forEach(() => {
      r += 0.00002;
      r %= 1.0;
      colors.push([r + color[0], r + color[1], r + color[2], 1.0]);
    });
    
    let shape = new Shape(gl);
    shape.initData(vertices, colors);
    return shape;
  }
  
  static #expandVertices(vertices, faces) {
    let expandedVertices = [];
    
    faces.forEach(face => {
      face.forEach(vertexIndex => {
        expandedVertices.push(vertices[vertexIndex - 1]);
      })
    });
    
    return expandedVertices;
  }
  
  static #parseFile(file) {
    let lines = file.split('\n');
    
    let vertices = [];
    let faces = [];
    
    lines.forEach(line => {
      let tokens = line.split(' ');
      
      switch(tokens[0]){
        case 'v': // Vertex
          vertices.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), 1]);
          break;
        case 'f': // Face
          faces.push([this.#parseFaceIndex(tokens[1]), this.#parseFaceIndex(tokens[2]), this.#parseFaceIndex(tokens[3])]);
          break;
      }
    });
    
    return {
      vertices: vertices,
      faces: faces
    }
  }
  
  static #parseFaceIndex(token) {
    if(token.includes('//')){
      return parseInt(token.split('//')[0]);
    }
    return parseInt(token);
  }
}