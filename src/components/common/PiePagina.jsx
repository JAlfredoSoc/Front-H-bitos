function PiePagina() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold">Habits UP</h5>
            <p className="text-white-50">
              Impulsamos el desarrollo de hábitos positivos para mejorar la salud,
              la productividad y el bienestar personal.
            </p>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Contáctanos</h5>
            <p className="mb-1 text-white-50">Teléfono: +57 300 123 4567</p>
            <p className="mb-1 text-white-50">Correo: contacto@habitsup.com</p>
            <p className="mb-0 text-white-50">Valledupar, Colombia</p>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Redes sociales</h5>
            <p className="mb-1 text-white-50">Facebook: Habits UP</p>
            <p className="mb-1 text-white-50">Instagram: @habitsup</p>
            <p className="mb-1 text-white-50">X: @habitsup</p>
            <p className="mb-0 text-white-50">LinkedIn: Habits UP</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-white-50">
          <small>© 2026 Habits UP. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}

export default PiePagina;