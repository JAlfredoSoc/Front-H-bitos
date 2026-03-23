import { useEffect, useState } from 'react';
import { FiEdit2, FiCheck } from 'react-icons/fi';

function ModalPerfil({ mostrar, cerrarModal }) {
  const datosIniciales = {
    nombre: 'Usuario',
    correo: 'usuario@example.com',
    edad: '',
    telefono: '',
    contrasena: ''
  };

  const [datosPerfil, setDatosPerfil] = useState(datosIniciales);
  const [respaldoDatos, setRespaldoDatos] = useState(datosIniciales);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (mostrar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mostrar]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosPerfil({
      ...datosPerfil,
      [name]: value
    });
  };

  const activarEdicion = () => {
    setRespaldoDatos({ ...datosPerfil });
    setModoEdicion(true);
  };

  const manejarGuardar = (e) => {
    e.preventDefault();
    console.log('Datos del perfil guardados:', datosPerfil);
    setRespaldoDatos({ ...datosPerfil });
    setModoEdicion(false);
  };

  const manejarCancelar = () => {
    setDatosPerfil({ ...respaldoDatos });
    setModoEdicion(false);
  };

  const manejarCerrar = () => {
    setDatosPerfil({ ...respaldoDatos });
    setModoEdicion(false);
    cerrarModal();
  };

  if (!mostrar) return null;

  return (
    <div
      onClick={manejarCerrar}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 99999
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18)',
          position: 'relative',
          zIndex: 100000
        }}
      >
        <div
          className="px-5 pt-5 pb-3"
          style={{
            background:
              'linear-gradient(180deg, rgba(109, 40, 217, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px'
          }}
        >
          <div className="text-center">
            <div
              className="mx-auto d-flex align-items-center justify-content-center mb-4"
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                borderRadius: '50%',
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(109, 40, 217, 0.25)',
                border: '4px solid white'
              }}
            >
              {datosPerfil.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <h4 className="fw-bold mb-1 text-morado">Mi Perfil</h4>
            <p className="text-muted mb-0 small">Gestiona tu información personal</p>
          </div>

          <button
            type="button"
            onClick={manejarCerrar}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              border: 'none',
              background: 'transparent',
              fontSize: '34px',
              lineHeight: '1',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4">
          <form onSubmit={manejarGuardar}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-4"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  value={datosPerfil.nombre}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-lg rounded-4"
                  name="correo"
                  placeholder="Ingrese su correo"
                  value={datosPerfil.correo}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Edad</label>
                <input
                  type="number"
                  className="form-control form-control-lg rounded-4"
                  name="edad"
                  placeholder="Edad"
                  value={datosPerfil.edad}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-4"
                  name="telefono"
                  placeholder="Teléfono"
                  value={datosPerfil.telefono}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-4"
                  name="contrasena"
                  placeholder="Ingrese su contraseña"
                  value={datosPerfil.contrasena}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              {!modoEdicion ? (
                <>
                  <button
                    type="button"
                    className="btn btn-light px-4 py-2 rounded-4"
                    onClick={manejarCerrar}
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2 rounded-4 d-flex align-items-center gap-2"
                    onClick={activarEdicion}
                  >
                    <FiEdit2 size={18} />
                    Editar Perfil
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-light px-4 py-2 rounded-4"
                    onClick={manejarCancelar}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-4 d-flex align-items-center gap-2"
                  >
                    <FiCheck size={18} />
                    Guardar Cambios
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalPerfil;
