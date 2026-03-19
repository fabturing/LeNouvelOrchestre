
const VOL_FLUTE = -8;
const VOL_DRUM = -14;
const VOL_BASSE = -7;
let densité_hh = Math.random(); // Ajouter aux attributs visibles sur la console de liza


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

    super("Liza", "Batteuse qui fait que fumer des clopes",['hihat', 'kick', 'snare']);
    this.drum = new Tone.Sampler({
      urls: {
          C3: "C3.mp3", //kick
          C4: "C4.mp3", //snare
          C5: "C5.mp3", //hihat
      },
      baseUrl: "samples/drum/",
      }).toDestination();
      this.drum.volume.value = VOL_DRUM ;
  }

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
    let pattern_hh = [.9,1,.9,1,.9,1,.9,1];
    densité_hh = densité_hh + ( (Math.random()-0.5)*0.1); //Faire intervenir aura ici
    densité_hh = Math.min(1, densité_hh);
    densité_hh = Math.max(0.4, densité_hh);
    console.log("densité_hh=", densité_hh);
    if(densité_hh < 0.5 ){
      for (let i = 0; i < pattern_hh.length; i++) {pattern_hh[i] = 0}
    }
    else {for (let i = 0; i < pattern_hh.length; i++) {pattern_hh[i] = pattern_hh[i]*densité_hh}
    }
      return {
       hihat : pattern_hh,
       kick :   [.95,.05,.05,.05,.3,.05,.2,.05],
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


