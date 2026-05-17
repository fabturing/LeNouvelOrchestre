// This file define Crocodus class


class Crocodus extends BassAgent {
  constructor(){
    super("Crocodus", "un crocodile qui joue de la basse, personne ne l'aime", "crocodus");
    this.anim = new Anim('crocodus', true);
    
    // moods
    this.addMood('light', 50);
    this.addMood('normal', 50);
    this.addMood('rebond', 50);
    this.addMood('dense', 40);
  }


  async loadInstrument(){
    await this.loadSampler({C4: "crocco_1.mp3"}, "samples/basse/");
    await this.loadSampler({C4: "crocco_2.mp3"}, "samples/basse/");
    //FIXME: ce sample est en wav le convertir en mp3
    //await this.loadSampler({C4: "crocco_3.mp3"}, "samples/basse/");
    this.setPan(PAN_BASSE);
    this.setVolume(VOL_BASSE);
    this.setFilter(750, "lowpass");
  }

  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePlaysPattern(){
    let pattern;
    if(this.moodIs('light')) {pattern = [95,50,30,2,2,2,2,10]}
    else {pattern = [90,5,20,30,90,5,20,40];}
    return Pattern.newFromPercents(pattern);
  }
  
  generateNotesPattern(){
	  return Pattern.newFromRepeatedUniform(this.scale);
  }

  playInstrument(note, duration, time, velocite, line){
	//note = Tonal.Note.transpose(note, "-16P");
	velocite = velocite - Math.random()/5
	time = time + Math.random()/300;

    super.playInstrument(note, duration, time, velocite, line);

  }
  
  
  
   generatePart(partName, line){
	let part = super.generatePart(partName, line);
	
	if(this.moodIs('rebond')){
	 part.setAttributeFromSingleValue('rythmsLengths', 2);
	 part.setAttributeFromFunction('rythms', (i)=>{
	  if(i+1>=PART_SIZE) return [1];
      if(part.getStep(i+1).play) return [1];
	  else return [1,1];
	 });
    }
    else if(this.moodIs('dense')){
      let lastNote;
	  part.setAttributeFromFunction('notes', (i, step)=>{
		if(step.play) lastNote = step.note;
		return lastNote;
	  });
	  let play = 0;
	  part.setAttributeFromFunction('plays', (i, step)=>{
		if(step.play) play = 1;
		return play;
	  });
	}
	
	// TODO: Choisir la tessiture de crocodus ici :
	// part.transposeIntoRange('G3','G4');
	
    return part;
  }
}

