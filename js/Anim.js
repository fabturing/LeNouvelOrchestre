class Anim {
  constructor(fileName, isRythmic){
    this.fileName = fileName;
    this.isRythmic = isRythmic;
    this.element;
    this.currentFrame;
    this.frameChooser = ()=>{
      let frame = (this.currentFrame + 1) % 2;
      if(isNaN(frame)) return 1;
      return frame;
    };
  }

  setFrameChooser(fun){
    this.frameChooser = fun;
  }

  init(){
    this.element = document.createElement('img');
    this.element.classList.add('anim');
    document.getElementById('anims').appendChild(this.element);
    this.setImage(0);
  }

  setImage(frame){
    this.currentFrame = frame;
    this.element.src = `sprites/${this.fileName}-${frame}.png`;
  }

  setVisibility(visible){
    if(visible){
      this.element.style.display = 'block';
    } else{
      this.element.style.display = 'none';
    }
  }
  animate(time){
    Tone.Draw.schedule(()=>{
		let frame = this.frameChooser();
		this.setImage(frame)
		},time);
    if(this.isRythmic){
      let delay = Tone.Time(RYTHMIC_ANIM_FRAME_DURATION);
      Tone.Draw.schedule(()=>{this.setImage('idle')},time+delay);
    }
  }
}
