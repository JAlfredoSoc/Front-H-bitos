class HabitoDecorator {
  constructor(habitoComponent) {
    this.habitoComponent = habitoComponent;

    // 🔥 IMPORTANTE
    this.habito = habitoComponent.habito;
  }

  render() {
    return this.habitoComponent.render();
  }
}

export default HabitoDecorator;