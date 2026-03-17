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

  // Function for generating a melody giving a pattern, a scale and models
  generateMelo(pattern, scale, meloModel1, meloModel2){

    const randomChoice = (arr)=>arr[Math.floor(arr.length * Math.random())];

    let mergedScale = scale
    if(meloModel1) mergedScale = mergedScale.concat(meloModel1.filter(note=>note));
    if(meloModel2) mergedScale = mergedScale.concat(meloModel2.filter(note=>note));

    const meloToPattern = (pattern)=>pattern.map(step=>step?1:0);

    let patternModel1 = meloModel1 ? meloToPattern(patternModel1) : pattern;
    let patternModel2 = meloModel2 ? meloToPattern(patternModel1) : pattern;

    let mergedPattern = pattern.map((step, i)=>{
      return (step + patternModel1[i] + patternModel2[i])/3
    });

    let rythm = mergedPattern.map((prob)=> Math.random() < prob);
    let melo = rythm.map((play) => play? randomChoice(mergedScale) : null);

    return melo;
  }

  generatePart(part){

    let meloModel1 = this.previousBlock[part];
    let meloModel2 = this.orchestra.getLeader().currentBlock[part];

    // If there is lines, generate melody for each lines
    if(this.lines){
      let meloByLines = Object.fromEntries(this.lines.map(line => {
        let pattern = this.pattern[line] || this.pattern;
        let scale = this.scale[line] || this.scale;
        let melo = this.generateMelo(pattern, scale);
        return [line, melo];
      }));

      // Convert object of array to array of objects
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
      return this.generateMelo(this.pattern, this.scale, meloModel1, meloModel2);
    }


  }

  generateBlock(){
    let a = this.generatePart('A');
    let b = this.generatePart('B');
    let c = this.generatePart('C');
    let structure = this.structure;
    return new Block(a, b, c, structure);
  }
  
  updateBlock(){
    this.previousBlock = this.currentBlock;
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
