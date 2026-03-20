// This file define Agents classes for specific agents
// Agents should extends the Agent class.

// Settings MIXAGE -----------

// Jief joue de la FLUTE
let VOL_FLUTE = -8; //Volume en dB, max 0
const PAN_FLUTE = -0.65; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.

//Liza joue des DRUM
let VOL_DRUM = -13.5;
const PAN_DRUM = 0;

//Crocodus joue de la BASSE
let VOL_BASSE = -7;
const PAN_BASSE = 0;

//Normaliser volumes
let maxvol = Math.abs(Math.max(VOL_FLUTE, VOL_DRUM, VOL_BASSE));
VOL_FLUTE = VOL_FLUTE + maxvol;
VOL_DRUM = VOL_DRUM + maxvol;
VOL_BASSE = VOL_BASSE + maxvol;


class Jief extends Agent {
  constructor(){
    super("Jiéf", "Petit flutiste debout sur un tabouret");
    this.anim = new Anim('jief', false);
//FX
    const panflute = new Tone.Panner (PAN_FLUTE).toDestination();
    this.flute = new Tone.Sampler({
      urls: {
          C4: "C3.mp3",
      },
      baseUrl: "samples/flute/",
      }).connect(panflute);
      this.flute.volume.value = VOL_FLUTE ;
  }

  playNote(note, time){
    let blockStep = this.orchestra.blockStep;
    let nextNote = this.currentBlock.getNote(blockStep+1);
    let duration = Tone.Time("8n");
    // For even steps, if the next note is silent, double the duration.
    if(!nextNote && blockStep%2==0){
      duration = duration * 2;
    }
    this.flute.triggerAttackRelease(note, duration, time);
  }

  generateStructure(){
    return ['A','B','C','B'];
  }

  generatePattern(){
    return [.9, 1/3, 2/3, 1/3, 4/5, 1/3, 2/3, 1/3];
  }

  generateScale(){
    let scale = Tonal.Scale.get('C4 minor');
    return scale.notes;
  }
}


class Liza extends Agent {
  constructor(){
    super("Liza", "Batteuse qui fait que fumer des clopes", ['hihat', 'kick', 'snare']);
        this.anim = new Anim('liza', true);
//FX
    const pandrum = new Tone.Panner (PAN_DRUM).toDestination();

    this.drum = new Tone.Sampler({
      urls: {
          C3: "C3.mp3", //kick
          C4: "C4.mp3", //snare
          C5: "C5.mp3", //hihat
      },
      baseUrl: "samples/drum/",
      }).connect(pandrum);
      this.drum.volume.value = VOL_DRUM ;
      this.density = {
        hihat:Math.random(),
        kick:1,
        snare:1,
      }

      this.ignoreLeaderBlockInfluence = true;
  }
/*
  playNote.hihat(note, time){
    let velocite_hh = 1-Math.random()/2;
    this.drum.triggerAttackRelease('C5', "8n", time, velocite_hh);
  )

  playNote.kick(note, time){
    this.drum.triggerAttackRelease('C3', "8n", time);
  }

  playNote.snare(note, time){
    let velocite_snr = 1-Math.random()/2;
    this.drum.triggerAttackRelease('C4', "8n", time, velocite_snr);
  }
*/
  playNote(note, time){
    if(note.hihat){
      let velocite_hh = 1-Math.random()/2;
      this.drum.triggerAttackRelease('C5', "8n", time, velocite_hh);
    }
    if(note.kick){
      this.drum.triggerAttackRelease('C3', "8n", time);
    }
    if(note.snare){
      let velocite_snr = 1-Math.random()/2;
      this.drum.triggerAttackRelease('C4', "8n", time, velocite_snr);
    }

  }
  
  generatePattern(){
    let hhPattern = [.9,1,.9,1,.9,1,.9,1];

    // Change the hihat density by a small amount (between -0.05 and 0.5) within a min and a max
    this.density.hihat = this.density.hihat + ((Math.random()-0.5)*0.1); //Faire intervenir aura ici
    this.density.hihat = Math.min(1, this.density.hihat);
    this.density.hihat = Math.max(0.4, this.density.hihat);
    for (let i = 0; i < hhPattern.length; i++) {
      hhPattern[i] = hhPattern[i]*this.density.hihat;
      if(this.density.hihat < 0.5 ) hhPattern[i] = 0;
    }

    return {
     hihat : hhPattern,
     kick : [.95,.05,.05,.05,.3,.05,.2,.05],
     snare : [0,.05,0.6,.1,.2,.1,0.6,.1]
   }
  }

}


class Crocodus extends Agent {
  constructor(){
    super("Crocodus", "un crocodile qui joue de la basse, personne ne l'aime");
    this.anim = new Anim('crocodus', true);
//FX
    const panbasse = new Tone.Panner (PAN_BASSE).toDestination();
    const filtrebasse = new Tone.Filter( 1000, "lowpass").connect(panbasse);

    this.basse = new Tone.Sampler({
      urls: {
          C4: "C2.mp3",
      },
      baseUrl: "samples/basse/",
      }).connect(filtrebasse);
    this.basse.volume.value = VOL_BASSE ;
  }

  playNote(note, time){
  note = Tonal.Note.transpose(note, "-8P");
    this.basse.triggerAttackRelease(note, "4n", time);
  }


  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePattern(){
    return [.97, .05, .1, 1/4, .95, 0.1, .2, 0.2];
  }

  generateScale(){

    let scale = Tonal.Scale.get('C4 minor');

    return scale.notes;
  }

}


