
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
    //
  // moods
    this.addMood('kick1', 30);
    this.addMood('mix1', 50);
    this.addMood('clap1', 30);
    /*
     this.addMood('kick2', 30);
    this.addMood('mix2', 50);
    this.addMood('clap2', 30);
    */
  }

  async loadInstrument(){
    const samples = {C3: "kick.mp3",
                    C4: "clap.mp3"}
    await this.loadSampler(samples, "samples/tonton/");

    this.setPan(PAN_TONTON);
    this.setVolume(VOL_TONTON);
  }

  generateStructure(){
    return ['B','A','A','B'];
  }


 generatePlaysPattern(line){
    let pattern = [100, 100, 100, 100, 100, 100, 100, 100];

    return Pattern.newFromPercents(pattern);
  }

  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	let pattern;
    if(this.moodIs('mix1')){
	  if(line=='clap')      pattern =[[0,1], [1,0], [1,1], [0,1], [1,1], [0,1], [1,0], [1,1]];
      else if(line=='kick')  pattern = [[1,0], [0,1], [0,0], [1,0], [0,0], [1,0], [0,1], [0,0]];
    }
    else if(this.moodIs('clap1')){
	  if(line=='clap')      pattern =[[0,1], [1,0], [1,1], [0,1], [1,1], [0,1], [1,0], [1,1]];
      else if(line=='kick')  pattern = [[0],[0],[0],[0],[0],[0],[0],[0]];
    }
    else if(this.moodIs('kick1')){
	  if(line=='clap')      pattern = [[0],[0],[0],[0],[0],[0],[0],[0]];
      else if(line=='kick')  pattern = [[1,0], [0,1], [0,0], [1,0], [0,0], [1,0], [0,1], [0,0]];
    }
	part.setAttribute('rythms', pattern)
	return part;
  }
  
  
    playInstrument(note, duration, time, velocite, line){
	if(line=='clap'){
	  note = 'C4';
	}
	else if (line=='kick') {
	  note = 'C3';
	}
	super.playInstrument(note, duration, time, velocite, line);
  }


}




