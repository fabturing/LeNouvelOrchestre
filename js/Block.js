// This file define the Block class.
// An Block represent a segment of music played by an Agent.


class Block {
  constructor(A, B, C, structure, lines){
    // Three parts of the block.
    // Parts can also be objects for multi-lines agents
    this.A = A;
    this.B = B;
    this.C = C;
    // The structure is an array of part identifier (e.g. ["A", "B", "A", "B"])
    this.structure = structure;
    // Array of lines for multilines blocks
    this.lines = lines || ['main'];
  }


  extractPattern(attribute, partName, line){
    let patterns = [];
    let partsNames = partName ? [partName] : ['A', 'B', 'C'];
    let lines = line ? [line] : this.lines;
    partsNames.forEach(partName=>{
      lines.forEach(line=>{
        let steps = this[partName][line].getAttribute(attribute);
        let pattern = Pattern.newFromSingleValues(steps);
        patterns.push(pattern);
      });
    });
    return Pattern.mergePatterns(patterns);
  }


  // Return the full block in the form of a concatenatd array of notes
  getFullBlock(){
    let parts = this.structure.map(partName=>this[partName]);

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


  getStep(step){
    let index = step % PART_SIZE;

    let part = this.getPart(step);

    let stepAttributes = {};
    this.lines.forEach((line)=>{
      let partStep = part[line].getStep(index);
      stepAttributes[line] = partStep.play ? partStep.note : null;
    });
    return stepAttributes;
  }

  getNote(step){
    let index = step % PART_SIZE;

    let part = this.getPart(step);

    let stepAttributes = {};
    this.lines.forEach((line)=>{
      let partStep = part[line].getStep(index);
      stepAttributes[line] = partStep.play ? partStep.note : null;
    });
    return stepAttributes;
  }

  // Return the note at given step
  old_getNote(step){
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
  getPartName(step){
    return this.structure[this.getPartIndex(step)];
  }

  // Return the part at a given step
  getPart(step){
    return this[this.getPartName(step)];
  }

  // Return a simplified single line part to be used as a model
  getPartAsModel(partId){
    let part = this[partId];
    // If no multi lines return the part
    if(!this.lines){
      return part;
    }
    // Else, flatten the part
    else{
      let flattenedPart = []
      // Count how many note in the part accross every lines
      let totalNoteCount = 0;
      this.lines.forEach(line=>{
        part[line].forEach(step=>{
          if(step) totalNoteCount++;
        });
      });
      // Compute the average number of note per step
      let averageDensity = totalNoteCount / PART_SIZE;
      // Write the flatten part with a note in each step where the number of note is greater than average.
      for(let i=0; i<PART_SIZE; i++){
        let stepNoteCount = 0;
        let stepNote;
        this.lines.forEach(line=>{
          if(part[line][i]) {
            stepNoteCount++;
            stepNote = part[line][i];
          }
        });
        if(stepNoteCount >= averageDensity){
          flattenedPart[i]=stepNote;
        }
        else{
          flattenedPart[i]=undefined;
        }
      }
      return flattenedPart;
    }
  }

  modulateFromTo(origin, destination){

    const simpl = Tonal.Note.simplify
    const originDegrees = Tonal.Scale.degrees(origin);
    const destinationDegrees = Tonal.Scale.degrees(destination);
    const modulate = (note) => {
      if(!note) return note;
      // Looking for the note degree in origin scale from -24° degree to 24° degree
      for(let i = -24; i <= 24; i++){
        if(simpl(originDegrees(i)) == simpl(note)) return simpl(destinationDegrees(i));
      }
      // If nothing found, return tonic by default
       // TODO: this should never be fired, what's happening ?'
      // console.warn(`${note} not found in ${origin}`)
      return destinationDegrees(1)
    };
    ['A','B','C'].forEach(partName=>{
          if(this.lines){
            this.lines.forEach(line=>{
              let newNotes = this[partName][line].getAttribute('notes').map(modulate);
              this[partName][line].setAttribute('notes', newNotes);
            })
          }
          else{
            let newNotes = this[partName].getAttribute('notes').map(modulate);
            this[partName].setAttribute('notes', newNotes);
          }
    });

  }



    // Method for copying the block
    copy(){
        return new Block(this.A, this.B, this.C, this.structure, this.lines);
    }


  // Return a human-readable HTML block representation
  repr(){
    let structureRepr = debugSequence(this.structure, this.getPartIndex(orchestra.step));
    return `A: ${this.partRepr('A').outerHTML}<br/>
            B: ${this.partRepr('B').outerHTML}<br/>
            C: ${this.partRepr('C').outerHTML}<br/>
            STRUCTURE: ${structureRepr.outerHTML}`;
    }

  partRepr(partName){
    const partToSimplifiedArray = part => part.getAttribute('notes').map((note,i)=>part.getAttribute('plays')[i]?note:null);
    let index = (this.getPartName(orchestra.step)==partName) ? orchestra.partStep : undefined;
    if(this.lines){
      return debugMultiLines(this[partName], (line)=>{return debugSequence(partToSimplifiedArray(line), index)})
    }
    else {
      return debugSequence(partToSimplifiedArray(this[partName]), index);
    }
  }
}

