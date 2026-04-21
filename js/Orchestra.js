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

    // init transport
    Tone.Transport.bpm.value = TEMPO;
    Tone.Transport.scheduleRepeat((time)=>this.playStep(time), "8n")
  }

  // Getter for agents On Stage
  get agentsOnStage(){
    return this.agents.filter(agent=>agent.onStage);
  }

  // Getter for blockProgress, from 0 to 1
  get blockProgress(){
    return (this.step%BLOCK_SIZE)/BLOCK_SIZE;
  }

  // Getter for blockStep, from 0 to block size
  get blockStep(){
    return (this.step%BLOCK_SIZE);
  }

  // Getter for blockCount
  get blockCount(){
    return Math.floor(this.step/BLOCK_SIZE);
  }

  // Getter for partStep, from 0 to part size
  get partStep(){
    return (this.step%PART_SIZE);
  }

  // Getter for leader name
  get leaderName(){
    return this.getLeader().name;
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

    let agentsByFatigue = this.agents.sort((agentA, agentB)=>agentB.fatigue - agentA.fatigue);
    let leastTiredAgentNotOnStage = this.agents.find(agent=>!agent.onStage);
    let mostTiredAgentOnStage = this.agents.find(agent=>agent.onStage);

    leastTiredAgentNotOnStage.enter();
    mostTiredAgentOnStage.leave();


  }

  // Method for updating to be call on each block end
  update(){
    // On each cycle
    if(this.step%CYCLE_SIZE==0){
      if(Math.random()<TURNOVER_PROBABILITY_EACH_CYCLES){
        this.turnover();
      }
    }

    this.updatedPart = randomChoice(["A","B","C"])

    this.agents.forEach(agent=>{
      agent.update();
    });

    // Normalise aura
    let aurasSum = this.agentsOnStage.reduce((acc, agent)=>acc+agent.aura,0);
    this.agentsOnStage.forEach(agent=>{agent.aura /= aurasSum});
    this.sortAgents();

    const newBlock = ()=>{
      this.agents.forEach(agent=>agent.updateBlock());
      this.lastEvent = `Update whole block for all agents`;
    }

    const newLeaderBlock = ()=>{
      this.getLeader().updateBlock();
      this.lastEvent = `Update whole block for the leader`;
    }

    const newPart = ()=>{
      let part = randomChoice(["A","B","C"]);
      this.agents.forEach(agent=>agent.updatePart(part));
      this.lastEvent = `Update part ${part} for all agents`;
    }

    const keepBlock = ()=>{
      this.lastEvent = `Keep Same block for all agents`;
    }

    const events = [
      {fun:newBlock, weight:NEW_BLOCK_PROBABILITY_EACH_BLOCK},
      {fun:newLeaderBlock, weight:NEW_LEADER_BLOCK_PROBABILITY_EACH_BLOCK},
      {fun:newPart, weight:NEW_PART_PROBABILITY_EACH_BLOCK},
      {fun:keepBlock, weight:KEEP_BLOCK_PROBABILITY_EACH_BLOCK},
    ];

    let event = selectFromWeightedArray(events, Math.random());
    event.fun();

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

  // Method for playing a step
  playStep(time){

    // Call playStep for each agent
    this.agentsOnStage.forEach(agent=>{
      agent.playStep(this.step, time)
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
