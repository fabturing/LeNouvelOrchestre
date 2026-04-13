// This file define Agents classes for specific agents
// Agents should extends the Agent class.

// Settings MIXAGE -----------

// Jief joue de la FLUTE
let VOL_FLUTE = -20; //Volume en dB, max 0
const PAN_FLUTE = -0.25; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.

//Liza joue des DRUM
let VOL_DRUM = -13.5;
const PAN_DRUM = 0;

//Crocodus joue de la BASSE
let VOL_BASSE = -18;
const PAN_BASSE = 0;

// Pierre-Henry joue du XYLO
let VOL_XYLO = -2; //Volume en dB, max 0
const PAN_XYLO = 0.65; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.

//Normaliser volumes
let maxvol = Math.abs(Math.max(VOL_FLUTE, VOL_DRUM, VOL_BASSE));
VOL_FLUTE = VOL_FLUTE + maxvol;
VOL_DRUM = VOL_DRUM + maxvol;
VOL_BASSE = VOL_BASSE + maxvol;


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
        && !this.currentBlock.getNote(blockStep+stepsAfter)
        && stepsAfter <= 2){
        stepsAfter ++;
      }
      return duration * stepsAfter;
    }
    // Mood : longcourt
    else if(this.moodIs('courtlong')) {
      let nextNote = this.currentBlock.getNote(blockStep+1);
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
    let random = Math.random();
    if(random < this.fatigue ){pattern = [1, 1, 1, 1, 1, 1, 1, 1];}
    return pattern.map(percent);
  }

  generateScale(){
   return this.scale;
  }
}


