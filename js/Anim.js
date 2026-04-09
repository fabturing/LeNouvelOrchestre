class Anim {
  constructor(fileName, isRythmic){
    this.fileName = fileName;
    this.isRythmic = isRythmic;
    this.element;
    this.currentFrame;
  }

  init(){
    this.element = document.createElement('img');
    this.element.classList.add('anim');
    document.getElementById('anims').appendChild(this.element);
    this.setImage(0);
  }

  setImage(frame){
    this.currentFrame = frame;
    this.element.src = 'sprites/'+this.fileName+frame+'.png';
  }

  setVisibility(visible){
    if(visible){
      this.element.style.display = 'block';
    } else{
      this.element.style.display = 'none';
    }
  }
  animate(time){
    let frame = (this.currentFrame + 1) % 2
    Tone.Draw.schedule(()=>{this.setImage(frame)},time);
    if(this.isRythmic){
      let delay = Tone.Time('16n');
      Tone.Draw.schedule(()=>{this.setImage(0)},time+delay);
    }
  }
}
