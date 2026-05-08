// This file define Josephine class

class Josephine extends MelodicAgent { 
  constructor(){
    super("Josephine",
    "Organiste très sérieuse", 
    "josephine"); //✏️ L'identifiant de l'agent (nom de l'agent en lowercase)
    this.anim = new Anim('josephine', false);

  // moods
    this.addMood('moodA', 50);
    this.addMood('moodB', 50);
  }

  async loadInstrument(){
    const samples = {C4: "organ_note_reverb_C4.mp3"} 
    await this.loadSampler(samples, "samples/josephine/"); 

    this.setPan(PAN_JOSEPHINE); 
    this.setVolume(VOL_JOSEPHINE);
  }
  
  generateStructure(){
    return ['A','B','A','B'];
  }

  generateNotesPattern(){
	  return Pattern.newFromRepeatedUniform(this.scale);
  }

  generatePlaysPattern(){
    let pattern = [100, 0, 0, 0, 50, 0, 0, 0];
	return Pattern.newFromPercents(pattern);
  }
  
  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	
	let chordsPattern = Pattern.newFromRepeatedUniform([[1,3,5],[3,5,8]]);
	part.setAttributeFromPattern('chords', chordsPattern);
	
	part.setAttributeFromSingleValue('durations', PART_SIZE);
	part.removeDurationsOverlap();

	return part;
  }
}


