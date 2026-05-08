class HabitoDecorator {
  constructor(habitoDecorado) {
    this.habitoDecorado = habitoDecorado;
    this.habito = habitoDecorado.habito;
  }

  render() {
    return this.habitoDecorado.render();
  }
}

export default HabitoDecorator;