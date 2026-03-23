// src/components/common/ModalRegistroUsuario.jsx
import { useState } from 'react';
import { registrarUsuario } from '../../service/usuarioService';

function ModalRegistroUsuario({ mostrar, cerrarModal, abrirModalInicioSesion }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    edad: '',
    telefono: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: value
    });
    // Limpiar errores cuando el usuario escribe
    if (error) setError('');
    if (exito) setExito('');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setExito('');

    // Validar edad (opcional)
    if (parseInt(datosFormulario.edad) < 18) {
      setError('Debes ser mayor de 18 años para registrarte');
      setCargando(false);
      return;
    }

    // Llamar al servicio de registro
    const resultado = await registrarUsuario(
      datosFormulario.nombre,
      datosFormulario.correo,
      datosFormulario.contrasena,
      datosFormulario.edad,
      datosFormulario.telefono
    );

    if (resultado.success) {
      // Registro exitoso
      setExito('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      console.log('Usuario registrado:', resultado.data);
      
      // Limpiar formulario
      setDatosFormulario({
        nombre: '',
        correo: '',
        contrasena: '',
        edad: '',
        telefono: ''
      });
      
      // Cerrar modal de registro y abrir modal de inicio de sesión después de 2 segundos
      setTimeout(() => {
        cerrarModal();
        if (abrirModalInicioSesion) {
          abrirModalInicioSesion();
        }
      }, 2000);
    } else {
      // Mostrar mensaje de error
      setError(resultado.message);
    }

    setCargando(false);
  };

  const irAInicioSesion = () => {
    cerrarModal();
    if (abrirModalInicioSesion) {
      abrirModalInicioSesion();
    }
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
        style={{ width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={cerrarModal}
          aria-label="Cerrar"
          disabled={cargando}
        ></button>

        <div className="text-center mb-4 mt-2">
          <h2 className="fw-bold">Registrarse</h2>
          <p className="text-muted mb-0">Crea tu cuenta para comenzar</p>
        </div>

        {/* Mensaje de éxito */}
        {exito && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {exito}
            <button
              type="button"
              className="btn-close"
              onClick={() => setExito('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Mensaje de error */}
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
            <label htmlFor="nombre" className="form-label">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su nombre completo"
              value={datosFormulario.nombre}
              onChange={manejarCambio}
              required
              disabled={cargando}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo electrónico <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              placeholder="Ingrese su correo electrónico"
              value={datosFormulario.correo}
              onChange={manejarCambio}
              required
              disabled={cargando}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">
              Contraseña <span className="text-danger">*</span>
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
              disabled={cargando}
              minLength="6"
            />
            <small className="text-muted">Mínimo 6 caracteres</small>
          </div>

          <div className="mb-3">
            <label htmlFor="edad" className="form-label">
              Edad <span className="text-danger">*</span>
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
              disabled={cargando}
              min="1"
              max="120"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="telefono" className="form-label">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              id="telefono"
              name="telefono"
              placeholder="Ingrese su número de teléfono"
              value={datosFormulario.telefono}
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
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>

          <p className="text-center mb-0">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={irAInicioSesion}
              disabled={cargando}
            >
              Iniciar sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ModalRegistroUsuario;