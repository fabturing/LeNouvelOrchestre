let n = 0;
let m = 0;

flutio = new Tone.Sampler({
      urls: {
          C3: "C3.mp3",
      },
      baseUrl: "samples/flute/",
      }).toDestination();

      drum = new Tone.Sampler({
      urls: {
          C3: "C3.mp3",
          C4: "C4.mp3",
          C5: "C5.mp3",

      },
      baseUrl: "samples/drum/",
      }).toDestination();

function test(){

switch (n){
  case 0 : flutio.triggerAttackRelease(["C4"], "2n"); console.log(n); break;
  case 1 : flutio.triggerAttackRelease(["C4"], "8n"); console.log(n); break;
  case 2 : flutio.triggerAttackRelease(["C4"], "16n"); console.log(n); break;
  case 3 : flutio.triggerAttackRelease(["C4"], "8n"); console.log(n); break;
  }
  n = (n+1)%4;
}



