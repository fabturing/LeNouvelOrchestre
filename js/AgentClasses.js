class MelodicAgent extends Agent {
  constructor(name, description, id, lines) {
    super(name, description, id, lines);
    this.category = 'melodic';
  }
}

class PercAgent extends Agent {
  constructor(name, description, id, lines) {
    super(name, description, id, lines);
    this.category = 'perc';
  }
}

class BassAgent extends Agent {
  constructor(name, description, id, lines) {
    super(name, description, id, lines);
    this.category = 'bass';
  }
}
