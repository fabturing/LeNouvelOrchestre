document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;

function main(){
  document.getElementById('test-son').addEventListener("click", testSon);
  document.getElementById('play').addEventListener("click", play);
  document.getElementById('stop').addEventListener("click", stop);

  orchestra = new Orchestra();
  orchestra.addAgent(new Flutist())
}

function play(){
  Tone.Transport.start();
}

function stop(){
  Tone.Transport.stop();
}
