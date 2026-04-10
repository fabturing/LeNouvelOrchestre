// Main script file

document.addEventListener("DOMContentLoaded", function(event) {
    main();
    document.getElementById('load').addEventListener('click', main)
});

let orchesta;
let jief, liza, crocodus, pierrehenry;

// Main function
function main(){

  //Init Perlin noise
  noise.seed(Math.random());

  // Init buttons
  newButton('test', test);
  newButton('play', play, );

  // Init Orchestra
  orchestra = new Orchestra();

  jief = orchestra.addAgent(new Jief());
  liza = orchestra.addAgent(new Liza());
  crocodus = orchestra.addAgent(new Crocodus());
  pierrehenry = orchestra.addAgent(new PierreHenry());

  orchestra.init();


}

// Function triggered by the play button
function play(){
  switch (orchestra.playing){
    case false : orchestra.start(); break;
    case true : orchestra.pause(); break;
  }
}

