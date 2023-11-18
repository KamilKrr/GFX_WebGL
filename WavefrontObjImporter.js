class WavefrontObjImporter {
  static importShape(file, color, gl) {
    let parsed = this.#parseFile(file);
    let vertices = this.#expand(parsed.vertices, parsed.faceVertices);
    let normals = this.#expand(parsed.normals, parsed.faceNormals);
    let colors = [];

    let r = 0.0;
    vertices.forEach(() => {
      r += 0.00002;
      r %= 1.0;
      colors.push([r + color[0], r + color[1], r + color[2], 1.0]);
    });
    
    let shape = new Shape(gl);

    shape.initData(vertices, colors, normals);
    return shape;
  }

  static #expand(items, catalogue) {
    let expanded = [];

    catalogue.forEach(page => {
      page.forEach(index => {
        expanded.push(items[index - 1]);
      })
    });

    return expanded;
  }
  
  static #parseFile(file) {
    let lines = file.split('\n');
    
    let vertices = [];
    let normals = [];

    let faceVertices = [];
    let faceNormals = [];
    
    lines.forEach(line => {
      let tokens = line.split(' ');
      
      switch(tokens[0]){
        case 'v': // Vertex
          vertices.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), 1]);
          break;
        case 'vn':
          normals.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])]);
          break;
        case 'f': // Face
          faceVertices.push([this.#parseIndex(tokens[1], 0), this.#parseIndex(tokens[2], 0), this.#parseIndex(tokens[3], 0)]);
          faceNormals.push([this.#parseIndex(tokens[1], 1), this.#parseIndex(tokens[2], 1), this.#parseIndex(tokens[3], 1)]);
          break;
      }
    });

    return {
      vertices: vertices,
      normals: normals,
      faceVertices: faceVertices,
      faceNormals: faceNormals,
    }
  }

  static #parseIndex(token, index) {
    if(token.includes('//')){
      return parseInt(token.split('//')[index]);
    }
    return parseInt(token);
  }
}