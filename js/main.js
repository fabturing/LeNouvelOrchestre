document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;

function main(){
  document.getElementById('test-son').addEventListener("click", testSon);
  document.getElementById('test-drum').addEventListener("click", testDrum);
  document.getElementById('play').addEventListener("click", play);
  document.getElementById('stop').addEventListener("click", stop);

  orchestra = new Orchestra();
  orchestra.addAgent(new Flutist());
  orchestra.addAgent(new Drummer());
}

function play(){
  Tone.Transport.start();
}

function stop(){
  Tone.Transport.stop();

}
