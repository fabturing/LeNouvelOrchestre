// This file define Orchestra.
// The role of the Orchestra is Agents coordination.

class Orchestra {
  constructor(){
    // Array of agents
    this.agents = [];
    // Current step goes from 0 to infinity
    this.step = 0;
    // Other attributes
    this.name = "Le Nouvel Orchestre";
    this.id = "orchestra"
    this.playing = false;
    this.debugBox = new DebugBox('orchestra-debug-box', this)

    this.scaleTonic = undefined;
    this.scaleMode = undefined;

    // init transport
    Tone.Transport.bpm.value = TEMPO;
    Tone.Transport.scheduleRepeat((time)=>this.onStep(time), "8n")
  }

  // Getter for agents On Stage
  get agentsOnStage(){
    return this.agents.filter(agent=>agent.onStage);
  }

  // Getter for blockProgress, from 0 to 1
  get blockProgress(){
    return (this.step%BLOCK_SIZE)/BLOCK_SIZE;
  }

    // Getter for cycleProgress, from 0 to 1
    get cycleProgress(){
      return (this.step%CYCLE_SIZE)/CYCLE_SIZE;
    }

  // Getter for blockStep, from 0 to block size
  get blockStep(){
    return (this.step%BLOCK_SIZE);
  }

  // Getter for blockCount
  get blockCount(){
    return Math.floor(this.step/BLOCK_SIZE);
  }

 // Getter for cycleCount
  get cycleCount(){
    return Math.floor(this.step/CYCLE_SIZE);
  }

  // Getter for partStep, from 0 to part size
  get partStep(){
    return (this.step%PART_SIZE);
  }

  // Getter for leader name
  get leaderName(){
    return this.getLeader().name;
  }

  setScale(tonic, mode){
    this.scaleTonic = Tonal.Note.simplify(tonic || this.scaleTonic);
    this.scaleMode = mode || this.scaleMode;
  }

  setRandomScale(){
    let chromaticRange = Tonal.Range.chromatic([LOWEST_TONIC, HIGHEST_TONIC])
    let tonic = randomChoice(chromaticRange);
    let mode = randomChoice(POSSIBLE_MODES);
    this.setScale(tonic, mode);
  }

  getScaleName(tonic, mode){
    return (tonic || this.scaleTonic) + ' ' + (mode || this.scaleMode);
  }

  modulate(degree, changeMode){
    const originScaleDegrees = Tonal.Scale.degrees(this.getScaleName());
    let newTonic = originScaleDegrees(degree);
    // If newTonic too high or too low, go in the other direction
    if(Tonal.Interval.distance(LOWEST_TONIC, newTonic).startsWith('-')
    || Tonal.Interval.distance(newTonic, HIGHEST_TONIC).startsWith('-')){
      newTonic = originScaleDegrees(-degree);
    }

    let newMode = this.scaleMode;
    while(changeMode && newMode == this.scaleMode){
      newMode = randomChoice(POSSIBLE_MODES);
    }
    let newScaleName = this.getScaleName(newTonic, newMode);
    this.agents.forEach(agent=>agent.modulateFromTo(this.getScaleName(), newScaleName));
    this.setScale(newTonic, newMode);
  }


  // Method for adding an agent to the orchestra
  addAgent(agent){
    this.agents.push(agent);
    agent.setOrchestra(this);

    return agent;
  }

  // Method for sorting agents by aura
  sortAgents(){
    this.agents = this.agents.sort((agentA, agentB)=>agentB.aura - agentA.aura)
    return this.agents;
  }

  // Method for getting the current leader
  getLeader(){
    this.sortAgents();
    return this.agentsOnStage[0];
  }

    // Method for  initializating Orchestra
  init(){

    this.setRandomScale();

    let agentsByFatigue = this.agents.sort((agentA, agentB)=>agentB.fatigue - agentA.fatigue);
    agentsByFatigue.forEach(agent=>agent.onStage = false);
    agentsByFatigue.slice(-3).forEach(agent=>agent.onStage = true);


    this.agents.forEach(agent=>{
      agent.init();
    });

    this.sortAgents();

    this.agents.forEach(agent=>{
      agent.updateBlock();
    });


    this.update();
    this.initDebugBox();

  }

  // load all agent instruments
  async loadInstruments(){
    for(let i = 0; i<orchestra.agents.length; i++){
      await orchestra.agents[i].loadInstrument();
    }
  }

  // Change onstage agents
  turnover(){

    let leastTiredAgentNotOnStage, mostTiredAgentOnStage;

    let agentsByFatigue = this.agents.sort((agentA, agentB)=>agentB.fatigue - agentA.fatigue);

    leastTiredAgentNotOnStage = this.agents.find(agent=>!agent.onStage);
    leastTiredAgentNotOnStage?.enter();

    if(this.agents.filter(agent=>agent.onStage).length > 1){
      mostTiredAgentOnStage = this.agents.find(agent=>agent.onStage);
      mostTiredAgentOnStage?.leave();

    }

    return {
      leaving:mostTiredAgentOnStage?[mostTiredAgentOnStage]:[],
      entering:leastTiredAgentNotOnStage?[leastTiredAgentNotOnStage]:[]
      }
  }

