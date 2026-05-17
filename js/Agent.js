// This file define the Agent class.
// An Agent is a musician in the Orchestra.

class Agent {
  constructor(name, description, id, lines) {
    // Name of the agent
    this.name = name;
    this.id = id
    // Description of the agent
    this.descritption = description;
    // Array of identifiants for the lines of the agent
    this.lines = lines || ['main'];
    // Other attributes
    this.category; // 'perc' ou 'melodic' ou 'bass'
    this.orchestra;
    this.muted = false;
    this.onStage = false;
    this.enteringTime = 1;
    this.entering = -1;
    this.leavingTime = 1;
    this.leaving = -1;
	this.playingLinesNotes = Object.fromEntries(this.lines.map(line=>[line, new Set()]));
    this.aura = 1;
    this.density = 1;
    this.fatigue = Math.random();
    
    this.mood = 0.5; // mood value;
    this.moods = []; // definition of moods (see addMood)
    this.moodPosition = Math.random()*100; // where does the agent mood is read in the perlin space;
    this.moodIsLocked = false;
    
    this.currentBlock;
    this.instrument = {main:[]};
    this.debugBox = new DebugBox('agent-debug-box', this);
    this.scale;

  }

  // Instrument methods

  // Return a promise that can be awaited for the sample to be loaded
  loadSampler(urls, baseUrl, line){
	line = line || 'main'
    return new Promise((resolve, reject)=>{
      let sampler = new Tone.Sampler({
      urls: urls,
      baseUrl: baseUrl,
        onload:()=>resolve(),
        onerror:()=>reject(),
      });
      if(!(line in this.instrument)){
		  this.instrument[line] = [];
	  }
      this.instrument[line].push(sampler);
    });
  }

  // Set the pan
  setPan(pan){
    //TODO: Make this method callable multiple times (for now it might only works for the first call)
    const panner = new Tone.Panner(pan).toDestination();
	for(let line in this.instrument){
	    this.instrument[line].forEach(instr=>instr.connect(panner));
	}
  }

  // Set the volume
  setVolume(volume, line){
	line = line || 'main';
    this.instrument[line].forEach(instr=>instr.volume.value = volume);
  }

  // Set a filter with a value
  setFilter(value, name){
    //TODO: Make this method callable multiple times (for now it might only works for the first call)
    const filter = new Tone.Filter(value, name)
    for(let line in this.instrument){
	    this.instrument[line].forEach(instr=>instr.connect(filter));
	}
  }

  setScale(notesArray){
	  this.scale = notesArray;
	  this.scale = this.scale.map(Tonal.Note.simplify);
  };

  // Moods methods

  // Getter for moodName
  get moodName(){
    // TODO: Use the new WeightedArray Object for moods
    let mood = selectFromWeightedArray(this.moods, this.mood);
    if(mood) return mood.name;
  }

  // Add a new pôssible mood to the agent
  addMood(name, weight){
    this.moods.push({name:name, weight:weight});
  }

  // Returns true if mood
  moodIs(name){
    return this.moodName == name
  }
  // Method for  initializating Agent
  init(){

    this.anim.init();
    this.setScale(Tonal.Scale.get(this.orchestra.getScaleName()).notes);
    this.aura = Math.random();
  }

  // Method called when agent enter the stage
  enter(){
    this.entering = this.enteringTime;
  }

  // Method called when agent leave the stage
  leave(){
    this.leaving = this.leavingTime;
  }

  // Return true if the agent has entered the stage since n or minus blocks
  hasEnteredSince(n){
    return this.entering < 0 && Math.abs(this.entering) <= n;
  }

  // Return true if the agent will leave the stage in n or minus blocks
  willLeaveIn(n){
    return this.leaving >= 0 && this.leaving <= n;
  }

