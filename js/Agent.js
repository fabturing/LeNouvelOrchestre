class Agent {
  constructor(name, description) {
    this.name = name;
    this.descritption = description;
    this.aura = 0;
    this.pattern = this.generatePattern();
    this.scale = this.generateScale();
    this.structure = this.generateStructure();
    this.currentBlock = this.generateBlock();
    this.debugSynth = new Tone.Synth().toDestination();
  }



  playNote(note){
    this.debugSynth.triggerAttackRelease(note, "1n");
  }

  generateStructure(){
    return ['A','A','A','A'];
  }

  generatePattern(){
    return [1,1,1,1];
  }

  generateScale(){
    return ['A1'];
  }




  get currentBlockRepr(){
    return this.currentBlock.repr();
  }

  playStep(step){
    let note = this.currentBlock.getNote(step);
    if(note){
      this.playNote(note)
    }
  }


  generateMelo(){
    const randomChoice = (arr)=>arr[Math.floor(arr.length * Math.random())];
    let rythm = this.pattern.map((prob)=> Math.random() < prob);
    let melo = rythm.map((play) => play? randomChoice(this.scale) : null);
    return melo;
  }

  generateBlock(){
    let a = this.generateMelo();
    let b = this.generateMelo();
    let c = this.generateMelo();
    let structure = this.structure;
    return new Block(a, b, c, structure);
  }
  
  createDebugBox(){
    const template = document.getElementById('agent-debug-box');
    this.debugBox = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(this.debugBox);
  }
  
  updateDebugBox(){
    this.debugBox.querySelectorAll('[data-attribute]').forEach(element=>{
      let attribute = element.dataset.attribute;
      let value = this[attribute];
      element.innerHTML = value;
    });
  }
}
