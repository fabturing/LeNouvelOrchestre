class Orchestra {
  constructor(){
    this.agents = []
    this.step = 0;
    this.loop = new Tone.Loop((time)=>this.playStep(time), "8n").start(0);
  }

  addAgent(agent){
    this.agents.push(agent);
    agent.createDebugBox();
    agent.updateDebugBox();
  }

  playStep(time){
    this.agents.forEach(agent=>{
      agent.playStep(this.step)
      agent.updateDebugBox();
    });
    this.step ++;
  }
}
