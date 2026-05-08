class TontonFlop extends PercAgent {
  constructor(){
    super("Tonton flop",
    "Tape dans ses mains et tape du pied par terre. Musicalement c'est pas un génie mais il a un don pour mettre l'ambiance.",
    "tontonflop");
    this.anim = new Anim('default', true);

  // moods
    this.addMood('main1', 30);
    this.addMood('mix1', 50);
    this.addMood('pied1', 30);
     this.addMood('main2', 30);
    this.addMood('mix2', 50);
    this.addMood('pied2', 30);
  }

  async loadInstrument(){
    const samples = {C3: "kick.mp3",
                    C4: "clap.mp3"}
    await this.loadSampler(samples, "samples/tonton/");

    this.setPan(PAN_TONTON);
    this.setVolume(VOL_TONTON);
  }

  generateStructure(){
    return ['A','B','C','B'];
  }

  generateNotesPattern(){
	  return Pattern.newFromRepeatedUniform(this.scale);
  }

  generatePlaysPattern(){
    let pattern = [100, 0, 100, 0, 100, 0, 100, 0];
	return Pattern.newFromPercents(pattern);
  }

  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	return part;
  }
}

