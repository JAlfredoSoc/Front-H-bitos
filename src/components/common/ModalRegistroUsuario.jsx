import { useState } from 'react';

function ModalRegistroUsuario({ mostrar, cerrarModal }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    edad: '',
    telefono: ''
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: value
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log('Datos de registro:', datosFormulario);
    cerrarModal();
  };

  if (!mostrar) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1050
      }}
    >
      <div
        className="bg-white rounded-4 shadow p-4 position-relative"
        style={{ width: '100%', maxWidth: '460px' }}
      >
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={cerrarModal}
          aria-label="Cerrar"
        ></button>

        <div className="text-center mb-4 mt-2">
          <h2 className="fw-bold">Registrarse</h2>
          <p className="text-muted mb-0">Crea tu cuenta para comenzar</p>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su nombre"
              value={datosFormulario.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              placeholder="Ingrese su correo"
              value={datosFormulario.correo}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="contrasena"
              name="contrasena"
              placeholder="Ingrese su contraseña"
              value={datosFormulario.contrasena}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="edad" className="form-label">
              Edad
            </label>
            <input
              type="number"
              className="form-control"
              id="edad"
              name="edad"
              placeholder="Ingrese su edad"
              value={datosFormulario.edad}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="text"
              className="form-control"
              id="telefono"
              name="telefono"
              placeholder="Ingrese su teléfono"
              value={datosFormulario.telefono}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalRegistroUsuario;