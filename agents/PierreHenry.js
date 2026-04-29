// This file define PierreHenry class


class PierreHenry extends MelodicAgent {
  constructor(){
    super("Pierre-Henry", "Squelette qui joue du xylophone (parce que c'est ce que les squelettes font)", "pierrehenry");
    this.anim = new Anim('pierrehenry', true);
    this.handAnimaitonCount = 0;
    this.anim.setFrameChooser(()=>{
      if(this.moodIs('quinte') || this.moodIs('tierce') || this.moodIs('quinte/tierce')) {
        return 'gauche-droite'
      }
      this.handAnimaitonCount ++;
      let hands = ['gauche','droite'];
      return hands[this.handAnimaitonCount%2];
    })

    this.ignoreLeaderBlockInfluence = true;
    this.ignorePreviousBlockInfluence = true;

// moods
    this.addMood('quinte_arp', 30);
    this.addMood('quinte', 10);
    this.addMood('quinte/tierce', 15);
    this.addMood('tierce', 10);
    this.addMood('tierce_arp', 30);
  }

  async loadInstrument(){
    const samples = {C3: "xylo_long.mp3"}
    await this.loadSampler(samples, "samples/xylo/");
    this.setPan(PAN_XYLO);
    this.setVolume(VOL_XYLO)
  }


  playNote(note, time){
    let agents = this.orchestra.agentsOnStage;
  // Le premier agent de la catégorie bass
  let bassAgent = agents.find(agent=>agent.category=='bass');
  // Si il existe ET qu'il est en train de jouer une note
  if(bassAgent && bassAgent.playingNote.main){
    // Récupérer sa note
    note = bassAgent.playingNote.main;
   }



   const isNote = (element) => element == note;
   let index = this.scale.findIndex(isNote);
   let quinte, tierce;
   let octave = Tonal.Note.transpose(note, "8P");
    if (index > -1) {
    quinte = this.scale[(index+4)%this.scale.length];
     tierce = this.scale[(index+2)%this.scale.length];
    }
    else{
      quinte = Tonal.Note.transpose(note, "5P");
     tierce = octave;
     }



    if(this.moodIs('quinte')){

      let delayedTime = time + Math.random()/50;
      this.instrument.triggerAttackRelease(note, "4n", time);
      this.instrument.triggerAttackRelease(quinte , "4n", delayedTime);
    }

   else if(this.moodIs('tierce')){

      let delayedTime = time + Math.random()/50;
      this.instrument.triggerAttackRelease(note, "4n", time);
      this.instrument.triggerAttackRelease(tierce , "4n", delayedTime);
    }

    else if(this.moodIs('quinte/tierce')){

      let delayedTime = time + Math.random()/50;
      this.instrument.triggerAttackRelease(note, "4n", time);
      let random = Math.random();
      if(random < 0.5){
        this.instrument.triggerAttackRelease(tierce , "4n", delayedTime);
      }
      else {this.instrument.triggerAttackRelease(quinte, "4n", delayedTime);}

    }

    else if(this.moodIs('quinte_arp')){
      let random = Math.random();
      let stepTime1 = time + Tone.Time("8n").toSeconds();
      let stepTime2 = time + 2*Tone.Time("8n").toSeconds();
      let stepTime3 = time + 3*Tone.Time("8n").toSeconds();

      this.instrument.triggerAttackRelease(note, "8n", stepTime1);
      if(random < 0.2){
        this.instrument.triggerAttackRelease(octave, "8n", stepTime2);
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime3);
      }
      else if(random < 0.4){
        this.instrument.triggerAttackRelease(octave, "8n", stepTime2);
        this.instrument.triggerAttackRelease(note, "8n", stepTime3);
      }
      else{
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime2);
        this.instrument.triggerAttackRelease(octave, "8n", stepTime3);
      }
      this.anim.animate(stepTime1);
      this.anim.animate(stepTime2);
      this.anim.animate(stepTime3);
    }

    else if(this.moodIs('tierce_arp')){
      let random = Math.random();
      let stepTime1 = time + Tone.Time("8n").toSeconds();
      let stepTime2 = time + 2*Tone.Time("8n").toSeconds();
      let stepTime3 = time + 3*Tone.Time("8n").toSeconds();
      this.instrument.triggerAttackRelease(note, "8n", stepTime1);
      this.anim.animate(stepTime1);
      if(random < 0.2){
        this.instrument.triggerAttackRelease(tierce, "8n", stepTime2);
        this.instrument.triggerAttackRelease(note, "8n", stepTime3);
      }
      else if(random < 0.4){
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime2);
        this.instrument.triggerAttackRelease(tierce, "8n", stepTime3);
      }
      else{
        this.instrument.triggerAttackRelease(tierce, "8n", stepTime2);
        this.instrument.triggerAttackRelease(quinte, "8n", stepTime3);
      }

    this.anim.animate(stepTime2);
    this.anim.animate(stepTime3);
}

  }

  generateStructure(){
    return ['A','B','A','B'];
  }

  generatePattern(){
    let pattern ;
    if(this.moodIs('quinte') || this.moodIs('tierce') || this.moodIs('quinte/tierce')) { pattern = [90, 5, 10, 25, 80, 10, 20, 20];}
    else if(this.moodIs('quinte_arp') || this.moodIs('tierce_arp')){ pattern = [80, 0, 0, 0, 80, 0, 0, 0];}
    return pattern;
  }



}



