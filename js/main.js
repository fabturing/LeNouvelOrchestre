// Main script file

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;
let jief, liza, crocodus;

// Main function
function main(){
  // Init buttons
  document.getElementById('test').addEventListener("click", test);
  document.getElementById('play').addEventListener("click", play);

  // Init Orchestra
  orchestra = new Orchestra();
  jief = orchestra.addAgent(new Jief());
  liza = orchestra.addAgent(new Liza());
  crocodus = orchestra.addAgent(new Crocodus());
  jief.aura = 0.9;
  orchestra.init();

}

// Function triggered by the play button
function play(){
  switch (orchestra.playing){
    case false : orchestra.start(); break;
    case true : orchestra.pause(); break;
  }
}

