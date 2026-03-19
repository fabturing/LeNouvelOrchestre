// This file define Agents classes for specific agents
// Agents should extends the Agent class.

// Settings
const VOL_FLUTE = -8;
const VOL_DRUM = -14;
const VOL_BASSE = -7;

class Jief extends Agent {
  constructor(){
    super("Jiéf", "Petit flutiste debout sur un tabouret");
    this.flute = new Tone.Sampler({
      urls: {
          C4: "C3.mp3",
      },
      baseUrl: "samples/flute/",
      }).toDestination();
      this.flute.volume.value = VOL_FLUTE ;
  }

  playNote(note, time){
    this.flute.triggerAttackRelease(note, "8n", time);
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
    this.drum = new Tone.Sampler({
      urls: {
          C3: "C3.mp3", //kick
          C4: "C4.mp3", //snare
          C5: "C5.mp3", //hihat
      },
      baseUrl: "samples/drum/",
      }).toDestination();
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
    const filtre = new Tone.Filter( 1000, "lowpass").toDestination();
    this.basse = new Tone.Sampler({
      urls: {
          C4: "C2.mp3",
      },
      baseUrl: "samples/basse/",
      }).connect(filtre);
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


