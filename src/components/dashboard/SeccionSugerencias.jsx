import TarjetaSugerencia from './TarjetaSugerencia';

function SeccionSugerencias({ sugerencias, habitosActuales, alSeleccionar }) {
  // Filtrar sugerencias que no ya estén en hábitos actuales
  const sugerenciasDisponibles = sugerencias.filter(
    (sugerencia) =>
      !habitosActuales.some(
        (habito) => habito.nombre.toLowerCase() === sugerencia.nombre.toLowerCase()
      )
  );

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
                <div className="col-12 col-md-6 col-xl-4" key={sugerencia.id}>
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
