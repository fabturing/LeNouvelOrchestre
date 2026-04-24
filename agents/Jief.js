// This file define Jief class

class Jief extends Agent {
  constructor(){
    super("Jiéf", "Petit flutiste debout sur un tabouret", "jief");
    this.anim = new Anim('jief', false);
    this.category = 'melodic';
    //FX



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

  getNoteDuration(){

    let duration = Tone.Time("8n");
    let blockStep = this.orchestra.blockStep;

    // Mood : court
    if(this.moodIs('court')){

      return duration;
    }

    // Mood : long
    else if(this.moodIs('long') || this.moodIs('long_variation')){
      let stepsAfter = 1;
      while(stepsAfter+blockStep<BLOCK_SIZE
        && !this.playingBlock.getNote(blockStep+stepsAfter)
        && stepsAfter <= 2){
        stepsAfter ++;
      }
      return duration * stepsAfter;
    }
    // Mood : longcourt
    else if(this.moodIs('courtlong')) {
      let nextNote = this.playingBlock.getNote(blockStep+1);
      // For even steps, if the next note is silent, double the duration.
      if(!nextNote && blockStep%2==0){
        return duration * 2;
      }
      return duration;
    }

  }

  playNote(note, time){
    let velocite = 1-Math.random()/3;
    let duration = this.getNoteDuration()
    this.instrument.triggerAttackRelease(note, duration, time, velocite);
  }

  generateStructure(){
    return ['A','B','C','B'];
  }

  generatePattern(){
    let pattern = [90, 33, 66, 33, 80, 33, 66, 33]
    if(this.moodIs('long_variation')){pattern = [80, 2, 2, 50, 80, 2, 2, 50]}
    // de temps en temps laisser un block vide
    let random = Math.random()*2;
    if(random < this.fatigue ){pattern = [1, 1, 1, 1, 1, 1, 1, 1];}
    return pattern.map(percent);
  }

  generateScale(){
   return this.scale;
  }
}

