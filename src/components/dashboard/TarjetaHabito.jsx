import {
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiBell,
  FiCopy
} from "react-icons/fi";

function obtenerClaseCategoria(categoria) {
  const clases = {
    Salud: "categoria-salud",
    Bienestar: "categoria-bienestar",
    Estudio: "categoria-estudio",
    Productividad: "categoria-productividad",
    Trabajo: "categoria-trabajo",
    Relaciones: "categoria-relaciones",
  };

  return clases[categoria] || "categoria-general";
}

function TarjetaHabito({
  habito,
  alCompletar,
  alEditar,
  alEliminar,
  alVerDetalle,
  alClonar
}) {
  const claseCategoria = obtenerClaseCategoria(habito.categoria);
  
  // Verificar si tiene notificaciones
  const tieneNotificacion = habito.notificaciones && habito.notificaciones.length > 0;

  const formatearFecha = (fecha) => {
    if (!fecha) return "No definida";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`card tarjeta-habito tarjeta-habito-color ${claseCategoria} h-100`}>
      <div className="card-body p-4 d-flex flex-column">
        {/* Header: Categoría + Notificación + Fecha */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={`etiqueta-categoria ${claseCategoria}`}>
              {habito.categoria}
            </span>

            {/* Ícono simple si tiene notificaciones */}
            {tieneNotificacion && (
              <span
                className="d-inline-flex align-items-center gap-1 text-primary"
                title="Notificaciones activas"
                style={{ fontSize: "0.75rem" }}>
                <FiBell size={12} />
                <span className="d-none d-sm-inline">Recordatorio</span>
              </span>
            )}
          </div>
          <small className="text-muted">{habito.fechaCreacion}</small>
        </div>

        {/* Título y Descripción */}
        <h5 className="fw-bold mb-2">{habito.nombre}</h5>
        <p className="text-muted mb-3">{habito.descripcion}</p>

        {/* Información del hábito */}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Hora</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiClock />
                <span>{formatearHora(habito.horario) || "Sin hora"}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Inicio</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiCalendar />
                <span>{formatearFecha(habito.fechaInicio)}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Fin</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <FiCalendar />
                <span>{formatearFecha(habito.fechaFin) || "No definida"}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Periodo</small>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <span>{habito.periodo || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Frecuencia</small>
              <div className="fw-semibold">
                <span>
                  {habito.frecuencia || "N/A"} vez/veces por{" "}
                  {habito.periodo?.slice(0, -2) || "periodo"}
                </span>
              </div>
            </div>
          </div>

          {/* Mensaje simple de notificación */}
          {tieneNotificacion && (
            <div className="col-12">
              <div className="tarjeta-info-mini h-100 bg-light p-2 rounded">
                <small className="text-muted d-block mb-1">
                  🔔 Notificaciones
                </small>
                <div className="fw-semibold">
                  Recibirás recordatorios para este hábito
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progreso */}
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
          />
        </div>

        {/* Botones de acción */}
        <div className="mt-auto d-flex flex-wrap gap-2">
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
            onClick={() => alCompletar(habito._id || habito.id)}
            disabled={habito.progreso >= 100}>
            <FiCheckCircle />
            <span>Completar</span>
          </button>

          <button
            className="btn btn-suave btn-sm d-flex align-items-center gap-2"
            onClick={() => alEditar(habito)}>
            <FiEdit2 />
            <span>Editar</span>
          </button>

          <button
            className="btn btn-suave btn-sm d-flex align-items-center gap-2"
            onClick={() => alClonar(habito._id || habito.id)}>
            <FiCopy />
            <span>Clonar</span>
          </button>

          <button
            className="btn btn-suave btn-sm d-flex align-items-center gap-2"
            onClick={() => alEliminar(habito._id || habito.id)}>
            <FiTrash2 />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaHabito;