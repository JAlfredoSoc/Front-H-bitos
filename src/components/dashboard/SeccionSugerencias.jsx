// src/components/dashboard/SeccionSugerencias.jsx
import { useState, useEffect } from 'react';
import TarjetaSugerencia from './TarjetaSugerencia';
import { getObtenerSugerencias } from '../../../src/service/habitoService';
import { obtenerCategorias } from '../../service/categoriaService';

const CATEGORIAS_FIJAS = ['Salud', 'Ejercicio', 'Bienestar', 'Productividad', 'Estudio', 'Trabajo'];

const COLORES_CATEGORIA = {
  Salud:         { fondo: "#e7f1ff", texto: "#0d6efd", borde: "#0d6efd" },
  Ejercicio:     { fondo: "#e9f7ee", texto: "#1e7e34", borde: "#1e7e34" },
  Bienestar:     { fondo: "#f3e8ff", texto: "#6d28d9", borde: "#6d28d9" },
  Productividad: { fondo: "#fff8e1", texto: "#b45309", borde: "#f59e0b" },
  Estudio:       { fondo: "#ede9fe", texto: "#5b21b6", borde: "#5b21b6" },
  Trabajo:       { fondo: "#f1f5f9", texto: "#475569", borde: "#475569" },
};

function SeccionSugerencias({ habitosActuales, alSeleccionar }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    cargarSugerencias();
  }, []);

  const cargarSugerencias = async () => {
    setCargando(true);
    setError('');
    const resultado = await getObtenerSugerencias();
    if (resultado.success) {
      setSugerencias(resultado.data);
    } else {
      setError(resultado.message);
    }
    setCargando(false);
  };

  const sugerenciasDisponibles = sugerencias
    .filter((s) =>
      !habitosActuales?.some(
        (h) => h.nombre?.toLowerCase() === s.nombre?.toLowerCase()
      )
    )
    .filter((s) => {
      if (!categoriaSeleccionada) return true;
      const nombre = s.categoria?.nombreCategoria || s.categoria?.nombre || s.categoria || '';
      return nombre === categoriaSeleccionada;
    });

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

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setCategoriaSeleccionada('')}
          style={{
            border: !categoriaSeleccionada ? '1.5px solid #6d28d9' : '1.5px solid #ececf3',
            borderRadius: 999,
            padding: '6px 16px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: !categoriaSeleccionada ? '#f5f3ff' : '#fafafa',
            color: !categoriaSeleccionada ? '#6d28d9' : '#6b7280',
            transition: 'all 0.15s ease',
          }}
        >
          Todas
        </button>

        {CATEGORIAS_FIJAS.map((cat) => {
          const activo = categoriaSeleccionada === cat;
          const color = COLORES_CATEGORIA[cat] || { fondo: '#f3f4f6', texto: '#6b7280', borde: '#d1d5db' };
          return (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(activo ? '' : cat)}
              style={{
                border: activo ? `1.5px solid ${color.borde}` : '1.5px solid #ececf3',
                borderRadius: 999,
                padding: '6px 16px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activo ? color.fondo : '#fafafa',
                color: activo ? color.texto : '#6b7280',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

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