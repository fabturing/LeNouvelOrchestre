class Flutist extends Agent {
  constructor(){
    super("Jiéf", "Petit flutiste debout sur un tabouret");
  }

  playNote(note){
    this.debugSynth.triggerAttackRelease(note, "8n");
  }

  generateStructure(){
    return ['A','B','C','B'];
  }

  generatePattern(){
    return [1, 1/3, 2/3, 1/3, 4/5, 1/3, 2/3, 1/3];
  }

  generateScale(){

    let scale = Tonal.Scale.get('C3 enigmatic').notes;
    return ['A1'];
  }

}


class Drummer extends Agent {
  constructor(){
    super("Liza", "Batteuse qui fais que fumer des clopes");
  }
}
