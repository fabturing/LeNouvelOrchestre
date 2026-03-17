function testSample(){
  sampler = new Tone.Sampler({
      urls: {
          A1: "A2.mp3",
          A2: "A3.mp3",
      },
      baseUrl: "samples/bassoon/",
      onload: () => {
          sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], "8n");
      }
  }).toDestination();
}

function testSynth(){
  //create a synth and connect it to the main output (your speakers)
  const synth = new Tone.Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C4", "8n");
}

function testSon(){
  testSample();
}