class Liza extends Agent {
  constructor(){
    super("Liza", "Batteuse qui fait que fumer des clopes", "liza", ['hihat', 'kick', 'snare']);
    this.anim = new Anim('liza', true);
    this.category = 'perc';



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
    if(note.kick){
      this.instrument.triggerAttackRelease('C3', "8n", time);
    }
    if(note.snare){
      let velocite_snr = 1-Math.random()/2;
      this.instrument.triggerAttackRelease('C4', "8n", time, velocite_snr);
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


class Crocodus extends Agent {
  constructor(){
    super("Crocodus", "un crocodile qui joue de la basse, personne ne l'aime", "crocodus");
    this.anim = new Anim('crocodus', true);
    this.category = 'bass';

        // moods
    this.addMood('light', 50);
    this.addMood('normal', 50);
    this.addMood('rebond', 50);
    this.addMood('dense', 20);
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
            && !this.currentBlock.getNote(blockStep+stepsAfter)
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
            && !this.currentBlock.getNote(blockStep+stepsAfter)
            && stepsAfter <= 8){
            time_delayed = time_delayed + Tone.Time("8n").toSeconds();
            this.instrument.triggerAttackRelease(note, "8n", time_delayed);
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

    return pattern.map(percent);
  }

  generateScale(){
      return this.scale;
  }

}




class PierreHenry extends Agent {
  constructor(){
    super("Pierre-Henry", "Squelette qui joue du xylophone (parce que c'est ce que les squelettes font)", "pierrehenry");
    this.anim = new Anim('pierrehenry', true);
    this.ignoreLeaderBlockInfluence = true;
    this.ignorePreviousBlockInfluence = true;
    this.category = 'melodic';

// moods
    this.addMood('quinte_arp', 30);
    this.addMood('quinte', 10);
    this.addMood('quinte/tierce', 15);
    this.addMood('tierce', 10);
    this.addMood('tierce_arp', 30);
  }

  async loadInstrument(){
    const samples = {C3: "xylo_long.mp3"}
    await this.loadSampler(samples, "samples/xylo/");
    this.setPan(PAN_XYLO);
    this.setVolume(VOL_XYLO)
  }


  generateScale(){
    return this.scale;
  }

  playNote(note, time){
    let agents = this.orchestra.agentsOnStage;
  // Le premier agent de la catégorie bass
  let bassAgent = agents.find(agent=>agent.category=='bass');
  // Si il existe ET qu'il est en train de jouer une note
  if(bassAgent && bassAgent.currentNote){
    // Récupérer sa note
    note = bassAgent.currentNote;
   }



   const isNote = (element) => element == note;
   let index = this.scale.findIndex(isNote);
   let quinte, tierce;
            if (index > -1) {quinte = this.scale[(index+4)%this.scale.length];
            tierce = this.scale[(index+2)%this.scale.length];
            }
            else{quinte = Tonal.Note.transpose(note, "5P");
             tierce = octave}
             let octave = Tonal.Note.transpose(note, "8P");



    if(this.moodIs('quinte')){

      let delayedTime = time + Math.random()/50;
      this.instrument.triggerAttackRelease(note, "4n", time);
      this.instrument.triggerAttackRelease(quinte , "4n", delayedTime);
    }

   else if(this.moodIs('tierce')){

      let delayedTime = time + Math.random()/50;
      this.instrument.triggerAttackRelease(note, "4n", time);
      this.instrument.triggerAttackRelease(tierce , "4n", delayedTime);
    }

    else if(this.moodIs('quinte/tierce')){

      let delayedTime = time + Math.random()/50;
      this.instrument.triggerAttackRelease(note, "4n", time);
      let random = Math.random();
      if(random < 0.5){
        this.instrument.triggerAttackRelease(tierce , "4n", delayedTime);
      }
      else {this.instrument.triggerAttackRelease(quinte, "4n", delayedTime);}

    }

    else if(this.moodIs('quinte_arp')){
      let random = Math.random();
      let stepTime1 = time + Tone.Time("8n").toSeconds();
      let stepTime2 = time + 2*Tone.Time("8n").toSeconds();
      let stepTime3 = time + 3*Tone.Time("8n").toSeconds();

      this.instrument.triggerAttackRelease(note, "8n", stepTime1);
      if(random < 0.2){
        this.instrument.triggerAttackRelease(octave, "8n", stepTime2);
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime3);
      }
      else if(random < 0.4){
        this.instrument.triggerAttackRelease(octave, "8n", stepTime2);
        this.instrument.triggerAttackRelease(note, "8n", stepTime3);
      }
      else{
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime2);
        this.instrument.triggerAttackRelease(octave, "8n", stepTime3);
      }
      this.anim.animate(stepTime1);
      this.anim.animate(stepTime2);
      this.anim.animate(stepTime3);
    }

    else if(this.moodIs('tierce_arp')){
      let random = Math.random();
      let stepTime1 = time + Tone.Time("8n").toSeconds();
      let stepTime2 = time + 2*Tone.Time("8n").toSeconds();
      let stepTime3 = time + 3*Tone.Time("8n").toSeconds();
      this.instrument.triggerAttackRelease(note, "8n", stepTime1);
      this.anim.animate(stepTime1);
      if(random < 0.2){
        this.instrument.triggerAttackRelease(tierce, "8n", stepTime2);
        this.instrument.triggerAttackRelease(note, "8n", stepTime3);
      }
      else if(random < 0.4){
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime2);
        this.instrument.triggerAttackRelease(tierce, "8n", stepTime3);
      }
      else{
        this.instrument.triggerAttackRelease(tierce, "8n", stepTime2);
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime3);
      }

    this.anim.animate(stepTime2);
    this.anim.animate(stepTime3);
}

  }

  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePattern(){
    let pattern ;
    if(this.moodIs('quinte') || this.moodIs('tierce') || this.moodIs('quinte/tierce')) { pattern = [90, 5, 10, 25, 80, 10, 20, 20];}
    else if(this.moodIs('quinte_arp') || this.moodIs('tierce_arp')){ pattern = [80, 0, 0, 0, 80, 0, 0, 0];}
    return pattern.map(percent);
  }



}


