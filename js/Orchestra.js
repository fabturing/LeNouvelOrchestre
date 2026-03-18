class Orchestra {
  constructor(){
    this.name = "Le Nouvel Orchestre";
    this.agents = []
    this.step = 0;
    Tone.Transport.bpm.value = 120;
    Tone.Transport.scheduleRepeat((time)=>this.playStep(time), "8n")
    this.blockSize = 4*8;
    this.playing = false;
    this.debugBox = new DebugBox('orchestra-debug-box', this)
  }

  get blocProgress(){
    return (this.step%this.blockSize)/this.blockSize;
  }

  get leaderName(){
    return this.getLeader().name;
  }

  addAgent(agent){
    this.agents.push(agent);
    agent.setOrchestra(this);
    return agent;
  }

  sortAgents(){
    this.agents = this.agents.sort((agentA, agentB)=>agentB.aura - agentA.aura)
    return this.agents;
  }
  getLeader(){
    this.sortAgents();
    return this.agents[0];
  }

  updateBlocks(){
    this.sortAgents();
    this.agents.forEach(agent=>{
      agent.updateBlock();
    });
  }

  start(){
    this.playing = true;
    Tone.Transport.start();
    console.log("Play");
    this.updateDebugBox();
  }

  stop(){
    this.playing = false;
    Tone.Transport.stop();
    console.log("Stop");
    this.updateDebugBox();
    document.getElementById('dancer').src = 'sprites/iddle.png';

  }

  playStep(time){
    document.getElementById('dancer').src = 'sprites/dancing'+this.step%2+'.png'
    this.agents.forEach(agent=>{
      agent.playStep(this.step)
    });

    this.updateDebugBox();
    this.step ++;
    if(this.step % this.blockSize == 0){
      this.updateBlocks();
    }
  }

  initDebugBox(){
   this.debugBox.init();
   this.agents.forEach(agent=>{agent.initDebugBox()});
  }

  updateDebugBox(){
    this.debugBox.update();
    this.agents.forEach(agent=>{agent.updateDebugBox()});
  }
}
