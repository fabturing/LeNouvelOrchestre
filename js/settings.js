/*****************************************************************************/
/*********************** GENERAL SETTINGS ************************************/
/*****************************************************************************/

const DEV_MODE = false;
const VERSION = "0.2";


/*****************************************************************************/
/*********************** MIXAGE SETTINGS *************************************/
/*****************************************************************************/

//TODO: mettre le nom des agents plutot que le nom des instruments dans les constantes en prévision de quand plusieurs agents joueront du meme instru
// TODO: choisir le pan dynamiquement en fonction des agents qui sont sur scène pour éviter les situations où tout le monde est pané du meme côté.

// Jief joue de la FLUTE
let VOL_FLUTE = -9; //Volume en dB, max 0
const PAN_FLUTE = -0.25; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.

//Liza joue des DRUM
let VOL_DRUM = -7;
const PAN_DRUM = 0;

//Crocodus joue de la BASSE
let VOL_BASSE = -15;
const PAN_BASSE = 0;

// Pierre-Henry joue du XYLO
let VOL_XYLO = -8; //Volume en dB, max 0
const PAN_XYLO = 0.65; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.

// Tonton Flop joue comme il peut
let VOL_TONTON = -9; //Volume en dB, max 0
const PAN_TONTON= 0; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.

// Josephine joue de l'orgue
let VOL_JOSEPHINE = -35; //Volume en dB, max 0
const PAN_JOSEPHINE= 0; //The pan : 0 = Middle, -1 = hard left, 1 = hard right.


//Normaliser volumes
let maxvol = Math.abs(Math.max(VOL_FLUTE, VOL_DRUM, VOL_BASSE), VOL_JOSEPHINE, VOL_XYLO, VOL_TONTON);
VOL_FLUTE = VOL_FLUTE + maxvol;
VOL_DRUM = VOL_DRUM + maxvol;
VOL_BASSE = VOL_BASSE + maxvol;
VOL_JOSEPHINE = VOL_JOSEPHINE + maxvol;
VOL_XYLO = VOL_XYLO + maxvol;
VOL_TONTON = VOL_TONTON + maxvol;


/*****************************************************************************/
/*********************** AGENT SETTINGS **************************************/
/*****************************************************************************/

const MOOD_SPEED = 0.05;
const FATIGUE_FROM_PLAYING = 0.01; // By block (randomised)
const FATIGUE_FROM_RESTING = -0.01; // By block (randomised)
const FATIGUE_FROM_QUITTING_STAGE = 0.5; // By block (randomised)
const FATIGUE_FROM_ENTERING_STAGE = -0.5; // By block (randomised)
const RYTHMIC_ANIM_FRAME_DURATION = '24n';

/*****************************************************************************/
/*********************** ORCHESTRA SETTINGS **********************************/
/*****************************************************************************/

const TEMPO = 120; //bpm

const LOWEST_TONIC = "G3";
const HIGHEST_TONIC = "G4";
const POSSIBLE_MODES = ["major", "minor"]

const PART_SIZE = 8; //steps
const PARTS_PER_BLOCK = 4; //parts
const BLOCKS_PER_CYCLE = 4; //blocks
const BLOCK_SIZE = PART_SIZE*PARTS_PER_BLOCK; //steps
const CYCLE_SIZE = BLOCK_SIZE*BLOCKS_PER_CYCLE; //steps

// Cycle event probabilities
const TURNOVER_PROBABILITY_EACH_CYCLES = 20;
const STORE_CHORUS_PROBABILITY_EACH_CYCLES = 5;
const PLAY_CHORUS_PROBABILITY_EACH_CYCLE = 40;
const DO_NOTHING_PROBABILITY_EACH_CYCLE = 35;

// Block event probabilities
const MODULATION_PROBABILITY_EACH_BLOCK = 8;
const NEW_BLOCK_PROBABILITY_EACH_BLOCK = 10;
const NEW_LEADER_BLOCK_PROBABILITY_EACH_BLOCK = 20;
const NEW_PART_PROBABILITY_EACH_BLOCK = 40;
const DO_NOTHING_PROBABILITY_EACH_BLOCK = 20;

