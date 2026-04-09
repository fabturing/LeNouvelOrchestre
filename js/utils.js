
// Return a random element of an array
function randomChoice (arr){
  return arr[Math.floor(arr.length * Math.random())];
}

// Return percent value
function percent(n){
  return n/100;
}

// Return the value passed. But if its a number, round to second decimal.
function roundIfNumber(n){
  if(!isNaN(n)) return Math.round(n*100)/100;
  return n;
}

// Return a DOM object for representing a multilines information
// `object` is the multinine object
// `func` is the function to be called on each line to represent it
// `func` must return a DOM object
// `func` is optional
function debugMultiLines(object, func){
  let container = document.createElement('table');
  container.classList.add('debug-multi-lines');
  for(let line in object){
    let row = document.createElement('tr');
    let lineElement = document.createElement('td');
    if(func) lineElement.appendChild(func(object[line]));
    else lineElement.innerHTML = roundIfNumber(object[line]);
    let headerElement = document.createElement('th');
    headerElement.innerHTML = line

    row.appendChild(headerElement);
    row.appendChild(lineElement);
    container.appendChild(row);
  }
  return container;
}

// Return a DOM object that represent a sequence
// index is for marking the  current element in the sequence. Keep undefined if no current element.
function debugSequence(array, index){
  let container = document.createElement('div');
  container.classList.add('debug-sequence');
  array.forEach((step, i)=>{
    let stepElement = document.createElement('div');
    stepElement.classList.add('step');
    if(index === i) stepElement.classList.add('current');
    if(!step) stepElement.classList.add('empty');
    step = roundIfNumber(step);
    stepElement.innerHTML = step;
    container.appendChild(stepElement);
  })
  return container;
}


// Create a button and add it in the buttons div
function newButton(name, onClick){
    const template = document.getElementById('button-template');
    const element = template.content.firstElementChild.cloneNode(true);
    element.addEventListener('click', onClick);
    element.querySelector('img').src = 'sprites/'+name+'-button.png'
    const conainer = document.getElementById('buttons');
    conainer.appendChild(element);
}
