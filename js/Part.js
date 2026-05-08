// This file define the Part class.
// A Part describes how to play a series of steps.
// A Part is a collection of arrays called attributes. Each attribute gives indication for a certain play's parameter for each steps.

class Part {

  // The constructor create a new Part with every attribute set to default value.
  constructor(){
    const defaultArray = (value) => Array(PART_SIZE).fill(value);

    this.plays = defaultArray(0); // Array of booleans (should it plays at step i)
    this.notes = defaultArray(undefined); // Array of strings (what note should be played at step i)
    this.chords = defaultArray([1]); // Array of arrays of int (which degrees from the note should be played at step i)
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
      chord:this.chords[i],
      accent:this.accents[i],
      duration:this.durations[i],
      rythm:this.rythms[i],
      rythmLength:this.rythmsLengths[i],
    }
  }

  throwAttributeError(attribute){
	throw new Error(`${attribute} is not a valid Part attribute`);
  }
  
  // Return the given attribute
  getAttribute(attribute){
	if(!this.hasOwnProperty(attribute)) this.throwAttributeError(attribute);
    return this[attribute];
  }

  // Set the given attribute
  setAttribute(attribute, array){
	if(!this.hasOwnProperty(attribute)) this.throwAttributeError(attribute);
    this[attribute] = array;
  }

  setAttributeFromFunction(attribute, fun){
	let array = [];
	for(let i=0; i<PART_SIZE; i++){
		array[i] = fun(i, this.getStep(i));
	}
	this.setAttribute(attribute, array);
  }

  setAttributeFromSingleValue(attribute, value){
	this.setAttributeFromPattern(attribute, Pattern.newFromRepeatedValue(value))
  }

  // This method generate a attribute from a pattern
  setAttributeFromPattern(attribute, pattern){
    this.setAttribute(attribute, pattern.generate());
  }
  
  removeDurationsOverlap(){
	  this.setAttributeFromFunction('durations', (index, step)=>{
		  let duration = Math.min(step.duration, PART_SIZE-index);
		  for(let i=1; i<duration; i++){
			  if(this.getStep(index+i).play){
				  return i;
			  }
		  }
		  return duration;
	  });
  }
  
    repr(index){
	let stepDetails = (i) => {
		let step = this.getStep(i);
		let container = document.createElement('div');
		container.style.display = 'none';
		container.classList.add('step-repr-details');
		container.innerHTML = `
		  play: ${debugBoolean(step.play).outerHTML}
		  note: ${step.note} <br/>
		  chord: ${debugSequence(step.chord).outerHTML}
		  accent: ${debugBoolean(step.accent).outerHTML}
		  duration: ${step.duration} <br/>
		  rythm: ${debugSequence(step.rythm).outerHTML}
		  rythmLength: ${step.rythmLength} <br/>
		`
		return container
	}

    let array = this.getAttribute('notes').map((note,i)=>{
		if(this.getStep(i).play){
			return note + stepDetails(i).outerHTML;
		}
		else return null;
	});
    return debugSequence(array, index)
  }
}

