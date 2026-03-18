let n = 0;
let m = 0;

 filter = new Tone.Filter(1000, "lowpass").toDestination();


   flutio = new Tone.Sampler({
      urls: {
          C3: "C3.mp3",
      },
      baseUrl: "samples/flute/",
      }).connect(filter);


function test(){

      
switch (n){
  case 0 : flutio.triggerAttackRelease(["C4"], "2n"); console.log(n); break;
  case 1 : flutio.triggerAttackRelease(["C4"], "8n"); console.log(n); break;
  case 2 : flutio.triggerAttackRelease(["C4"], "16n"); console.log(n); break;
  case 3 : flutio.triggerAttackRelease(["C4"], "8n"); console.log(n); break;
  }
  n = (n+1)%4;
}