  doBlockEvent(){
    const newBlock = ()=>{
      this.agents.forEach(agent=>agent.updateBlock());
      return `Update whole block for all agents`;
    }

    const newLeaderBlock = ()=>{
      this.getLeader().updateBlock();
      return `Update whole block for the leader`;
    }

    const newPart = ()=>{
      let partName = randomChoice(["A","B","C"]);
      this.agents.forEach(agent=>agent.updatePart(partName));
      return `Update part ${partName} for all agents`;
    }

    const tonicModulation = ()=>{
      let originScale = this.getScaleName();
      let degree = randomChoice([-3, +3, -5, +5]);
      this.modulate(degree, false);
      return `Modulate from ${originScale} to ${this.getScaleName()} (${(degree<0?"":"+") + degree})`;
    }
    const modeModulation = ()=>{
      let originScale = this.getScaleName();
      this.modulate(0, true);
      return `Modulate from ${originScale} to ${this.getScaleName()}`;
    }

    const doNothing = ()=>{
      return `Do nothing`;
    }

    const events = [
      {fun:modeModulation, weight:MODE_MODULATION_PROBABILITY_EACH_BLOCK},
      {fun:tonicModulation, weight:TONIC_MODULATION_PROBABILITY_EACH_BLOCK},
      {fun:newBlock, weight:NEW_BLOCK_PROBABILITY_EACH_BLOCK},
      {fun:newLeaderBlock, weight:NEW_LEADER_BLOCK_PROBABILITY_EACH_BLOCK},
      {fun:newPart, weight:NEW_PART_PROBABILITY_EACH_BLOCK},
      {fun:doNothing, weight:DO_NOTHING_PROBABILITY_EACH_BLOCK},
    ];

    let event = selectFromWeightedArray(events, Math.random());
    this.lastBlockEvent = event.fun();
  }

  doCycleEvent(){
    const turnover = ()=>{
      let changements = this.turnover();
      const generateMessage = (key) => `${(changements[key].length > 0) ? changements[key].map(a=>a.name).join(', ') : 'nobody'} ${(changements[key].length>1)? 'are' : 'is'} ${key}`;
      return `Turnover (${generateMessage('leaving')} ; ${generateMessage('entering')})`;
    }
    const storeChorus = ()=>{
      this.agents.forEach(agent=>agent.storeChorus());
      return `Store a new chorus`;
    }
    const playChorus = ()=>{
      if(this.agents.some(agent=>!agent.chorusBlock)){
        return `Can't play the chorus because some agent does not have stored a chorus yet ; ` + storeChorus();
      }
      this.playingChorus = true;
      return `Play the chorus`;
    }
    const doNothing = ()=>{
      return `Do nothing`;
    }

    const events = [
      {fun:turnover, weight:TURNOVER_PROBABILITY_EACH_CYCLES},
      {fun:storeChorus, weight:STORE_CHORUS_PROBABILITY_EACH_CYCLES},
      {fun:playChorus, weight:PLAY_CHORUS_PROBABILITY_EACH_CYCLE},
      {fun:doNothing, weight:DO_NOTHING_PROBABILITY_EACH_CYCLE},
    ];

    let event = selectFromWeightedArray(events, Math.random());
    this.lastCycleEvent = event.fun();
  }


  // Method for updating to be call on each block end
  update(){
    // On each cycle
    this.playingChorus = false;

    if(this.step%CYCLE_SIZE==0){
      this.doCycleEvent()
    }

    this.agents.forEach(agent=>{
      agent.update();
    });

    // Normalise aura
    let aurasSum = this.agentsOnStage.reduce((acc, agent)=>acc+agent.aura,0);
    this.agentsOnStage.forEach(agent=>{agent.aura /= aurasSum});
    this.sortAgents();

    this.doBlockEvent();

  }

  // Start the music
  start(){
    this.playing = true;
    Tone.Transport.start();
    this.updateDebugBox();
  }

  // Pause the music
  pause(){
    this.playing = false;
    Tone.Transport.stop();

    // Debug
    this.updateDebugBox();
  }

  // Method for going to next Block
  nextBlock(){
    let remainingSteps = BLOCK_SIZE - this.blockStep;
    this.step += remainingSteps;
    this.update();
    this.updateDebugBox();
  }

  // Method for finding bugs
  next1000Blocks(){
    for(let i=0; i<1000; i++) this.nextBlock();
  }
  // Method for playing a step
  onStep(time){

    // Call playStep for each agent
    this.agentsOnStage.forEach(agent=>{
      agent.onStep(this.step, time)
    });

    // Debug
    this.updateDebugBox();

    // Increment step count
    this.step ++;

    // At the  end of the block, update.
    if(this.step % BLOCK_SIZE == 0){
      this.update();
    }

  }

  // Debug Methods
  initDebugBox(){
   this.debugBox.init();
   this.agents.forEach(agent=>{agent.debugBox.init()});
  }
  updateDebugBox(){
    this.debugBox.update();
    this.agents.forEach(agent=>{agent.debugBox.update()});
  }
}
