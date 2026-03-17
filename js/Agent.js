class Agent {
  constructor(name) {
    this.name = name;
  }
  
  createDebugBox(){
    const template = document.getElementByID('agent-debug-box')
    this.debugBox = const clone = document.importNode(template.content, true);
    document.body.appendChild(this.debugBox);
  }
  
  updateDebugBox(){
    this.debugBox.getElementB
  }
}
