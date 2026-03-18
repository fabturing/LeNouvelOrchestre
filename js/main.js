document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;
let bool = 0;

function main(){
  document.getElementById('test').addEventListener("click", test);
  document.getElementById('play').addEventListener("click", play);

  orchestra = new Orchestra();
  let jief = orchestra.addAgent(new Jief());
  let liza = orchestra.addAgent(new Liza());
  let crocodus = orchestra.addAgent(new Crocodus());
  jief.aura = 0.9;
  orchestra.updateBlocks();
  orchestra.initDebugBox();
}

function play(){
switch (bool){
  case 0 : orchestra.start(); break;
  case 1 : orchestra.stop(); break;
  }
  bool = (bool+1)%2;  
}

