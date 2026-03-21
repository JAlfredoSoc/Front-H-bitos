import { FiCheckCircle, FiEdit2, FiTrash2, FiEye, FiClock, FiTrendingUp } from 'react-icons/fi';

function TarjetaHabito({ habito }) {
  return (
    <div className="card tarjeta-habito h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="etiqueta-categoria">{habito.categoria}</span>
          <small className="text-muted">{habito.fechaCreacion}</small>
        </div>

        <h5 className="fw-bold mb-2 text-morado">{habito.nombre}</h5>
        <p className="text-muted mb-3">{habito.descripcion}</p>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <div className="tarjeta-info-mini">
              <small className="text-muted d-block mb-1">Hora</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiClock />
                <span>{habito.horario}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini">
              <small className="text-muted d-block mb-1">Racha</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiTrendingUp />
                <span>{habito.racha}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <small className="text-muted">Progreso</small>
          <small className="fw-semibold">{habito.progreso}%</small>
        </div>

        <div className="progress progreso-personalizado mb-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${habito.progreso}%` }}
            aria-valuenow={habito.progreso}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <div className="mt-auto d-flex flex-wrap gap-2">
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3">
            <FiCheckCircle />
            <span>Completar</span>
          </button>

          <button className="btn btn-suave btn-sm d-flex align-items-center gap-2">
            <FiEdit2 />
            <span>Editar</span>
          </button>

          <button className="btn btn-suave btn-sm d-flex align-items-center gap-2">
            <FiTrash2 />
            <span>Eliminar</span>
          </button>

          <button className="btn btn-suave btn-sm d-flex align-items-center gap-2">
            <FiEye />
            <span>Detalle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaHabito;