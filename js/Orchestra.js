// This file define Orchestra.
// The role of the Orchestra is Agents coordination.

// Settings
const TEMPO = 120; //bpm
const PART_SIZE = 8; //steps
const PARTS_PER_BLOCK = 4; //parts
const BLOCK_SIZE = PART_SIZE*PARTS_PER_BLOCK; //steps
const NAME = "Le Nouvel Orchestre";

class Orchestra {
  constructor(){
    // Array of agents
    this.agents = [];
    // Current step goes from 0 to infinity
    this.step = 0;
    // Other attributes
    this.name = NAME;
    this.playing = false;
    this.debugBox = new DebugBox('orchestra-debug-box', this)

    // init transport
    Tone.Transport.bpm.value = TEMPO;
    Tone.Transport.scheduleRepeat((time)=>this.playStep(time), "8n")
  }

  // Getter for blockProgress, from 0 to 1
  get blockProgress(){
    return (this.step%BLOCK_SIZE)/BLOCK_SIZE;
  }

  // Getter for blockStep, from 0 to block size
  get blockStep(){
    return (this.step%BLOCK_SIZE);
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
    return this.agents[0];
  }

    // Method for  initializating Orchestra
  init(){
    this.sortAgents();
    this.agents.forEach(agent=>{
      agent.init();
    });
    this.update();
    this.initDebugBox();
  }

  // Method for updating to be call on each block end
  update(){
    this.updatedPart = randomChoice(["A","B","C"])
    this.agents.forEach(agent=>{
      agent.update();
    });

    // Normalise aura
    let aurasSum = this.agents.reduce((acc, agent)=>acc+agent.aura,0);
    this.agents.forEach(agent=>{agent.aura /= aurasSum});

    this.sortAgents();
    this.agents.forEach(agent=>{
      agent.updatePart(this.updatedPart);
    });
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
    this.agents.forEach(agent=>{
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
