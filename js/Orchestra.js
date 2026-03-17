class Orchestra {
  constructor(){
    this.agents = []
    this.step = 0;
    this.loop = new Tone.Loop((time)=>this.playStep(time), "8n").start(0);
    this.blockSize = 4*8;
  }

  addAgent(agent){
    this.agents.push(agent);
    agent.setOrchestra(this);
    agent.createDebugBox();
    agent.updateDebugBox();

  }

  getLeader(){
    return this.agents.sort((agent)=>agent.aura)[0];
  }

  updateBlocks(){
    this.agents.sort((agent)=>agent.aura);
    this.agents.forEach(agent=>{
      agent.updateBlock();
    });
  }

  playStep(time){
    this.agents.forEach(agent=>{
      agent.playStep(this.step)
      agent.updateDebugBox();
    });
    this.step ++;
    if(this.step % this.blockSize == 0){
      this.updateBlocks();
    }
  }
}
