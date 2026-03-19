// This file define the Block class.
// An Block represent a segment of music played by an Agent.


class Block {
  constructor(A, B, C, structure,lines){
    // Three parts of the block. Each part is an array of notes
    // Parts can also be objects for multi-lines agents
    this.A = A;
    this.B = B;
    this.C = C;
    // The structure is an array of part identifier (e.g. ["A", "B", "A", "B"])
    this.structure = structure;
    // Array of lines for multilines blocks
    this.lines = lines
  }

  // Return the full block in the form of a concatenatd array of notes
  getFullBlock(){
    let parts = this.structure.map(part=>this[part]);

    if(this.lines){
      let fullBlock = {};
      this.lines.forEach((line)=>{
        let lineParts = parts.map(part=>part[line]);
        fullBlock[line] = Array.prototype.concat.apply([], lineParts);
      });
      return fullBlock;
    }
     else{
      return Array.prototype.concat.apply([], parts);
    }
  }

  // Return the note at given step
  getNote(step){
    let fullBlock = this.getFullBlock()
    let index = step % BLOCK_SIZE;
    if(this.lines){
      let note = {};
      this.lines.forEach((line)=>{
        note[line] = fullBlock[line][index];
      });
      return note;
    }
    else {
      return fullBlock[index];
    }


  }

  // Return the part index at a given step
  getPartIndex(step){
    return Math.floor(step/PART_SIZE)%PARTS_PER_BLOCK;
  };

  // Return the part identifier (e.g. "A") at a given step
  getPart(step){
    return this.structure[this.getPartIndex(step)];
  }

  // Return a human-readable HTML block representation

  repr(){
    let structureRepr = debugSequence(this.structure, this.getPartIndex(orchestra.step));
    return `A: ${this.partRepr('A').outerHTML}<br/>
            B: ${this.partRepr('B').outerHTML}<br/>
            C: ${this.partRepr('C').outerHTML}<br/>
            STRUCTURE: ${structureRepr.outerHTML}`;
    }

  partRepr(part){
    let index = (this.getPart(orchestra.step)==part) ? orchestra.partStep : undefined;
    if(this.lines){
      return debugMultiLines(this[part], (line)=>{return debugSequence(line, index)})
    }
    else {
      return debugSequence(this[part], index);
    }
  }
}

