
const VOL_FLUTE = -8;
const VOL_DRUM = -12;
const VOL_BASSE = -5;
const VOL_HH_FAIBLE = 7; // Nombre maximum de dB qu'on retranchera à VOL_DRUM pour obtenir des HH au son plus faible 



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

  playNote(note){
    console.log("flutiste joue : ", note)
    this.flute.triggerAttackRelease(note, "8n");
  }

  generateStructure(){
    return ['A','B','C','B'];
  }

  generatePattern(){
    return [1, 1/3, 2/3, 1/3, 4/5, 1/3, 2/3, 1/3];
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

  playNote(note, ){
    if(note.hihat){
      let velocite = 1-Math.random()/2;
      this.drum.triggerAttackRelease('C5', "8n", Tone.now(), velocite);
    }
    if(note.kick){
      this.drum.triggerAttackRelease('C3', "8n");
    }
    if(note.snare){
      this.drum.triggerAttackRelease('C4', "8n");
    }

  }
  
   generatePattern(){
    return {
     hihat : [.9,.9,.9,.9,.9,.9,.9,.9],
     kick :   [1,0,1,0,1,0,1,0],
      snare : [0,0,0,0,0,0,0,0],

    };
  }

 /* generatePattern(){
    return {
     hihat : [.9,.9,.9,.9,.9,.9,.9,.9],
     kick :   [1,.1,1/4,.1,3/4,.1,1/4,.1],
     snare : [0,.1,0.8,.2,.3,.1,0.8,.2],
    };
  }*/

}



class Crocodus extends Agent {
  constructor(){
    super("Crocodus", "un crocodile qui joue de la basse, personne ne l'aime");
    this.basse = new Tone.Sampler({
      urls: {
          C4: "C2.mp3",
      },
      baseUrl: "samples/basse/",
      }).toDestination();
    this.basse.volume.value = VOL_BASSE ;
  }

  playNote(note){
  note = Tonal.Note.transpose(note, "-8P");
    this.basse.triggerAttackRelease(note, "2n");
  }


  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePattern(){
    return [1, 0, 1/5, 1/4, 1, 0, 1/5, 1/4];
  }

  generateScale(){

    let scale = Tonal.Scale.get('C4 minor');

    return scale.notes;
  }

}


