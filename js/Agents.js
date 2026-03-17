class Flutist extends Agent {
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


class Drummer extends Agent {
  constructor(){
    super("Liza", "Batteuse qui fais que fumer des clopes", ['hithat', 'kick']);
    this.lines = ['hithat', 'kick'];
    this.drum = new Tone.Sampler({
      urls: {
          C3: "C3.mp3",
          C4: "C4.mp3",
          C5: "C5.mp3",
      },
      baseUrl: "samples/drum/",
      }).toDestination();
  }

  playNote(note){
        console.log("Liza joue : ", note)
    if(note.hithat){
      this.drum.triggerAttackRelease('C3', "8n");
    }
    if(note.kick){
      this.drum.triggerAttackRelease('C4', "8n");
    }

  }

  generatePattern(){
    return {
     hithat : [1,0,1/2,0,1,0,1/2,0],
     kick :   [1,0,1/2,0,1,0,1/2,0],
    };
  }

}
