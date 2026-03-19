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

  // Return the part index at a given step
  getPartIndex(step){
    return Math.floor(step/this.A.length)%this.structure.length
  };

  // Return the part identifier (e.g. "A") at a given step
  getPart(step){
    return this.structure[this.getPartIndex(step)];
  }

  // Return a human-readable HTML block representation

  repr(){
    let structureRepr = debugSequence(this.structure, this.getPartIndex(orchestra.step));
    let ARepr = debugSequence(this.A, (this.getPart(orchestra.step)=='A') ? orchestra.partStep : undefined);
    let BRepr = debugSequence(this.B, (this.getPart(orchestra.step)=='B') ? orchestra.partStep : undefined);
    let CRepr = debugSequence(this.C, (this.getPart(orchestra.step)=='C') ? orchestra.partStep : undefined);
    return `A: ${ARepr.outerHTML}<br/>B: ${BRepr.outerHTML}<br/>C: ${CRepr.outerHTML}<br/>STRUCTURE: ${structureRepr.outerHTML}`
  }
}

function debugSequence(array, index){
  let container = document.createElement('div');
  container.classList.add('debug-sequence');
  array.forEach((step, i)=>{
    let stepElement = document.createElement('div');
    stepElement.classList.add('step');
    if(index === i) stepElement.classList.add('current');
    if(!step) stepElement.classList.add('empty');
    stepElement.innerHTML = step;
    container.appendChild(stepElement);
  })
  return container;
}
