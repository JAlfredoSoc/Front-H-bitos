function BarraNavegacion({ abrirModalInicio, abrirModalRegistro }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 px-4 py-3">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">
          Habits UP
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuNavegacion"
          aria-controls="menuNavegacion"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuNavegacion">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Acerca de
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Características
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-white text-decoration-none"
              onClick={abrirModalInicio}
            >
              Iniciar sesión
            </button>

            <button
              className="btn btn-primary rounded-3 px-4"
              onClick={abrirModalRegistro}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;