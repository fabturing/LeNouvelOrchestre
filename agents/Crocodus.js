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
    const samples = {C4: "C2.mp3"};
    await this.loadSampler(samples, "samples/basse/");
    this.setPan(PAN_BASSE);
    this.setVolume(VOL_BASSE);
    this.setFilter(750, "lowpass");
  }


  playNote(note, time){
    note = Tonal.Note.transpose(note, "-8P");

    if(this.moodIs('normal') || this.moodIs('light') ){
    this.instrument.triggerAttackRelease(note, "4n", time);
    }

    else if(this.moodIs('rebond')){
    let blockStep = this.orchestra.blockStep;
    let time_delayed = time;
    this.instrument.triggerAttackRelease(note, "8n", time_delayed);
      let stepsAfter = 1;
          while(stepsAfter+blockStep<BLOCK_SIZE
            && !this.playingBlock.getNote(blockStep+stepsAfter)
            && stepsAfter <= 1){
            time_delayed = time_delayed + Tone.Time("8n").toSeconds();
            this.instrument.triggerAttackRelease(note, "8n", time_delayed);
            this.anim.animate(time_delayed);
            stepsAfter ++;
          }
    }

    else if(this.moodIs('dense')){
    let blockStep = this.orchestra.blockStep;
    let time_delayed = time;
    this.instrument.triggerAttackRelease(note, "8n", time_delayed);
      let stepsAfter = 1;
          while(stepsAfter+blockStep<BLOCK_SIZE
            && !this.playingBlock.getNote(blockStep+stepsAfter)
            && stepsAfter <= 8){
            time_delayed = time_delayed + Tone.Time("8n").toSeconds();
            this.instrument.triggerAttackRelease(note, "16n", time_delayed);
            this.anim.animate(time_delayed);
            stepsAfter ++;
          }
    }
  }


  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePattern(){

     let pattern;
    if(this.moodIs('light')) {pattern = [95,50,30,2,2,2,2,10]}
    else {pattern = [90,5,20,30,90,5,20,40];}

    return pattern;
  }

}

