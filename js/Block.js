// This file define the Block class.
// An Block represent a segment of music played by an Agent.


class Block {
  constructor(A, B, C, structure){
    // Three parts of the block. Each part is an array of notes.
    this.A = A;
    this.B = B;
    this.C = C;
    // The structure is an array of part identifier (e.g. ["A", "B", "A", "B"])
    this.structure = structure
  }

  // Return the full block in the form of a concatenatd array of notes
  getFullBlock(){
    let parts = this.structure.map(part=>this[part]);
    return Array.prototype.concat.apply([], parts);
  }

  // Return the note at given step
  getNote(step){
    let fullBlock = this.getFullBlock()
    let index = step % fullBlock.length;
    return fullBlock[index];
  }

  // Return the part identifier (e.g. "A") at a given step
  getPart(step){
    let index = Math.floor(step/this.A.length)%this.structure.length
    return this.structure[index];
  }

  // Return a human-readable HTML block representation
  repr(){
    return `A: ${this.A}<br/>B: ${this.B}<br/>C: ${this.C}<br/>STRUCTURE: ${this.structure}`
  }
}

