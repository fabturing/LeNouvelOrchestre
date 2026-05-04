// This file define PierreHenry class


class PierreHenry extends MelodicAgent {
  constructor(){
    super("Pierre-Henry", "Squelette qui joue du xylophone (parce que c'est ce que les squelettes font)", "pierrehenry");
    this.anim = new Anim('pierrehenry', true);
    this.handAnimaitonCount = 0;
    this.anim.setFrameChooser(()=>{
		/*
      if(this.moodIs('quinte') || this.moodIs('tierce') || this.moodIs('quinte/tierce')) {
        return 'gauche-droite'
      }*/
      if(this.playingLinesNotes.main.size>1){
		 return 'gauche-droite';
	  }
      this.handAnimaitonCount ++;
      let hands = ['gauche','droite'];
      return hands[this.handAnimaitonCount%2];
    })

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



  generateStructure(){
    return ['A','B','A','B'];
  }

  generateNotesPattern(){
	  return Pattern.newFromRepeatedUniform(this.scale);
  }

  generatePlaysPattern(){
    let pattern ;
    if(this.moodIs('quinte') || this.moodIs('tierce') || this.moodIs('quinte/tierce')) {
	  pattern = [90, 5, 10, 25, 80, 10, 20, 20];
	}
    else if(this.moodIs('quinte_arp') || this.moodIs('tierce_arp')){
	  pattern = [80, 0, 0, 0, 80, 0, 0, 0];
	}
	return Pattern.newFromPercents(pattern);
  }
  
  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	
	  // Le premier agent de la catégorie bass dont l'aura est plus grande
	  let bassAgent = this.orchestra.agentsOnStage.find(agent=>agent.category=='bass' && agent.aura > this.aura);
	  let bassAgentPattern = bassAgent?.generateInfluencePatterns(partName);
	  // S'il existe et qu'il a des notes à proposer 
	  if(bassAgentPattern?.notes){
		// Récupérer ses notes
		part.setAttributeFromPattern('notes', bassAgentPattern.notes)
	  }

	
	if(this.moodIs('quinte')){
	  part.setAttributeFromSingleValue('choords', [1, 5]);
    }
	else if(this.moodIs('tierce')){
	  part.setAttributeFromSingleValue('choords', [1, 3]);
	}
    else if(this.moodIs('quinte/tierce')){
	  let choordsPattern = Pattern.newFromRepeatedStep([
		{weight:50, value:[1,3]},
		{weight:50, value:[1,5]}
	  ]);
	  part.setAttributeFromPattern('choords', choordsPattern);
    }
    else if(this.moodIs('quinte_arp') || this.moodIs('tierce_arp')){
	  let arpeggios = new WeightedArray();
	  if(this.moodIs('quinte_arp')){
		arpeggios.push(
		  {weight:20, value:[[1],[1],[8],[5]]},
		  {weight:20, value:[[1],[1],[8],[1]]},
		  {weight:60, value:[[1],[1],[5],[8]]},
		);
	  }
	  else if(this.moodIs('tierce_arp')){
		arpeggios.push(
		  {weight:20, value:[[1],[1],[3],[1]]},
		  {weight:20, value:[[1],[1],[5],[3]]},
		  {weight:60, value:[[1],[1],[3],[5]]},
	    );
	  }
	  part.setAttribute('choords', arpeggios.pick().concat(arpeggios.pick()));
	  part.setAttribute('plays', [0,1,1,1,0,1,1,1]);
	  let note1 = part.getStep(0).note;
	  let note2 = part.getStep(4).note;
	  part.setAttribute('notes', [note1, note1, note1, note1, note2, note2, note2, note2]);
    }


	return part;
  }
  
  
  playInstrument(note, duration, time, velocite, line){
	velocite = velocite - Math.random()/3
	time = time + Math.random()/50;
	super.playInstrument(note, duration, time, velocite, line)
  }
}



