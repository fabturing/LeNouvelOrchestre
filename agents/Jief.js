// This file define Jief class

class Jief extends MelodicAgent {
  constructor(){
    super("Jiéf", "Petit flutiste debout sur un tabouret", "jief");
    this.anim = new Anim('jief', false);

    // moods
    this.addMood('long_variation', 30);
    this.addMood('long', 33);
    this.addMood('courtlong', 33);
    this.addMood('court', 40);
  }

  async loadInstrument(){
    const samples = {C3: "C3.mp3"}
    await this.loadSampler(samples, "samples/flute/");
    this.setPan(PAN_FLUTE);
    this.setVolume(VOL_FLUTE);
  }
  
  generateStructure(){
    return ['A','B','C','B'];
  }

  generateNotesPattern(){
	  return Pattern.newFromRepeatedUniform(this.scale);
  }

  generatePlaysPattern(){
	let pattern = [90, 33, 66, 33, 80, 33, 66, 33];
    if(this.moodIs('long_variation')){
		pattern = [80, 2, 2, 50, 80, 2, 2, 50];
	}
    // de temps en temps laisser une part quasivide
    if(Math.random()*2 < this.fatigue ){
		pattern = [1, 1, 1, 1, 1, 1, 1, 1];
	}
	return Pattern.newFromPercents(pattern);
  }
  
  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	
	if(this.moodIs('court')){
	  part.setAttributeFromSingleValue('durations', 1);
	}
	else if(this.moodIs('long') || this.moodIs('long_variation')){
	  part.setAttributeFromSingleValue('durations', PART_SIZE);
	}
    else if(this.moodIs('courtlong')){
	  part.setAttributeFromFunction('durations', (i)=>i%2==0?2:1);
	}
	part.removeDurationsOverlap();

	return part;
  }
  
  playInstrument(note, duration, time, velocite, line){
	velocite = velocite - Math.random()/3
	note = Tonal.Note.transpose(note, '8P');
	super.playInstrument(note, duration, time, velocite, line);
  }
}

