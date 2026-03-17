document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

let orchesta;

function main(){
  document.getElementById('test').addEventListener("click", testSon);
  document.getElementById('play').addEventListener("click", play);
  document.getElementById('stop').addEventListener("click", stop);

  orchestra = new Orchestra();
  orchestra.addAgent(new Jief());
  orchestra.addAgent(new Liza());
  orchestra.addAgent(new Crocodus());
}

function play(){
  Tone.Transport.start();
}

function stop(){
  Tone.Transport.stop();

}
