// src/components/common/ModalInicioSesion.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { iniciarSesion } from '../../service/usuarioService'; // Ajusta la ruta según tu estructura

function ModalInicioSesion({ mostrar, cerrarModal, abrirModalRegistro }) {
  const navigate = useNavigate();

  const [datosFormulario, setDatosFormulario] = useState({
    correo: '',
    contrasena: ''
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: value
    });
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    // Llamar al servicio de inicio de sesión
    const resultado = await iniciarSesion(
      datosFormulario.correo,
      datosFormulario.contrasena
    );

    if (resultado.success) {
      // Guardar usuario en localStorage para mantener la sesión
      localStorage.setItem('usuario', JSON.stringify(resultado.data.usuario));
      
      console.log('Login exitoso:', resultado.data);
      
      // Cerrar modal
      cerrarModal();
      
      // Redirigir al panel principal
      navigate('/panel-principal');
    } else {
      // Mostrar mensaje de error
      setError(resultado.message);
    }

    setCargando(false);
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

        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}

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
              disabled={cargando}
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
              disabled={cargando}
            />
          </div>

          <div className="d-grid mb-3">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>

          <p className="text-center mb-0">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={irARegistro}
              disabled={cargando}
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