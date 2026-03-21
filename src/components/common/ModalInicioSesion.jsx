import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ModalInicioSesion({ mostrar, cerrarModal, abrirModalRegistro }) {
  const navigate = useNavigate();

  const [datosFormulario, setDatosFormulario] = useState({
    correo: '',
    contrasena: ''
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
    console.log('Datos de inicio de sesión:', datosFormulario);
    cerrarModal();
    navigate('/panel-principal');
  };

  const irARegistro = () => {
    cerrarModal();
    abrirModalRegistro();
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
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={cerrarModal}
          aria-label="Cerrar"
        ></button>

        <div className="text-center mb-4 mt-2">
          <h2 className="fw-bold">Iniciar sesión</h2>
          <p className="text-muted mb-0">Ingresa a tu cuenta para continuar</p>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              placeholder="tua@ejemplo.com"
              value={datosFormulario.correo}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="contrasena"
              name="contrasena"
              value={datosFormulario.contrasena}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>
          </div>

          <p className="text-center mb-0">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={irARegistro}
            >
              Regístrate
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ModalInicioSesion;