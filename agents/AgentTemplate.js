/*******************************************************************************
POUR CRÉER UN NOUVEL AGENT C'EST TRÈS SIMPLE:
1. COPIER CE FICHIER DANS /agents/ AVEC LE NOM DE LA CLASS SUIVI DE L'EXTENSION .js
2. DANS LE FICHIER CRÉÉ : MODIFIER AU MINIMUM LES LIGNES MARQUÉES D'UN ✏️
3. DANS index.html : AJOUTER UNE LIGNE APRÈS <!-- Agents classes -->
4. DANS js/main.js : AJOUTER UNE LIGNE APRÈS // Agents global variables
5. DANS js/main.js : AJOUTER UNE LIGNE APRÈS // Agents declarations
6. DANS LE FICHIER CRÉÉ : SUPPRIMER CE COMMENTAIRE AINSI QUE TOUS LES COMMENTAIRES ✏️
*******************************************************************************/

// This file define NomAgent class //✏️


class NomAgent extends Agent { //✏️ Le nom de la classe doit être le nom de l'agent en en PascalCase
				//✏️ Remplacer `extends Agent` par `extends MelodicAgent` ou PercAgent ou BassAgent
  constructor(){
    super("Nom de l'Agent", //✏️ Le nom qui s'affiche
    "Description agent", //✏️ Description de l'agent qui s'affiche'
    "nomagent"); //✏️ L'identifiant de l'agent (nom de l'agent en lowercase)
    this.anim = new Anim('default', true);

  // moods
    this.addMood('moodA', 50);
    this.addMood('moodB', 50);
  }

  async loadInstrument(){
    const samples = {C3: "nom_du_sample_C3.mp3"} //✏️
    await this.loadSampler(samples, "samples/dossier_des_samples/"); //✏️

    this.setPan(PAN_AGENT); //✏️ Définir une constante spécifique dans js/settings.js
    this.setVolume(VOL_AGENT); //✏️ Définir une constante spécifique dans js/settings.js
  }
  
  generateStructure(){
    return ['A','B','C','B'];
  }

  generateNotesPattern(){
	  return Pattern.newFromRepeatedUniform(this.scale);
  }

  generatePlaysPattern(){
    let pattern = [100, 0, 100, 0, 100, 0, 100, 0];
	return Pattern.newFromPercents(pattern);
  }
  
  generatePart(partName, line){
	let part = super.generatePart(partName, line);
	return part;
  }
}


