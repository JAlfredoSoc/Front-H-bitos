class HabitoBase {
  constructor(contenido, habito) {
    this.contenido = contenido;
    this.habito = habito;
  }

  render() {
    return this.contenido;
  }
}

export default HabitoBase;