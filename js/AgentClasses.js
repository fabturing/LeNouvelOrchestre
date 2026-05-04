class MelodicAgent extends Agent {
  constructor(name, description, id, lines) {
    super(name, description, id, lines);
    this.category = 'melodic';
  }
}

class PercAgent extends Agent {
  constructor(name, description, id, lines) {
    super(name, description, id, lines);
    this.category = 'perc';
    this.scale = [];
  }
  
   generateInfluencePatterns(partName){
	let patterns = super.generateInfluencePatterns(partName);
	patterns.notes = undefined;
    return patterns;
  }

  generateNotesPattern(){
    return Pattern.newFromRepeatedValue(1);
  }
  
  setScale(){
	return;
  };
  modulateFromTo(){
	  return
  };
  
    generatePart(partName, line){
	let part = super.generatePart(partName, line);
	part.setAttributeFromPattern('notes', this.generateNotesPattern());
	return part;
  }

}

class BassAgent extends Agent {
  constructor(name, description, id, lines) {
    super(name, description, id, lines);
    this.category = 'bass';
  }
}