  // Method for updating to be call on each block end
  update(){
    // leaving / entering stage
    if(this.entering == 0){
      this.onStage = true;
      this.fatigue += FATIGUE_FROM_ENTERING_STAGE * Math.random();
    } else if(this.leaving == 0){
      this.onStage = false;
      this.fatigue += FATIGUE_FROM_QUITTING_STAGE * Math.random();
    }
    this.entering --;
    this.leaving --;

    // fatigue
    if(this.onStage) this.fatigue += FATIGUE_FROM_PLAYING * Math.random();
    else this.fatigue += FATIGUE_FROM_RESTING * Math.random();

    // Valeur contrainte entre 0 et 1
    this.fatigue = Math.min(Math.max(this.fatigue, 0), 1);

    this.anim.setVisibility(this.onStage)
    this.aura += Math.random()/10;
    if(!this.moodIsLocked){
	
	 this.mood = perlinpinpin(this.moodPosition, this.orchestra.blockCount*MOOD_SPEED);

    }
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
  generateNotesPattern(){
    return Pattern.newFromRepeatedUniform(this.scale);
  }

  // Getter for playing block
  get playingBlock(){
    if(orchestra.playingChorus) return this.chorusBlock;
    return this.currentBlock;
  }

  // getter for debugging block
  get playingBlockRepr(){
    return this.playingBlock.repr();
  }

  // getter for playing part name
  get playingPartName(){
    if(!this.playingBlock) return null;
    return this.playingBlock.getPartName(this.orchestra.step);
  }

  // getter for if the agent is playing this step
  get isPlaying(){
    if(this.muted) return false;
    if(!this.onStage) return false;
    if(!this.orchestra.playing) return false;
    if(!this.playingBlock) return false;
    
    let note = this.playingNote;
    if(!note) return false;

    for(let line in note){
      if(note[line]) return true;
    }
    return false;

  }

  // Getter for current played note
  get playingNote(){
    return this.playingBlock?.getNote(this.orchestra.step);
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
  onStep(step, time){
    //let stepAttributes = this.playingBlock.getNote(step);
    let stepAttributes = this.playingBlock.getStep(step);
    if(this.isPlaying){
      for(let line in stepAttributes){
        this.playStep(stepAttributes[line], time, line)
      }
    }
  }

  playInstrument(note, duration, time, velocite, line){
	
	let instr = randomChoice(this.instrument[line]);
	instr.triggerAttackRelease(note, duration, time, velocite);
    
    let delay = Tone.Time(RYTHMIC_ANIM_FRAME_DURATION);
	Tone.Draw.schedule(()=>{this.playingLinesNotes[line].add(note)}, time);
	this.anim.animate(time);
	Tone.Draw.schedule(()=>{this.playingLinesNotes[line].delete(note)},time + delay);
  }
  
  animateStep(stepAttributes, time){
		//TODO: C'est quoi cette methode ??? Suprimer???
  }
  
  playStep(step, time, line){
    if(step.play){
      let duration = Tone.Time("8n") * step.duration;
      let note = step.note;
      let noteIndex = Math.max(0, this.scale.findIndex(n=>n==note));
      let velocite = step.accent ? 1 : 0.5;

      step.chord.forEach(degree=>{
        let chordNote = this.scale[(noteIndex+degree-1)%this.scale.length];
        step.rythm.forEach((subStep, i)=>{
		  if(subStep){  
			let rythmLength = Tone.Time("8n") * step.rythmLength;
			let subStepTime = time + i * (rythmLength / step.rythm.length);
			this.playInstrument(chordNote, duration, subStepTime, velocite, line);
		  }
        });
      });
    }
  }

  generateInfluencePatterns(partName){
    return {
      notes:this.currentBlock?.extractPattern('notes', partName),
      plays:this.currentBlock?.extractPattern('plays', partName),
    }
  }

  generatePart (partName, line){
    let part = new Part();

    let leader = this.orchestra.getLeader();
    let leaderPatterns = leader.generateInfluencePatterns(partName);

    // Plays
    let playsWeightedPatterns = new WeightedArray();
    playsWeightedPatterns.add(50, this.generatePlaysPattern(line));
    if(leader != this && leaderPatterns.plays){
      playsWeightedPatterns.add(50, leaderPatterns.plays);
    }
    if(this.previousBlock){
      playsWeightedPatterns.add(50, this.previousBlock.extractPattern('plays', partName, line));
    }
    let playsPattern = Pattern.mergePatternsWeightedArray(playsWeightedPatterns);
    part.setAttributeFromPattern('plays', playsPattern);

    // Notes
    let notesWeightedPatterns = new WeightedArray();
    notesWeightedPatterns.add(50, this.generateNotesPattern());
    if(leader != this && leaderPatterns.notes){
      notesWeightedPatterns.add(50, leaderPatterns.notes);
    }
    if(this.previousBlock){
      notesWeightedPatterns.add(50, this.previousBlock.extractPattern('notes', partName, line));
    }
    let notesPattern = Pattern.mergePatternsWeightedArray(notesWeightedPatterns);
    part.setAttributeFromPattern('notes', notesPattern);

    return part;
  }

  // generate an array of chords from a pattern and a melody
  // TODO: Vérifier si cette méthode est utilisée sinon la suppr ?
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


    let structure = this.generateStructure();

    let blockParts = {};
    ['A','B','C'].forEach(partName=>{
        blockParts[partName] = {};
        this.lines.forEach(line=>{
          blockParts[partName][line] = this.generatePart(partName, line);
        });
    });
    return new Block(blockParts.A, blockParts.B, blockParts.C, structure, this.lines);
  }

  // Method for updating agent's block
  updateBlock(){
    this.previousBlock = this.currentBlock;
    this.currentBlock = this.generateBlock();
  }

  // Method for updating one part of agent's block
  updatePart(partName){
    this.previousBlock = this.currentBlock;
    if(this.currentBlock) {
      this.currentBlock = this.currentBlock.copy();
    }
    else{
      this.currentBlock = this.generateBlock();
    }

    this.currentBlock.structure = this.generateStructure();

    this.lines.forEach(line=>{
      this.currentBlock[partName][line] = this.generatePart(partName, line);
    });
  }

  // Method for reseting fatigue to 0
  resetFatigue(){
    this.fatigue = 0;
  }

  // Method for modulate from a scale to another
  modulateFromTo(origin, destination){
    this.setScale(Tonal.Scale.get(destination).notes);
    this.currentBlock.modulateFromTo(origin, destination);
    this.previousBlock?.modulateFromTo(origin, destination);
    this.chorusBlock?.modulateFromTo(origin, destination);
  }

  // Method for storing current block as chorus block
  storeChorus(){
    this.chorusBlock = this.currentBlock;
  }
}
