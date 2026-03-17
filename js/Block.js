class Block {
  constructor(A, B, C, structure){
    this.A = A;
    this.B = B;
    this.C = C;
    this.structure = structure
  }

  getFullBlock(){
    const concat = (arr)=>Array.prototype.concat.apply([], arr);
    let fullBlock = this.structure.map(part=>this[part]);
    return concat(fullBlock);
  }

  getNote(step){
    let fullBlock = this.getFullBlock()
    let index = step%fullBlock.length;
    return fullBlock[index];
  }

  repr(){
    return `A: ${this.A}<br/>B: ${this.B}<br/>C: ${this.C}<br/>STRUCTURE: ${this.structure}`
  }
}

