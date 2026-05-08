import {
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiBell,
  FiCopy,
} from "react-icons/fi";
import { obtenerFactoryHabito } from "../factories/factorySelector";
import { useState } from "react";

function HabitoCard({
  habito,
  alCompletar,
  alEditar,
  alEliminar,
  alVerDetalle,
  alClonar,
}) {
  const factory = obtenerFactoryHabito(habito.categoria);
  const badgeClass = factory.getBadgeClass();
  const progressBarClass = factory.getProgressBarClass();
  const [subActivo, setSubActivo] = useState(null);

  const esRutina = habito.subHabitos && habito.subHabitos.length > 0;

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

  const calcularProgreso = () => {
    let total = 0;

    if (habito.periodo === "diario") {
      total = habito.frecuencia;
    }

    if (habito.periodo === "semanal") {
      total = habito.frecuenciaSemanal;
    }

    if (!total || total === 0) return 0;

    return Math.min(100, Math.round((habito.progreso / total) * 100));
  };

  const obtenerInicialDia = (dia) => {
    const mapa = {
      Lunes: "L",
      Martes: "M",
      Miércoles: "MI",
      Jueves: "J",
      Viernes: "V",
      Sábado: "S",
      Domingo: "D",
    };

    return mapa[dia] || "";
  };

  const obtenerProximasFechas = () => {
    if (!habito.fechaInicio || !habito.diasSeleccionados?.length) return [];

    const diasMap = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    const fechas = [];
    const fechaInicio = new Date(habito.fechaInicio);

    // buscamos próximas 5 ocurrencias
    let fecha = new Date(fechaInicio);

    while (fechas.length < 2) {
      if (
        habito.diasSeleccionados.includes(
          Object.keys(diasMap).find((d) => diasMap[d] === fecha.getDay()),
        )
      ) {
        fechas.push(new Date(fecha));
      }

      fecha.setDate(fecha.getDate() + 1);
    }

    return fechas;
  };

  const tieneNotificacion =
    habito.notificaciones && habito.notificaciones.length > 0;

  const renderSimple =()  => (
    <div className="card-body p-4 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className={badgeClass}>{habito.categoria || "General"}</span>
          {tieneNotificacion && (
            <span
              className="d-inline-flex align-items-center gap-1 text-primary"
              title="Notificaciones activas"
              style={{ fontSize: "0.75rem" }}
            >
              <FiBell size={12} />
              <span className="d-none d-sm-inline">Recordatorio</span>
            </span>
          )}
        </div>
        <small className="text-muted">{habito.fechaCreacion}</small>
      </div>

      <h5 className="fw-bold mb-2">{habito.nombre}</h5>
      <p className="text-muted mb-3">{habito.descripcion}</p> 

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

        {habito.diasSeleccionados?.length > 0 && (
          <div className="col-6">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">Días</small>
              <div className="fw-semibold d-flex gap-1 flex-wrap">
                {habito.diasSeleccionados.map((dia) => (
                  <span key={dia} className="badge bg-secondary">
                    {obtenerInicialDia(dia)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {habito.diasSeleccionados?.length > 0 && (
          <div className="col-12">
            <div className="tarjeta-info-mini h-100">
              <small className="text-muted d-block mb-1">
                Próximas ejecuciones
              </small>
              <div className="fw-semibold">
                {obtenerProximasFechas().map((fecha, i) => (
                  <div key={i}>
                    {fecha.toLocaleDateString("es-CO", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="col-6">
          <div className="tarjeta-info-mini h-100">
            <small className="text-muted d-block mb-1">Frecuencia</small>
            <div className="fw-semibold">
              {habito.periodo === "semanal" ? (
                <>
                  <div>{habito.frecuencia} semana(s)</div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {habito.frecuenciaSemanal} repeticiones en total
                  </div>
                </>
              ) : (
                <span>{habito.frecuencia || "N/A"} vez/veces</span>
              )}
            </div>
          </div>
        </div>
        {tieneNotificacion && (
          <div className="col-12">
            <div className="tarjeta-info-mini h-100 bg-light p-2 rounded">
              <small className="text-muted d-block mb-1">Notificaciones</small>
              <div className="fw-semibold">
                Recibirás recordatorios para este hábito
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between mb-2">
        <small className="text-muted">Progreso</small>
        <small className="fw-semibold">{calcularProgreso()}%</small>
      </div>

      <div className="progress progreso-personalizado mb-4">
        <div
          className={progressBarClass}
          role="progressbar"
          style={{ width: `${calcularProgreso()}%` }}
          aria-valuenow={calcularProgreso()}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <div className="mt-auto d-flex flex-wrap gap-2">
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
          onClick={() => alCompletar(habito._id || habito.id)}
          disabled={habito.progreso >= 100}
        >
          <FiCheckCircle />
          <span>Completar</span>
        </button>

        <button
          className="btn btn-suave btn-sm d-flex align-items-center gap-2"
          onClick={() => alEditar(habito)}
        >
          <FiEdit2 />
          <span>Editar</span>
        </button>

        <button
          className="btn btn-suave btn-sm d-flex align-items-center gap-2"
          onClick={() => alClonar(habito._id || habito.id)}
        >
          <FiCopy />
          <span>Clonar</span>
        </button>

        <button
          className="btn btn-suave btn-sm d-flex align-items-center gap-2"
          onClick={() => alEliminar(habito._id || habito.id)}
        >
          <FiTrash2 />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );

  const renderRutina = () => (
    <div className="card-body p-4 d-flex flex-column">
      <h5 className="fw-bold mb-3">{habito.nombre}</h5>
      <div className="d-flex flex-column gap-3">
        {habito.subHabitos.map((sub) => {
          const progresoSub = sub.progreso?.progreso || 0;
          const totalSub = sub.frecuencia || 1;
          const porcentaje = Math.min(
            100,
            Math.round((progresoSub / totalSub) * 100),
          );

          const estaAbierto = subActivo === sub._id;

          return (
            <div
              key={sub._id}
              className="p-3 border rounded d-flex flex-column gap-2"
            >
              {/* HEADER CLICKABLE */}
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setSubActivo(estaAbierto ? null : sub._id)}
              >
                <div>
                  <div className="fw-semibold">{sub.nombre}</div>
                  <small className="text-muted">{sub.descripcion}</small>
                </div>

                <span
                  className={`badge ${
                    sub.estado === "completado" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {sub.estado}
                </span>
              </div>

              {/* PROGRESO */}
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              {/* BOTÓN COMPLETAR */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
                onClick={() => alCompletar(sub._id)}
                disabled={progresoSub >= totalSub}
              >
                <FiCheckCircle />
                <span>Completar</span>
              </button>

              {/* 🔥 DETALLE DESPLEGABLE */}
              {estaAbierto && (
                <div className="mt-3 p-2 bg-light rounded">
                  <div className="mb-2">
                    <small className="text-muted">Horario</small>
                    <div>{formatearHora(sub.horario) || "No definido"}</div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Inicio</small>
                    <div>{formatearFecha(sub.fechaInicio)}</div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Fin</small>
                    <div>{formatearFecha(sub.fechaFin)}</div>
                  </div>

                  {/* 🔥 BOTÓN EDITAR */}
                  <button
                    className="btn btn-suave btn-sm d-flex align-items-center gap-2 mt-2"
                    onClick={() => alEditar(sub)} // 👈 IMPORTANTE
                  >
                    <FiEdit2 />
                    <span>Editar</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-3">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Progreso de la rutina</small>
            <small className="fw-semibold">{calcularProgresoRutina()}%</small>
          </div>

          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${calcularProgresoRutina()}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const calcularProgresoRutina = () => {
    if (!habito.subHabitos || habito.subHabitos.length === 0) return 0;

    const total = habito.subHabitos.length;

    const suma = habito.subHabitos.reduce((acc, sub) => {
      const progreso = sub.progreso?.progreso || 0;
      const frecuencia = sub.frecuencia || 1;

      const porcentajeSub = Math.min(100, (progreso / frecuencia) * 100);

      return acc + porcentajeSub;
    }, 0);

    return Math.round(suma / total);
  };



  return factory.renderContainer(
    esRutina ? renderRutina() : renderSimple()
  );
}

export default HabitoCard;
