// Testing script

let n, filter, sampler;

function testSetup(){
  n = 0;
  filter = new Tone.Filter(1000, "lowpass").toDestination();
  sampler = new Tone.Sampler({
      urls: {
          C3: "C3.mp3", //kick
          C4: "C4.mp3", //snare
          C5: "C5.mp3", //hihat
      },
      baseUrl: "samples/drum/",
      }).toDestination();
}


// Function called by the Test button
function test(){
  switch (n){
    case 0 :
      sampler.triggerAttackRelease(["C3"], "8n");
      break;
    case 1 :
      sampler.triggerAttackRelease(["D3"], "8n");
      break;
    case 2 :
      sampler.triggerAttackRelease(["A4"], "8n");
      break;
    case 3 :
      sampler.triggerAttackRelease(["B4"], "8n");
      break;
  }
  console.log('Test case:', n);
  n = (n+1)%4;
}



