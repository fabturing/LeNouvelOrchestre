// This file define Josephine class

class Josephine extends MelodicAgent { 
  constructor(){
    super("Josephine",
    "Organiste très sérieuse", 
    "josephine"); //✏️ L'identifiant de l'agent (nom de l'agent en lowercase)
    this.anim = new Anim('josephine', false);

  // moods
    this.addMood('moodA', 50);
    this.addMood('moodB', 40);
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
  let pattern;
  if(this.moodIs('moodA')){ pattern = [97, 0, 0, 0, 50, 0, 0, 0];}
  if(this.moodIs('moodB')){ pattern = [95, 5, 30, 5, 40, 5, 15, 40];}
	return Pattern.newFromPercents(pattern);
  }
  
  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	
	let chordsPattern = Pattern.newFromRepeatedUniform([[1,3,5],[3,5,8]]);
	part.setAttributeFromPattern('chords', chordsPattern);
	
	if(this.moodIs('moodA')){
	part.setAttributeFromSingleValue('durations', PART_SIZE);
	part.removeDurationsOverlap();}

	if(this.moodIs('moodB')){
	let rand = Math.random();
	if (rand < 1/3) {part.setAttributeFromSingleValue('durations', 1)}
	else if (rand < 2/3) {part.setAttributeFromSingleValue('durations', 2)}
	else {part.setAttributeFromSingleValue('durations', 3)}
	part.removeDurationsOverlap();
	}



	return part;
  }

  playInstrument(note, duration, time, velocite, line){
	velocite = velocite - Math.random()/5;
	time = time + Math.random()/100;
	super.playInstrument(note, duration, time, velocite, line)
  }

}


