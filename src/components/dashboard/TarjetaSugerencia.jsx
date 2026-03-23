import {
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiPlus
} from 'react-icons/fi';

function obtenerClaseCategoria(categoria) {
  const clases = {
    Salud: 'categoria-salud',
    Bienestar: 'categoria-bienestar',
    Estudio: 'categoria-estudio',
    Productividad: 'categoria-productividad',
    Trabajo: 'categoria-trabajo',
    Relaciones: 'categoria-relaciones'
  };

  return clases[categoria] || 'categoria-general';
}

function TarjetaSugerencia({ sugerencia, alSeleccionar }) {
  const claseCategoria = obtenerClaseCategoria(sugerencia.categoria);

  return (
    <div className={`card tarjeta-habito tarjeta-habito-color ${claseCategoria} h-100`}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className={`etiqueta-categoria ${claseCategoria}`}>
            {sugerencia.categoria}
          </span>
          <small className="text-muted">{sugerencia.fechaCreacion}</small>
        </div>

        <h5 className="fw-bold mb-2">{sugerencia.nombre}</h5>
        <p className="text-muted mb-3">{sugerencia.descripcion}</p>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Hora</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiClock />
                <span>{sugerencia.horario || 'Sin hora'}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Racha</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiTrendingUp />
                <span>{sugerencia.racha}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Inicio</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiCalendar />
                <span>{sugerencia.fechaInicio || 'No definida'}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Fin</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiCalendar />
                <span>{sugerencia.fechaFin || 'No definida'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <small className="text-muted">Progreso</small>
          <small className="fw-semibold">{sugerencia.progreso}%</small>
        </div>

        <div className="progress progreso-personalizado mb-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${sugerencia.progreso}%` }}
            aria-valuenow={sugerencia.progreso}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <div className="mt-auto">
          <button
            className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 px-4 w-100"
            onClick={() => alSeleccionar(sugerencia)}
          >
            <FiPlus />
            <span>Seleccionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaSugerencia;
