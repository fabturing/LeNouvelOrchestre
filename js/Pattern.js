// This file define the Pattern class.
// A Pattern is a set of instruction made to generate part lines
// The pattern class is a wrapper for an Array called steps.
// Each step in this array is a WeightedArray that gives the possible values for the given step.

class Pattern {
  constructor(steps){
    this.steps = steps || Array(PART_SIZE).fill(new WeightedArray())
  }

  // Static Method that create a new Pattern from an Array of pecentages.
  // This pattern will generates 1s and 0s for each steps based to thoses pecentages
  static newFromPercents(percentsArray){
    return new Pattern(percentsArray.map((percent)=>{
      return WeightedArray.from([{value:1, weight:percent}, {value:0, weight:100-percent}])
    }));
  }

  // Static Method that create a new Pattern from a single step.
  // The step should be a WeightedArray and will be repeated across each step of the Pattern
  static newFromRepeatedStep(weightedArray){
    let steps = Array.from(Array(PART_SIZE), (_)=>WeightedArray.from(weightedArray));
    return new Pattern(steps);
  }

  // Static Method that create a new Pattern from a single value.
  // The value will be wrapped in a WeightedArray and will be repeated across each step of the Pattern
  static newFromRepeatedValue(value){
    return this.newFromRepeatedStep(WeightedArray.newFromSingleValue(value));
  }

  // Static Method that create a new Pattern from an array of single values
  // each value will be wrapped in a WeightedArray and attributed to the corresponding step of the Pattern
  static newFromSingleValues(valuesArray){
    return new Pattern(valuesArray.map((value)=>{
      return WeightedArray.newFromSingleValue(value);
    }));
  }

  // Static Method that create a new Pattern by merging every pattern in a given Array of pattern
  static mergePatterns(patterns){
    let steps = Array.from(Array(PART_SIZE), (_,i)=>{
      let stepsToMerge = patterns.map(pattern=>pattern.steps[i]);
      return WeightedArray.merge(stepsToMerge);
    });
    return new Pattern(steps);
  }

  // Static Method that create a new Pattern by merging every pattern in a given WeightedArray of pattern
  static mergePatternsWeightedArray(patternsWeightedArray){
    let steps = Array.from(Array(PART_SIZE), (_,i)=>{
      let weightedStepsToMerge = patternsWeightedArray.map(x=>{
        return {value:x.value.steps[i], weight:x.weight};
      });
      return WeightedArray.weightedMerge(weightedStepsToMerge);
    });
    return new Pattern(steps);
  }

  // Method for generating an array.
  generate(){
    return this.steps.map((step)=>step.pick())
  }
}

