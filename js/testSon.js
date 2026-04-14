// Testing script

let n, filter, sampler;
n=0;


function testSetup(){

// Function called by the Test button



}


function test(){
/*
const sampler = new Tone.Sampler({
  urls: {C3: "xylo_long.mp3"},
    baseUrl: "samples/xylo/",
  }).toDestination(); */

let note="C4";
let note_oct= Tonal.Note.octave(note);
let scale = Tonal.Scale.get('C4 minor').notes;
const isNote = (element) => element == note;
let index = scale.findIndex(isNote);
let note_modif1 = scale[(index+2)%scale.length];
let note_modif2 = scale[(index+4)%scale.length];




  switch (n){
    case 0 :
   //   sampler.triggerAttackRelease(note, "8n");
        console.log(note);
      break;
    case 1 :
   //   sampler.triggerAttackRelease(note_modif1, "8n");
      console.log(note_modif1);
      break;
    case 2 :
   //   sampler.triggerAttackRelease(note_modif2, "8n");
      console.log(note_modif2);
      break;
  }
  n = (n+1)%3;
}



