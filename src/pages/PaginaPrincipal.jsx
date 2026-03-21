import { useState } from 'react';
import BarraNavegacion from '../components/common/BarraNavegacion';
import ModalInicioSesion from '../components/common/ModalInicioSesion';
import ModalRegistroUsuario from '../components/common/ModalRegistroUsuario';
import SeccionInformativa from '../components/common/SeccionInformativa';
import PiePagina from '../components/common/PiePagina';

function PaginaPrincipal() {
  const [mostrarModalInicio, setMostrarModalInicio] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  const abrirModalInicio = () => {
    setMostrarModalRegistro(false);
    setMostrarModalInicio(true);
  };

  const cerrarModalInicio = () => {
    setMostrarModalInicio(false);
  };

  const abrirModalRegistro = () => {
    setMostrarModalInicio(false);
    setMostrarModalRegistro(true);
  };

  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
  };

  return (
    <>
      <div
        className="min-vh-100 d-flex flex-column"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <BarraNavegacion
          abrirModalInicio={abrirModalInicio}
          abrirModalRegistro={abrirModalRegistro}
        />

        <div className="container flex-grow-1 d-flex justify-content-center align-items-center text-center">
          <div className="text-white" style={{ maxWidth: '850px' }}>
            <h1 className="display-2 fw-bold fst-italic">Mejora tus hábitos</h1>

            <p className="fs-4 mt-4">
              Desarrolla hábitos positivos y alcanza tus metas con Habits UP
            </p>

            <p className="fs-5 mt-3">
              Embárcate en un viaje transformador hacia una vida más saludable con
              nuestra aplicación. Construye, sigue y celebra hábitos que mejoren
              tu bienestar día a día, convirtiendo pequeños cambios en grandes logros.
            </p>

            <button
              className="btn btn-primary px-4 py-2 mt-4"
              onClick={abrirModalInicio}
            >
              Comienza ahora
            </button>
          </div>
        </div>

        <ModalInicioSesion
          mostrar={mostrarModalInicio}
          cerrarModal={cerrarModalInicio}
          abrirModalRegistro={abrirModalRegistro}
        />

        <ModalRegistroUsuario
          mostrar={mostrarModalRegistro}
          cerrarModal={cerrarModalRegistro}
        />
      </div>

      <SeccionInformativa />
      <PiePagina />
    </>
  );
}

export default PaginaPrincipal;