import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // 1. Importamos el navegador
import BarraNavegacion from '../components/common/BarraNavegacion';
import ModalInicioSesion from '../components/common/ModalInicioSesion';
import ModalRegistroUsuario from '../components/common/ModalRegistroUsuario';
import SeccionInformativa from '../components/common/SeccionInformativa';
import PiePagina from '../components/common/PiePagina';

function PaginaPrincipal() {
  const navigate = useNavigate();
  const [mostrarModalInicio, setMostrarModalInicio] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  // BYPASS TEMPORAL - Redirige si ya hay sesión activa
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) navigate('/panel-principal');
  }, [navigate]);

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

  // 3. Función especial para saltar el login (Bypass)
  const entrarDirecto = () => {
    console.warn("Entrando en modo desarrollo: Saltando validación");
    navigate('/home'); // <-- CAMBIA '/home' por la ruta de la vista que quieres arreglar
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

            {/* 4. Modificamos el botón para que ejecute 'entrarDirecto' */}
            <button
              className="btn btn-primary px-4 py-2 mt-4"
              onClick={entrarDirecto} 
            >
              Comienza ahora 
            </button>
          </div>
        </div>

        {/* 5. Dejamos los modales por si necesitas probar su diseño, 
            pero el botón de arriba ya no depende de ellos */}
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