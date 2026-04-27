// This file define the Part class.
// A Part describes how to play a series of steps.
// A Part is a collection of arrays called lines. Each line gives indication for a certain play's parameter for each steps.

class Part {

  // The constructor create a new Part with every lines set to default value.
  constructor(){
    const defaultArr = (value) => Array(PART_SIZE).fill(value);

    this.plays = defaultArr(0); // Array of booleans (should it plays at step i)
    this.notes = defaultArr(undefined); // Array of strings (what note should be played at step i)
    this.choords = defaultArr([1]); // Array of arrays of int (which degrees from the note should be played at step i)
    this.accents = defaultArr(0); // Array of booleans (should it be an accent at step i)
    this.durations = defaultArr(1); // Array of float (for which fraction of a step should the note been played)
    this.rythms = defaultArr([1]); // Array of array of boolean (what rythm shoud be played at step i)
    this.rythmsLengths = defaultArr(1); // Array of float (for which fraction of a step the rythm should be played)
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

  // Return the given line
  getLine(line){
    return this[line];
  }

  // Set the given line
  setLine(line, array){
    this[line] = array;
  }

  // This method generate a line from a pattern
  setLineFromPattern(line, pattern){
    this.setLine(line, pattern.generate());
  }

}

/* Tests

let part = new Part();
let pattern1 = Pattern.fromPercent('plays', [100,50,50,0,100,25,100,0])
part.set('plays', [1, 1, 0, 0, 1, 0, 0, 0])
part.generateFromPattern('plays', pattern1)
part.generateFromWeightedPatterns('plays', [{pattern:pattern2, weight:10}, {pattern:pattern3, weight:90}])
let arr = part.get('plays')
let pattern4 = part.getAsPattern('plays')


*/
