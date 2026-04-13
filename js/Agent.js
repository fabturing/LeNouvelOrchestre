// This file define the Agent class.
// An Agent is a musician in the Orchestra.

const MOOD_SPEED = 0.05;
const FATIGUE_FROM_PLAYING = 0.01; // By block (randomised)
const FATIGUE_FROM_RESTING = -0.01; // By block (randomised)
const FATIGUE_FROM_QUITTING_STAGE = 0.5; // By block (randomised)
const FATIGUE_FROM_ENTERING_STAGE = -0.5; // By block (randomised)

class Agent {
  constructor(name, description, id, lines) {
    // Name of the agent
    this.name = name;
    this.id = id
    // Description of the agent
    this.descritption = description;
    // Array of identifiants for the lines of the agent
    // Keep that undefined if there is only one line.
    this.lines = lines;
    // Other attributes
    this.category; // 'perc' ou 'melodic' ou 'bass'
    this.ignoreLeaderBlockInfluence = false;
    this.ignorePreviousBlockInfluence = false;
    this.orchestra;
    this.muted = false;
    this.onStage = false;
    this.onStageLastBlock = false;
    this.aura = 1;
    this.density = 1;
    this.fatigue = Math.random();
    this.mood = 0.5; // mood value;
    this.moods = []; // definition of moods (see addMove)
    this.moodPosition = Math.random()*100; // where does the agent mood is read in the perlin space;
    this.moodIsLocked = false;
    this.currentBlock;
    this.instrument = new Tone.Synth().toDestination();
    this.debugBox = new DebugBox('agent-debug-box', this);
    this.scale = Tonal.Scale.get('C4 minor').notes;
  }

  // Instrument methods

  // Return a promise that can be awaited for the sample to be loaded
  loadSampler(urls, baseUrl){
    return new Promise((resolve, reject)=>{
      this.instrument = new Tone.Sampler({
      urls: urls,
      baseUrl: baseUrl,
        onload:()=>resolve(),
        onerror:()=>reject(),
      });
    });
  }

  // Set the pan
  setPan(pan){
    //TODO: Make this method callable multiple times (for now it might only works for the first call)
    const panner = new Tone.Panner(pan).toDestination();
    this.instrument.connect(panner)
  }

  // Set the volume
  setVolume(volume){
    this.instrument.volume.value = volume ;
  }

  // Set a filter with a value
  setFilter(value, name){
    //TODO: Make this method callable multiple times (for now it might only works for the first call)
    const filter = new Tone.Filter(value, name)
    this.instrument.connect(filter);
  }



  // Moods methods

  // Getter for moodName
  get moodName(){
    return this.moods[this.moodIndex]?.name;
  }


  // Getter for moodIndex
  get moodIndex(){
    let totalPortions = this.moods.reduce((a,mood)=>a+mood.portion,0);
    let currentPortion = 0;
    let portionToReach = this.mood * totalPortions;
    for(let i = 0; i < this.moods.length; i++){
      currentPortion += this.moods[i].portion;
      if(currentPortion>portionToReach){
       return i;
      }
    }
  }

  // Add a new pôssible mood to the agent
  addMood(name, portion){
    this.moods.push({name:name, portion:portion});
  }

  // Returns true if mood
  moodIs(name){
    return this.moodName == name
  }
  // Method for  initializating Agent
  init(){
    this.anim.init();
    //this.updateBlock();
    this.aura = Math.random();
  }

  // Method for updating to be call on each block end
  update(){
    // fatigue
    if(this.onStage) this.fatigue += FATIGUE_FROM_PLAYING * Math.random();
    else this.fatigue += FATIGUE_FROM_RESTING * Math.random();
    // Coup de mou en quittant la scène ou boost d'energie en montant sur scène
    if(this.onStageLastBlock && !this.onStage) this.fatigue += FATIGUE_FROM_QUITTING_STAGE * Math.random();
    else if(!this.onStageLastBlock && this.onStage) this.fatigue += FATIGUE_FROM_ENTERING_STAGE * Math.random();
    this.onStageLastBlock = this.onStage;
    // Valeur contrainte entre 0 et 1
    if(this.fatigue<0) this.fatigue = 0;
    else if(this.fatigue>1) this.fatigue = 1;

    this.anim.setVisibility(this.onStage)
    this.aura += Math.random()/10;
    if(!this.moodIsLocked){
      this.mood = (noise.simplex2(this.moodPosition,this.orchestra.blockCount*MOOD_SPEED)+1)/2;
    }
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
    return Tonal.Scale.get('C4 minor').notes;
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
    //agent is muted ?
    if(this.muted) return false;
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

  // generate an array of chords from a pattern and a melody
  generateChords(pattern, melo){
    return pattern.map((step, i)=>{
      if (step && melody[i]){
        let chord = [
          this.scale[melody[i]],
          this.scale[melody[i]+2],
          this.scale[melody[i]+4]
        ];
        if (Tonal.Note.octave(chord[2]) > 4) {
          chord = chord.map(Tonal.Note.transposeBy("-8P"));
        }
        return chord;
      }
      else {
        return null;
      }
    });
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
    this.currentBlock = this.generateBlock();
  }

  // Method for updating one part of agent's block
  updatePart(part){
    this.previousBlock = this.currentBlock;
    if(!this.currentBlock) {
      this.currentBlock = this.generateBlock();
    }
    else{
      this.currentBlock = this.copyBlock(this.currentBlock);
    }
    let pattern = this.generatePattern();
    let scale =  this.generateScale();
    let structure = this.generateStructure();
    this.currentBlock.structure = structure;
    this.currentBlock[part] = this.generatePart('A', pattern, scale);
  }

  resetFatigue(){
    this.fatigue = 0;
  }
}
