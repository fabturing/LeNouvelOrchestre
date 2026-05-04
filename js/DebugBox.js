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

    // Create button
    newButton(this.object.id,()=>this.open());
    // Create the DOM element from the template and add it to the pagge
    const template = document.getElementById(this.templateId);
    this.element = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(this.element);

    // toggleOpen
    this.element.querySelector('thead').addEventListener('click', ()=>{
      this.element.classList.toggle('closed')
    });

    // Init [data-method] elements
    this.element.querySelectorAll('[data-method]').forEach(el=>{
      let method = el.dataset.method;
      el.addEventListener('click', ()=>{
        this.object[method]()
        this.update();
      });
    });
    // Init [data-check] elements
    this.element.querySelectorAll('[data-check]').forEach(el=>{
      let attribute = el.dataset.check;
      el.addEventListener('click', ()=>{
        let value = el.checked;
        this.object[attribute] = value;
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
      value = roundIfNumber(value);
      el.innerHTML = '';
      if(value && typeof value == 'object') el.appendChild(debugMultiLines(value));
      else el.innerHTML = value;
    });

    // Update [data-attribute-boolean] elements
    this.element.querySelectorAll('[data-attribute-boolean]').forEach(el=>{
      let attribute = el.dataset.attributeBoolean;
      let value = this.object[attribute];
      el.innerHTML = '';
      el.appendChild(debugBoolean(value));
    });

    // Update [data-progress] elements
    this.element.querySelectorAll('[data-progress]').forEach(el=>{
      let attribute = el.dataset.progress;
      let value = this.object[attribute];
      el.value = value;
    });

    // Update [data-check] elements
    this.element.querySelectorAll('[data-check]').forEach(el=>{
      let attribute = el.dataset.check;
      let value = this.object[attribute];
      el.checked = value;
    });
  }

  open(){
    this.element.classList.remove('closed')
    this.element.scrollIntoView();
  }
}
