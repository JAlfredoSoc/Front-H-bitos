import HabitoDecorator from "./HabitoDecorator";

class MotivacionDecorator extends HabitoDecorator {
  render() {
    return (
      <>
        <div className="alert alert-warning py-2 px-3 mb-2">
          💬 Tú puedes lograr este hábito
        </div>

        {super.render()}
      </>
    );
  }
}

export default MotivacionDecorator;