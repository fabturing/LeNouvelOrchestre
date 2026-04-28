// This file define the Part class.
// A Part describes how to play a series of steps.
// A Part is a collection of arrays called attributes. Each attribute gives indication for a certain play's parameter for each steps.

class Part {

  // The constructor create a new Part with every attribute set to default value.
  constructor(){
    const defaultArray = (value) => Array(PART_SIZE).fill(value);

    this.plays = defaultArray(0); // Array of booleans (should it plays at step i)
    this.notes = defaultArray(undefined); // Array of strings (what note should be played at step i)
    this.choords = defaultArray([1]); // Array of arrays of int (which degrees from the note should be played at step i)
    this.accents = defaultArray(0); // Array of booleans (should it be an accent at step i)
    this.durations = defaultArray(1); // Array of float (for which fraction of a step should the note been played)
    this.rythms = defaultArray([1]); // Array of array of boolean (what rythm shoud be played at step i)
    this.rythmsLengths = defaultArray(1); // Array of float (for which fraction of a step the rythm should be played)
  }

  // Return an object containing each instruction for the given step
  getStep(i){
    return {
      play:this.plays[i],
      note:this.notes[i],
      choord:this.choords[i],
      accent:this.accents[i],
      duration:this.durations[i],
      rythm:this.rythms[i],
      rythmLength:this.rythmsLengths[i],
    }
  }

  // Return the given attribute
  getAttribute(attribute){
    return this[attribute];
  }

  // Set the given attribute
  setAttribute(attribute, array){
    this[attribute] = array;
  }

  // This method generate a attribute from a pattern
  setAttributeFromPattern(attribute, pattern){
    this.setAttribute(attribute, pattern.generate());
  }
}

