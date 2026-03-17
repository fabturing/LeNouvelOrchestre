let n = 0;
let m = 0;

flute = new Tone.Sampler({
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

function testSample(){

switch (n){
  case 0 : flute.triggerAttackRelease(["C4"], "2n"); console.log(n); break;
  case 1 : flute.triggerAttackRelease(["C4"], "8n"); console.log(n); break;
  case 2 : flute.triggerAttackRelease(["C4"], "16n"); console.log(n); break;
  case 3 : flute.triggerAttackRelease(["C4"], "8n"); console.log(n); break;
  }
  n = (n+1)%4;
}

function testBeat(){

switch (m){
  case 0 : drum.triggerAttackRelease(["C3"], "8n"); console.log(m); break;
  case 1 : drum.triggerAttackRelease(["C4"], "8n"); console.log(m); break;
  case 2 : drum.triggerAttackRelease(["C5"], "8n"); console.log(m); break;
  }
  m = (m+1)%3;
}




function testSon(){
  testSample();
}

function testDrum(){
  testBeat();
}


