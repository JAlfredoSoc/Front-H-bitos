// src/components/dashboard/SeccionSugerencias.jsx
import { useState, useEffect } from 'react';
import TarjetaSugerencia from './TarjetaSugerencia';
import { getObtenerSugerencias } from '../../../src/service/habitoService';

function SeccionSugerencias({ habitosActuales, alSeleccionar }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarSugerencias();
  }, []);

  const cargarSugerencias = async () => {
    setCargando(true);
    setError('');
    
    const resultado = await getObtenerSugerencias();
    
    if (resultado.success) {
      console.log('Sugerencias cargadas:', resultado.data); // Para debug
      setSugerencias(resultado.data);
    } else {
      setError(resultado.message);
    }
    
    setCargando(false);
  };

  // Filtrar sugerencias que no estén ya en hábitos actuales
  const sugerenciasDisponibles = sugerencias.filter(
    (sugerencia) =>
      !habitosActuales?.some(
        (habito) => habito.nombre?.toLowerCase() === sugerencia.nombre?.toLowerCase()
      )
  );

  if (cargando) {
    return (
      <main className="p-4 p-lg-5">
        <section className="tarjeta-sugerencias p-4 p-lg-5 mb-4">
          <h2 className="fw-bold mb-2 text-white">Sugerencias para ti</h2>
          <p className="mb-0 text-white opacity-75">
            Explora nuevos hábitos recomendados y agrega los que mejor se adapten a tu rutina diaria.
          </p>
        </section>
        
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando sugerencias...</span>
          </div>
          <p className="mt-3 text-muted">Cargando sugerencias para ti...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 p-lg-5">
        <section className="tarjeta-sugerencias p-4 p-lg-5 mb-4">
          <h2 className="fw-bold mb-2 text-white">Sugerencias para ti</h2>
          <p className="mb-0 text-white opacity-75">
            Explora nuevos hábitos recomendados y agrega los que mejor se adapten a tu rutina diaria.
          </p>
        </section>
        
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            className="btn btn-link" 
            onClick={cargarSugerencias}
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 p-lg-5">
      <section className="tarjeta-sugerencias p-4 p-lg-5 mb-4">
        <h2 className="fw-bold mb-2 text-white">Sugerencias para ti</h2>
        <p className="mb-0 text-white opacity-75">
          Explora nuevos hábitos recomendados y agrega los que mejor se adapten a tu rutina diaria.
        </p>
      </section>

      <section>
        {sugerenciasDisponibles.length > 0 ? (
          <>
            <div className="seccion-titulo mb-4">
              <div>
                <h3 className="fw-bold mb-1">Hábitos recomendados</h3>
                <p className="text-muted mb-0">
                  Total de sugerencias disponibles: {sugerenciasDisponibles.length}
                </p>
              </div>
            </div>

            <div className="row g-4">
              {sugerenciasDisponibles.map((sugerencia) => (
                <div className="col-12 col-md-6 col-xl-4" key={sugerencia._id || sugerencia.id}>
                  <TarjetaSugerencia
                    sugerencia={sugerencia}
                    alSeleccionar={alSeleccionar}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '20px'
                }}
              >
                <span style={{ fontSize: '40px' }}>🎉</span>
              </div>
            </div>
            <h4 className="fw-bold mb-2">¡Excelente trabajo!</h4>
            <p className="text-muted mb-0">
              Ya tienes todos nuestros hábitos sugeridos en tu lista.
              <br />
              Continúa con tu rutina y sigue construyendo mejores hábitos.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default SeccionSugerencias;