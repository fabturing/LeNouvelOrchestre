document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;
let bool = 0;

function main(){
  document.getElementById('test').addEventListener("click", test);
  document.getElementById('play').addEventListener("click", play);

  orchestra = new Orchestra();
  orchestra.addAgent(new Jief());
  orchestra.addAgent(new Liza());
  orchestra.addAgent(new Crocodus());
  orchestra.updateBlocks();
}

function play(){
switch (bool){
  case 0 : Tone.Transport.start();console.log("Play"); break;
  case 1 : Tone.Transport.stop();console.log("Stop"); break;
  }
  bool = (bool+1)%2;  
}

