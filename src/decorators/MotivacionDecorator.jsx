import HabitoDecorator from "./HabitoDecorator";

class MotivacionDecorator extends HabitoDecorator {
  render() {
    return (
      <>
        {super.render()}

        <div
          className="alert alert-warning py-2 px-3 mb-3"
          style={{
            fontSize: "0.9rem",
            borderRadius: "12px",
          }}
        >
          💬 “La disciplina vence la motivación”
        </div>
      </>
    );
  }
}

export default MotivacionDecorator;