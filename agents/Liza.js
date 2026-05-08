// This file define Liza class


class Liza extends PercAgent {
  constructor(){
    super("Liza", "Batteuse qui fait que fumer des clopes", "liza", ['hihat', 'kick', 'snare']);
    this.anim = new Anim('liza', true);
    this.anim.setFrameChooser(()=>{
     
      let lines = []
      if(this.playingLinesNotes.snare.size) lines.push('snare');
      if(this.playingLinesNotes.hihat.size) lines.push('hihat');
      if(this.playingLinesNotes.kick.size) lines.push('kick');
  	  if(lines.length==0) return 'idle';
      return lines.join('-');
    })
    this.leavingTime = 4;

    // moods
    this.addMood('light', 40);
    this.addMood('straight', 30);
    this.addMood('double',20 );
    this.addMood('speed', 30);
  }


  async loadInstrument(){
    const samples = {
            C3: "C3.mp3", //kick
            C4: "C4.mp3", //snare
            C5: "C5.mp3", //hihat
        };
    await this.loadSampler(samples, "samples/drum/");
    this.setPan(PAN_DRUM);
    this.setVolume(VOL_DRUM);
  }



  generateStructure(){
      if(this.moodIs('straight')) {
        return ['A','A','A','B'];
      }
      else{
        return ['A','A','A','A'];
      }
  }
  
  generatePlaysPattern(line){
    let pattern;
    if(this.moodIs('light')){
	  if(line=='hihat')      pattern = [30, 70, 30, 70, 30, 70, 30, 70];  
      else if(line=='kick')  pattern = [97, 10,  5,  5, 50,  5, 10,  5];
      else if(line=='snare') pattern = [ 0,  2,  3,  2, 10,  2,  2,  2];
    }
    else if(this.moodIs('straight')){
	  if(line=='hihat')      pattern = [95,99,99,99,95,99,99,99];  
      else if(line=='kick')  pattern = [100, 5, 10, 5, 20, 5, 10, 5];
      else if(line=='snare') pattern = [0, 0, 5, 0, 100, 5, 10, 0];
    }
    else if(this.moodIs('double')){
	  if(line=='hihat')      pattern = [95,99,99,99,95,99,99,99];  
      else if(line=='kick')  pattern = [100, 5, 10, 5, 20, 5, 10, 5];
      else if(line=='snare') pattern = [0, 0, 5, 0, 100, 5, 10, 0];
    }
    else if(this.moodIs('speed')){
	  if(line=='hihat')      pattern = [60,100,60,100,60,100,60,100];  
      else if(line=='kick')  pattern = [98, 2, 20, 2, 98, 2, 20, 2];
      else if(line=='snare') pattern = [0, 2, 98, 10, 0, 5, 98, 20];
    }
    return Pattern.newFromPercents(pattern);
  }
  
  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	
    if(line == 'hihat'){
	  if (this.hasEnteredSince(4)){
		  part.setAttributeFromSingleValue('plays', 0);
	  }
	  else if(this.moodIs('double')){
		  part.setAttributeFromSingleValue('rythms', [1,1]);
	  }
	  else if(this.moodIs('speed')){
		  let rythmPattern = Pattern.newFromRepeatedStep([
			{weight:60, value:[1]},
			{weight:20, value:[1,1]},
			{weight:20, value:[1,1,1]},
		  ]);
		  part.setAttributeFromPattern('rythms', rythmPattern);
	  }
     }
     
    if (this.willLeaveIn(this.leavingTime)) {
		if(line == 'kick' || line == 'snare'){
		  part.setAttributeFromSingleValue('plays', 0);
		}
	}
	return part;
  }
  
  playInstrument(note, duration, time, velocite, line){
	if(line=='hihat'){
	  velocite = velocite - Math.random()/3
	  note = 'C5';
	}
	else if (line=='kick') {
	  note = 'C3';
	}
	else if (line=='snare') {
	  velocite = velocite - Math.random()/2;
	  note = 'C4';
	}
	super.playInstrument(note, duration, time, velocite, line);
  }
}

