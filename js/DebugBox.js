// This file define the DebugBox class.
// A DebugBox is a tool for getting live informations about Objects.

class DebugBox {
  constructor(templateId, object){
    // Id of a <template> element on the project page
    this.templateId = templateId
    // Object represented by the DebugBox
    this.object = object;
    // DOM element
    this.element;
  }

  // Initialize a Debug Box.
  init(){

    // Create the DOM element from the template and add it to the pagge
    const template = document.getElementById(this.templateId);
    this.element = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(this.element);

    // Init [data-method] elements
    this.element.querySelectorAll('[data-method]').forEach(el=>{
      let method = el.dataset.method;
      el.addEventListener('click', ()=>{
        this.object[method]()
        this.update();
      });
    });

    this.update();
  }

  // Update DebugBox Informations
  update(){
    // Update [data-attribute] elements
    this.element.querySelectorAll('[data-attribute]').forEach(el=>{
      let attribute = el.dataset.attribute;
      let value = this.object[attribute];
      el.innerHTML = value;
    });

    // Update [data-progress] elements
    this.element.querySelectorAll('[data-progress]').forEach(el=>{
      let attribute = el.dataset.progress;
      let value = this.object[attribute];
      el.value = value;
    });
  }
}
