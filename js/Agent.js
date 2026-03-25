// This file define the Agent class.
// An Agent is a musician in the Orchestra.

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
    this.category; // 'perc' ou 'melodic'
    this.ignoreLeaderBlockInfluence = false;
    this.ignorePreviousBlockInfluence = false;
    this.orchestra;
    this.muted = false;
    this.aura = 0;
    this.density = 1;
    this.currentBlock;
    this.instrument = new Tone.Synth().toDestination();
    this.debugBox = new DebugBox('agent-debug-box', this);
  }

  // Default method for playing a note. Should be overrided.
  playNote(note, time){
    this.instrument.triggerAttackRelease(note, "1n", time);
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
    if(!this.currentBlock) return null;
    return this.currentBlock.getPart(this.orchestra.step);
  }

  // getter for if the agent is playing this step
  get isPlaying(){
    // Orchestra not playing means not playing
    if(!this.orchestra.playing) return false;
    // no current block means not playing
    if(!this.currentBlock) return false;
    let note = this.currentNote;
    // no note means not playing
    if(!note) return false;
    // note defined as non-empty string means playing
    if(typeof note === 'string' && note.length) return true;
    // for note defined as object, check for non-empty line
    if(typeof note === 'object'){
      for(let line in note){
        if(note[line]) return true;
      }
      return false
    }
  }

  // Getter for current played note
  get currentNote(){
    return this.currentBlock?.getNote(this.orchestra.step)
  }

  // Method to be called after agent creation to attach an orchestra
  setOrchestra(orchestra){
    this.orchestra = orchestra;
  }

  // Method for turning mute on or off.
  toggleMute(){
    this.muted = !this.muted;
  }

  // Method to be called on each step
  playStep(step, time){
    let note = this.currentBlock.getNote(step);
    if(this.isPlaying){
      this.playNote(note, time);
      this.anim.animate(time);
    }
  }

  // Method for generating a melody from a pattern, a scale and models (models are optionals)
  generateMelo(pattern, scale, meloModel1, meloModel2){

    // Merge the given scale with notes in each models
    let mergedScale = scale;
    if(meloModel1) mergedScale = mergedScale.concat(meloModel1.filter(note=>note));
    if(meloModel2) mergedScale = mergedScale.concat(meloModel2.filter(note=>note));

    // Extract pattern from models
    const meloToPattern = (pattern)=>pattern.map(step=>step?1:0);
    let patternModel1 = meloModel1 ? meloToPattern(meloModel1) : pattern;
    let patternModel2 = meloModel2 ? meloToPattern(meloModel2) : pattern;

    // Merge pattern with models' patterns
    let mergedPattern = pattern.map((step, i)=>{
      return (step + patternModel1[i] + patternModel2[i])/3
    });

    // Generate a rythm from merged pattern
    let rythm = mergedPattern.map((prob)=> Math.random() < prob);

    // Generate and return the new melo  from rythm and merged scales
    let melo = rythm.map((play) => play? randomChoice(mergedScale) : null);

    return melo;
  }

  // Method for generating a part. (part should be "A", "B" or "C")
  generatePart(part, pattern, scale){
    // Get a first model from previous block
    let previousModel;
    if(this.ignorePreviousBlockInfluence) previousModel = undefined;
    else if(this.previousBlock) previousModel = this.previousBlock.getPartAsModel(part);
    else previousModel = undefined;

    // Get a second model from leader block
    let leaderModel;
    if(this.ignoreLeaderBlockInfluence) leaderModel = undefined;
    else if(this.orchestra.getLeader() == this) leaderModel = undefined;
    else if(!this.orchestra.getLeader().currentBlock) leaderModel = undefined;
    else leaderModel = this.orchestra.getLeader().currentBlock.getPartAsModel(part);

    //  melody generation
    let melo = [];

    // If there is lines, generate melody for each lines
    if(this.lines){
      this.lines.forEach(line=>{
        let linePattern = pattern[line] || pattern;
        let lineScale = scale[line] || scale;
        melo[line] = this.generateMelo(linePattern, lineScale, previousModel, leaderModel);
      });
    }
    // Else generate a single melody
    else {
      melo = this.generateMelo(pattern, scale, previousModel, leaderModel);
    }

    return melo;
  }

  // Method for generating a block
  generateBlock(){
    let pattern = this.generatePattern();
    let scale =  this.generateScale();
    let structure = this.generateStructure();
    let A = this.generatePart('A', pattern, scale);
    let B = this.generatePart('B', pattern, scale);
    let C = this.generatePart('C', pattern, scale);
    return new Block(A, B, C, structure, this.lines);
  }
  
  // Method for copying a block
  copyBlock(block){
      return new Block(block.A, block.B, block.C, block.structure, block.lines);
  }

  // Method for updating agent's block
  updateBlock(){
    this.previousBlock = this.currentBlock;
    this.currentBlock = this.generateBlock()
  }

  // Method for updating one part of agent's block
  updatePart(part){
    this.previousBlock = this.currentBlock;
    this.currentBlock = this.copyBlock(this.currentBlock);
    let pattern = this.generatePattern();
    let scale =  this.generateScale();
    this.currentBlock[part] = this.generatePart('A', pattern, scale);
  }

  // Debug methods
  initDebugBox(){
   this.debugBox.init();
  }
  updateDebugBox(){
    this.debugBox.update();
  }

}

