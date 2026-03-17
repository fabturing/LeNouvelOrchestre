class Agent {

  constructor(name, description, lines) {
    // Name of the agent
    this.name = name;
    // Description of the agent
    this.descritption = description;
    // Array of identifiants for the lines of the agent
    // Keep that undefined if there is only one line.
    this.lines = lines;

    // Other attributes
    this.orchestra;
    this.aura = 0;
    this.pattern = this.generatePattern();
    this.scale = this.generateScale();
    this.structure = this.generateStructure();
    this.currentBlock = this.generateBlock();
    this.debugSynth = new Tone.Synth().toDestination();
  }

  // Default method for playing a note. Should be overrided.
  playNote(note){
    this.debugSynth.triggerAttackRelease(note, "1n");
  }

  // Default method for generating a structure. Should be overrided.
  generateStructure(){
    return ['A','A','A','A'];
  }

  // Default method for generating a pattern. Should be overrided.
  generatePattern(){
    return [1,1,1,1];
  }
  // Default method for generating a scale. Should be overrided.
  generateScale(){
    return ['A1'];
  }


  // getter for debugging block
  get currentBlockRepr(){
    return this.currentBlock.repr();
  }


  // getter for current part
  get currentPart(){
    return this.currentBlock.getPart(this.orchestra.step);
  }

  // getter for if the agent is playing this step
  get isPlyaing(){
    return this.currentBlock.getNote(this.orchestra.step);
  }


  setOrchestra(orchestra){
    this.orchestra = orchestra;
  }


  playStep(step){

    let note = this.currentBlock.getNote(step);
    if(note){
      this.playNote(note)
    }
  }


  generateMelo(){
    const randomChoice = (arr)=>arr[Math.floor(arr.length * Math.random())];

    // Function for generating a melody giving a pattern and a scale.
    const generate = (pattern, scale)=>{
      let rythm = pattern.map((prob)=> Math.random() < prob);
      let melo = rythm.map((play) => play? randomChoice(scale) : null);
      return melo;
    }

    // If there is lines, generate melody for each lines
    if(this.lines){
      let meloByLines = Object.fromEntries(this.lines.map(line => {
        let pattern = this.pattern[line] || this.pattern;
        let scale = this.scale[line] || this.scale;
        let melo = generate(pattern, scale);
        return [line, melo];
      }));
      let meloLength = meloByLines[this.lines[0]].length;
      let melo = [];
      for(let i = 0; i < meloLength;  i++){
        let step = Object.fromEntries(this.lines.map((line)=>[line,meloByLines[line][i]]));
        melo[i]= step;
      }
      return melo;
    }
    // Else generate a single melody
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
  
  updateBlocks(){
    this.currentBlock = this.generateBlock()
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
