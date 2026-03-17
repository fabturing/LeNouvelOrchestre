class Agent {
  constructor(name, description, lines) {
    this.name = name;
    this.descritption = description;
    this.lines = lines;


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
    console.log(this.name, "joue : ", note);
    if(note){
      this.playNote(note)
    }
  }


  generateMelo(){

    const randomChoice = (arr)=>arr[Math.floor(arr.length * Math.random())];
    const generate = (pattern, scale)=>{
      let rythm = pattern.map((prob)=> Math.random() < prob);
      let melo = rythm.map((play) => play? randomChoice(scale) : null);
      return melo;
    }
    if(this.lines){
      let meloByLines = Object.fromEntries(this.lines.map(line => {
        let pattern = this.pattern[line] || this.pattern;
        let scale = this.scale[line] || this.scale;
        let melo = generate(pattern, scale);
        return [line, melo];
      }));

      let meloLength = meloByLines[this.lines[0]].length;

      let melo = [];
      for(let i = 0; i <= meloLength;  i++){
        let step = Object.fromEntries(this.lines.map((line)=>[line,meloByLines[line][i]]));
        melo[i]= step;
      }
      return melo;


    }
    else {
      return generate(this.pattern, this.scale);
    }

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
