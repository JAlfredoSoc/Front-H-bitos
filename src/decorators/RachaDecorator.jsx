import HabitoDecorator from "./HabitoDecorator";

class RachaDecorator extends HabitoDecorator {
  render() {
    return (
      <>
        <div className="alert alert-info py-2 px-3 mb-2">
          ⚡ Racha actual: {this.habito?.rachaActual || 0} días
        </div>

        {super.render()}
      </>
    );
  }
}

export default RachaDecorator;