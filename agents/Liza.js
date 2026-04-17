// This file define Liza class


class Liza extends Agent {
  constructor(){
    super("Liza", "Batteuse qui fait que fumer des clopes", "liza", ['hihat', 'kick', 'snare']);
    this.anim = new Anim('liza', true);
    this.category = 'perc';
    this.leavingTime = 4;

    this.density = {
      hihat:Math.random(),
      kick:1,
      snare:1,
    }

    this.ignoreLeaderBlockInfluence = true;

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


  playNote(note, time){
    if(note.hihat){
      let velocite_hh = 1-Math.random()/2;
      if (!(this.hasEnteredSince(4))) {
        this.instrument.triggerAttackRelease('C5', "8n", time, velocite_hh);
        if(this.moodIs('double')){
          let time_delayed = time + Tone.Time("16n").toSeconds();
          this.instrument.triggerAttackRelease('C5', "8n", time_delayed, velocite_hh-Math.random()/3);
          this.anim.animate(time_delayed);
        }
        else if(this.moodIs('speed')){
          let random = Math.random();
          if(random < 0.2){
            let time_delayed = time + Tone.Time("16n").toSeconds();
            this.instrument.triggerAttackRelease('C5', "8n", time_delayed, velocite_hh-Math.random()/3);
            this.anim.animate(time_delayed);
          }
          else if(random < 0.4){
            let time_delayed = time + Tone.Time("16t").toSeconds();
            let time_delayed2 = time_delayed + Tone.Time("16t").toSeconds();
            this.instrument.triggerAttackRelease('C5', "8n", time_delayed, velocite_hh-Math.random()/3);
            this.instrument.triggerAttackRelease('C5', "8n", time_delayed2, velocite_hh-Math.random()/3);
            this.anim.animate(time_delayed);
            this.anim.animate(time_delayed2);
          }
        }
      }


      }
    if(note.kick){
      if (!(this.willLeaveIn(this.leavingTime))) {
        this.instrument.triggerAttackRelease('C3', "8n", time);
      }
    }

    if(note.snare){
      if (!(this.willLeaveIn(this.leavingTime))) {
        let velocite_snr = 1-Math.random()/2;
        this.instrument.triggerAttackRelease('C4', "8n", time, velocite_snr);
      }
    }

  }

  generateStructure(){
      if(this.moodIs('straight')) {
        return ['A','A','A','B'];
      }
      else{
        return ['A','A','A','A'];
      }
  }

  generatePattern(){
    let hhPattern, kickPattern, snarePattern;

 // Mood : Light
    if(this.moodIs('light')){
      hhPattern = [30,70,30,70,30,70,30,70];
      kickPattern = [97, 10, 5, 5, 50, 5, 10, 5];
      snarePattern = [0, 2, 3, 2, 10, 2, 2, 2];
    }

    // Mood : Straight
    else if(this.moodIs('straight')){

      hhPattern = [95,99,99,99,95,99,99,99];
      kickPattern = [100, 5, 10, 5, 20, 5, 10, 5];
      snarePattern = [0, 0, 5, 0, 100, 5, 10, 0];
    }



    // Mood : double
    else if(this.moodIs('double')){
      hhPattern = [95,99,99,99,95,99,99,99];
      kickPattern = [100, 5, 10, 5, 20, 5, 10, 5];
      snarePattern = [0, 0, 5, 0, 100, 5, 10, 0];

    }

    // Mood : Speed
    else if(this.moodIs('speed')){
      hhPattern = [60,100,60,100,60,100,60,100];
      kickPattern = [98, 2, 20, 2, 98, 2, 20, 2];
      snarePattern = [0, 2, 98, 10, 0, 5, 98, 20];
    }

    /*
    // Change the hihat density by a small amount (between -0.05 and 0.5) within a min and a max
    this.density.hihat = this.density.hihat + ((Math.random()-0.5)*0.4); //Faire intervenir aura ici
    this.density.hihat = Math.min(1, this.density.hihat);
    this.density.hihat = Math.max(0.6, this.density.hihat);

    // Apply density to pattern
    for (let i = 0; i < hhPattern.length; i++) {
      hhPattern[i] = hhPattern[i]*this.density.hihat;
      if(this.density.hihat < 0.5 ) hhPattern[i] = 0;
    }
*/
    return {
     hihat : hhPattern.map(percent),
     kick : kickPattern.map(percent),
     snare : snarePattern.map(percent)
   }
  }

}

