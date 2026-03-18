
class DebugBox {
  constructor(templateId, object){
    this.templateId = templateId
    this.object = object;
    this.element;
  }


  init(){
    const template = document.getElementById(this.templateId);
    this.element = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(this.element);

    this.element.querySelectorAll('[data-method]').forEach(el=>{
      let method = el.dataset.method;
      el.addEventListener('click', ()=>{
        this.object[method]()
        this.update();
      });
    });

    this.update();
  }

  update(){
    this.element.querySelectorAll('[data-attribute]').forEach(el=>{
      let attribute = el.dataset.attribute;
      let value = this.object[attribute];
      el.innerHTML = value;
    });
    this.element.querySelectorAll('[data-progress]').forEach(el=>{
      let attribute = el.dataset.progress;
      let value = this.object[attribute];
      el.value = value;
    });
  }
}
