// This file define the WeightedArray class.
// A WeightedArray is an Array in which each item has a value and a weight.

class WeightedArray extends Array{

  // Static method that takes an Array and returns a new WeightedArray by giving a weight of 1 to each item of the original array
  static newUniformFromArray(array){
    return WeightedArray.from(array, v=>{return {value:v, weight:1}});
  }

  // Static method that takes a value and returns a new WeightedArray where the only item has this value and a weight of 1
  static newFromSingleValue(value){
    return WeightedArray.from([{value:value, weight:1}]);
  }

  // Static method that take an array of WeightedArray and return a new WeightedArray by merging every of its WeightedArrays
  static merge(weightedArraysToMerge){
    //let weightedArraysToMerge = Array.from(arguments);
    let result = new WeightedArray();
    weightedArraysToMerge.forEach(weightedArray=>{
      result = result.concat(weightedArray.normalizeWeights());
    });
    return result.simplify();
  }

  // Static method that take a 2D WeightedArray (i.e. a WeightedArray of WeightedArray) and return a new WeightedArray.
  // Each WeightedArray has their weights scaled by its weight in the 2D WeightedArray.
  // Then a new WeightedArray is returned by merging every of those scaled WeightedArrays.
  static weightedMerge(WeightedArray2D){
    let result = new WeightedArray();
    WeightedArray2D.forEach(x=>{
      let weightedArray = x.value;
      weightedArray = weightedArray.normalizeWeights();
      weightedArray = weightedArray.map(y=>{return{value:y.value, weight:y.weight*x.weight}});
      result = result.concat(weightedArray);
    });
    return result.simplify();
  }

  // Method add a new item with given weight and value.
  add(weight,value){
    this.push({weight:weight,value:value});
  }

  // Method that takes an index between 0 and 1 and returns the corresponding value.
  select(index){
    let normalized = this.normalizeWeights();
    let count = 0;
    for(let i = 0; i < normalized.length; i++){
      count += normalized[i].weight;
      if(count>index) return normalized[i].value;
    }
  }

  // Method that returns a random value
  pick(){
    return this.select(Math.random());
  }

  // Method that return a new WeightedArray where the total sum of weights equals to 1
  normalizeWeights(){
    let totalWeight = this.reduce((a,el)=>a+el.weight,0);
    return this.map(x=>{
      return {value:x.value, weight:x.weight/totalWeight};
    })
  }

  // Method that return a new WeigthedArray where duplicate itemps has been merged
  simplify(){
    const equals = (a,b) => a == b;
    let result = new WeightedArray();
    for(let i = 0 ; i < this.length ; i++){
      let index = result.findIndex((x)=>equals(x.value, this[i].value));
      if(index >= 0){
        result[index].weight+=this[i].weight;
      }
      else {
        result.push({value:this[i].value, weight:this[i].weight});
      }
    }
    return result;
  }

}
