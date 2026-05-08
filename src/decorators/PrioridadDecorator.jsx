import HabitoDecorator from "./HabitoDecorator";

class PrioridadDecorator extends HabitoDecorator {
  render() {
    return (
      <>
        <div className="mb-2">
          <span className="badge bg-danger">
            🔥 Prioridad Alta
          </span>
        </div>
        {super.render()}
      </>
    );
  }
}

export default PrioridadDecorator;