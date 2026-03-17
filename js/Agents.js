class Jief extends Agent {
  constructor(){
    super("Jiéf", "Petit flutiste debout sur un tabouret");
    this.flute = new Tone.Sampler({
      urls: {
          C3: "C3.mp3",
      },
      baseUrl: "samples/flute/",
      }).toDestination();

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

    let scale = Tonal.Scale.get('C4 enigmatic');

    return scale.notes;
  }

}


class Liza extends Agent {
  constructor(){

    super("Liza", "Batteuse qui fais que fumer des clopes", ['hihat', 'kick', 'snare']);

    this.drum = new Tone.Sampler({
      urls: {
          C3: "C3.mp3", //kick
          C4: "C4.mp3", //snare
          C5: "C5.mp3", //hihat
      },
      baseUrl: "samples/drum/",
      }).toDestination();
  }

  playNote(note){
    if(note.hihat){
      this.drum.triggerAttackRelease('C5', "8n");
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
     hihat : [.9,.9,.9,.9,.9,.9,.9,.9,],
     kick :   [1,.1,1/4,.1,3/4,.1,1/4,.1],
     snare : [0,.1,1/2,.2,.1,.1,1/2,.2],
    };
  }

}


class Crocodus extends Agent {
  constructor(){
    super("Crocodus", "un crocodile qui joue du synthé personne ne l'aime");
  }

  playNote(note){
    this.debugSynth.triggerAttackRelease(note, "1");
  }


  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePattern(){
    return [1, 0, 0, 0, 1, 0, 0, 0];
  }

  generateScale(){

    let scale = Tonal.Scale.get('C4 minor');

    return scale.notes;
  }

}
