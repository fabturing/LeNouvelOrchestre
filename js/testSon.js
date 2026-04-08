// Testing script

let n = 0;

let filter = new Tone.Filter(1000, "lowpass").toDestination();


let flutio = new Tone.Sampler({
    urls: {
        C3: "C3.mp3", //kick
        C4: "C4.mp3", //snare
        C5: "C5.mp3", //hihat
    },
    baseUrl: "samples/drum/",
    }).toDestination();

// Function called by the Test button
function test(){
  switch (n){
    case 0 :
      flutio.triggerAttackRelease(["C3"], "8n");
      console.log(n);
      break;
    case 1 :
      flutio.triggerAttackRelease(["D3"], "8n");
      console.log(n);
      break;
    case 2 :
      flutio.triggerAttackRelease(["A4"], "8n");
      console.log(n);
      break;
    case 3 :
      flutio.triggerAttackRelease(["B4"], "8n");
      console.log(n);
      break;
  }
  n = (n+1)%4;
}



