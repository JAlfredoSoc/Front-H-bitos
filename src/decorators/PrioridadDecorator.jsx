import HabitoDecorator from "./HabitoDecorator";

class PrioridadDecorator extends HabitoDecorator {
  render() {
    return (
      <>
        {super.render()}

        <div className="mb-2">
          <span className="badge bg-danger">
            🔥 Prioridad Alta
          </span>
        </div>
      </>
    );
  }
}

export default PrioridadDecorator;