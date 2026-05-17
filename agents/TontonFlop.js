
class TontonFlop extends PercAgent {
  constructor(){
    super("Tonton flop",
    "Tape dans ses mains et tape du pied par terre. Musicalement c'est pas un génie mais il a un don pour mettre l'ambiance.",
    "tontonflop",['kick', 'clap']);
    //
    this.anim = new Anim('tontonflop', true);
    this.anim.setFrameChooser(()=>{
      let lines = []
      if(this.playingLinesNotes.clap.size) lines.push('clap');
      if(this.playingLinesNotes.kick.size) lines.push('kick');
  	  if(lines.length==0) return 'idle';
      return lines.join('-');
    });
	// moods

    this.addMood('mix1', 50);
    this.addMood('clap1', 50);
    this.addMood('mix2', 50);
    this.addMood('mix3', 50);
    this.addMood('mix4', 50);
    /*
     this.addMood('kick2', 30);
    this.addMood('mix2', 50);
    this.addMood('clap2', 30);
    */
  }

  async loadInstrument(){


    await this.loadSampler({C3: "pied1.mp3"}, "samples/tonton/", 'kick');
    await this.loadSampler({C3: "pied2.mp3"}, "samples/tonton/", 'kick');
    await this.loadSampler({C3: "pied3.mp3"}, "samples/tonton/", 'kick');
    await this.loadSampler({C3: "pied4.mp3"}, "samples/tonton/", 'kick');
    
    await this.loadSampler({C3: "clap1.mp3"}, "samples/tonton/", 'clap');
    await this.loadSampler({C3: "clap2.mp3"}, "samples/tonton/", 'clap');
    await this.loadSampler({C3: "clap3.mp3"}, "samples/tonton/", 'clap');
    await this.loadSampler({C3: "clap4.mp3"}, "samples/tonton/", 'clap');

    this.setPan(PAN_TONTON);
    this.setVolume(VOL_TONTON);
  }

  generateStructure(){
    return ['B','A','A','B'];
  }



generatePlaysPattern(line){
   let pattern;
    if(this.moodIs('mix1')){
	  if(line=='clap')      pattern = [0,80,80,0,80,80,0,80];
      else if(line=='kick')  pattern = [95,0,0,90,0,0,90,0];
    }
    else if(this.moodIs('clap1')){
	  if(line=='clap')      pattern = [0,80,80,0,80,80,0,80];
      else if(line=='kick')  pattern = [0,0,0,0,0,0,0,0];
    }
    else if(this.moodIs('mix2')){
	  if(line=='clap')      pattern = [0,80,80,0,80,80,0,80];
      else if(line=='kick')  pattern = [95,0,0,0,90,0,0,0];
    }

    else if(this.moodIs('mix3')){
	  if(line=='clap')      pattern = [0,0,0,0,80,0,0,0];
      else if(line=='kick')  pattern = [95,0,80,0,90,0,80,0];
    }
    else if(this.moodIs('mix4')){
	  if(line=='clap')      pattern = [0,80,80,0,80,80,0,80];
      else if(line=='kick')  pattern = [95,0,80,0,90,0,80,0];
    }

    return Pattern.newFromPercents(pattern);
  }

  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	return part;
  }
  
    playInstrument(note, duration, time, velocite, line){
    let velo = velocite - Math.random()/3;
	note = 'C3';
	super.playInstrument(note, duration, time, velo, line);
  }
}




