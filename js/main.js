// Main script file
document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('stage').addEventListener('click', main)
});

let orchesta;

// Agents global variables
let jief;
let liza;
let crocodus;
let pierrehenry;
let tontonflop;
let josephine;

// Main function
async function main(){

  await Tone.start();
  logLogo(VERSION);

  // Setup stage
  document.getElementById('stage').removeEventListener('click', main);
  document.getElementById('stage').classList.remove('preload');

  // Init test
  testSetup();

  //Init Perlin noise
  noise.seed(Math.random());

  // Init buttons
  if(DEV_MODE) newButton('test', test);
  newButton('play', play, );

  // Init Orchestra
  orchestra = new Orchestra();

  // Agents declarations
  jief = orchestra.addAgent(new Jief());
  liza = orchestra.addAgent(new Liza());
  crocodus = orchestra.addAgent(new Crocodus());
  pierrehenry = orchestra.addAgent(new PierreHenry());
  tontonflop = orchestra.addAgent(new TontonFlop());
  josephine = orchestra.addAgent(new Josephine());

  await orchestra.loadInstruments();
  orchestra.init();
  orchestra.start();


}

// Function triggered by the play button
function play(){
  switch (orchestra.playing){
    case false : orchestra.start(); break;
    case true : orchestra.pause(); break;
  }
}

