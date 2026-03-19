// Main script file

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;

// Main function
function main(){
  // Init buttons
  document.getElementById('test').addEventListener("click", test);
  document.getElementById('play').addEventListener("click", play);

  // Init Orchestra
  orchestra = new Orchestra();
  let jief = orchestra.addAgent(new Jief());
  let liza = orchestra.addAgent(new Liza());
  let crocodus = orchestra.addAgent(new Crocodus());
  jief.aura = 0.9;
  orchestra.updateBlocks();
  orchestra.initDebugBox();
}

// Function triggered by the play button
function play(){
  switch (orchestra.playing){
    case false : orchestra.start(); break;
    case true : orchestra.pause(); break;
  }
}

