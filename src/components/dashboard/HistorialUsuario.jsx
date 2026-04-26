import { useState, useEffect, useMemo } from "react";
import {
  FiClock, FiCheckCircle, FiTrash2, FiPlusCircle,
  FiTrendingUp, FiActivity, FiSearch, FiX, FiFilter,
} from "react-icons/fi";
import { obtenerHistorialUsuarioMock as obtenerHistorialUsuario } from "../../service/historial.mock.js";

// ─── Configuración de acciones ───────────────────────────────────────────────

const ACCIONES = {
  CREADO: { fondo: "#e9f7ee", texto: "#1e7e34", borde: "#1e7e34", icono: <FiPlusCircle size={13} />, etiqueta: "Creado" },
  ELIMINADO: { fondo: "#fde8ef", texto: "#c0392b", borde: "#c0392b", icono: <FiTrash2 size={13} />, etiqueta: "Eliminado" },
  COMPLETADO: { fondo: "#e7f1ff", texto: "#0d6efd", borde: "#0d6efd", icono: <FiCheckCircle size={13} />, etiqueta: "Completado" },
  PROGRESO_ACTUALIZADO: { fondo: "#fff8e1", texto: "#b45309", borde: "#f59e0b", icono: <FiTrendingUp size={13} />, etiqueta: "Progreso" },
};

const ACCION_DEFAULT = {
  fondo: "#f3f4f6", texto: "#6b7280", borde: "#d1d5db",
  icono: <FiClock size={13} />, etiqueta: "Actividad",
};

const PERIODOS = [
  { clave: "todos", etiqueta: "Todo el tiempo" },
  { clave: "hoy", etiqueta: "Hoy" },
  { clave: "semana", etiqueta: "Esta semana" },
  { clave: "mes", etiqueta: "Este mes" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const formatearGrupo = (fecha) => {
  if (!fecha) return "Sin fecha";
  const d = new Date(fecha);
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);
  if (d.toDateString() === hoy.toDateString()) return "Hoy";
  if (d.toDateString() === ayer.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const agruparPorFecha = (lista) =>
  lista.reduce((grupos, entrada) => {
    const clave = entrada.fecha ? new Date(entrada.fecha).toDateString() : "sin-fecha";
    if (!grupos[clave]) grupos[clave] = { label: formatearGrupo(entrada.fecha), entradas: [] };
    grupos[clave].entradas.push(entrada);
    return grupos;
  }, {});

const dentroDelPeriodo = (fecha, periodo) => {
  if (periodo === "todos" || !fecha) return true;
  const d = new Date(fecha);
  const hoy = new Date();
  if (periodo === "hoy") return d.toDateString() === hoy.toDateString();
  if (periodo === "semana") {
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - hoy.getDay());
    inicio.setHours(0, 0, 0, 0);
    return d >= inicio;
  }
  if (periodo === "mes") return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
  return true;
};

// ─── Subcomponente tarjeta ────────────────────────────────────────────────────

function TarjetaEntrada({ entrada }) {
  const estilo = ACCIONES[entrada.accion] || ACCION_DEFAULT;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "start",
        gap: "0 16px",
        background: "#fff",
        borderRadius: 16,
        padding: "14px 18px",
        boxShadow: "0 1px 6px rgba(17,24,39,0.06)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(109,40,217,0.10)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 6px rgba(17,24,39,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Icono */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: estilo.fondo, border: `1.5px solid ${estilo.borde}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: estilo.texto, flexShrink: 0, marginTop: 2,
      }}>
        {estilo.icono}
      </div>

      {/* Contenido */}
      <div style={{ minWidth: 0 }}>
        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
          <span
            className="rounded-pill fw-bold d-inline-flex align-items-center gap-1"
            style={{
              background: estilo.fondo, color: estilo.texto,
              fontSize: "0.7rem", padding: "2px 10px",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}
          >
            {estilo.icono}{estilo.etiqueta}
          </span>
          {entrada.habito?.nombre && (
            <span style={{
              fontSize: "0.88rem", fontWeight: 600, color: "#111827",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260,
            }}>
              {entrada.habito.nombre}
            </span>
          )}
        </div>

        {entrada.detalle && (
          <p className="mb-0" style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.45 }}>
            {entrada.detalle}
          </p>
        )}

        {entrada.habito?.descripcion && (
          <p className="mb-0 mt-1" style={{
            fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1.4,
            borderLeft: `2px solid ${estilo.borde}40`, paddingLeft: 8,
          }}>
            {entrada.habito.descripcion}
          </p>
        )}
      </div>

      {/* Fecha */}
      <div className="d-flex align-items-center gap-1 flex-shrink-0"
        style={{ color: "#9ca3af", fontSize: "0.75rem", whiteSpace: "nowrap", marginTop: 4 }}>
        <FiClock size={11} />
        {formatearFecha(entrada.fecha)}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

function HistorialUsuario({ idUsuario }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [accionActiva, setAccionActiva] = useState("TODOS");
  const [periodoActivo, setPeriodoActivo] = useState("todos");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);
        setError(null);
        const respuesta = await obtenerHistorialUsuario(idUsuario);
        const datos = Array.isArray(respuesta) ? respuesta : respuesta?.data ?? [];
        setHistorial(datos);
      } catch (err) {
        console.error("Error cargando historial:", err);
        setError("No se pudo cargar el historial. Intenta de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    };
    cargarHistorial();
  }, [idUsuario]);

  // Filtrado con useMemo
  const historialFiltrado = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return historial.filter((entrada) => {
      const coincideAccion = accionActiva === "TODOS" || entrada.accion === accionActiva;
      const coincidePeriodo = dentroDelPeriodo(entrada.fecha, periodoActivo);
      const coincideTexto =
        !texto ||
        entrada.habito?.nombre?.toLowerCase().includes(texto) ||
        entrada.habito?.descripcion?.toLowerCase().includes(texto) ||
        entrada.detalle?.toLowerCase().includes(texto);
      return coincideAccion && coincidePeriodo && coincideTexto;
    });
  }, [historial, busqueda, accionActiva, periodoActivo]);

  const hayFiltrosActivos = busqueda !== "" || accionActiva !== "TODOS" || periodoActivo !== "todos";

  const limpiarFiltros = () => {
    setBusqueda("");
    setAccionActiva("TODOS");
    setPeriodoActivo("todos");
  };

  // Conteo por tipo (sobre datos originales)
  const conteo = useMemo(() =>
    historial.reduce((acc, e) => { acc[e.accion] = (acc[e.accion] || 0) + 1; return acc; }, {}),
    [historial]
  );

  // ── Estados de carga / error ──
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-3 fw-semibold text-muted">Cargando historial...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger rounded-4 m-3" role="alert">{error}</div>;
  }

  if (historial.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{
          width: 60, height: 60, borderRadius: "50%", background: "#f5f3ff",
          display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
        }}>
          <FiClock size={26} color="#6d28d9" />
        </div>
        <p className="fw-semibold text-muted mb-1">Sin actividad registrada</p>
        <small className="text-muted">Las acciones sobre tus hábitos aparecerán aquí.</small>
      </div>
    );
  }

  const grupos = agruparPorFecha(historialFiltrado);

  return (
    <div style={{ width: "100%", padding: "0 4px" }}>

      {/* ── Encabezado + resumen ── */}
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 p-4 rounded-4"
        style={{ background: "#fff", boxShadow: "0 1px 6px rgba(17,24,39,0.06)" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: "#f5f3ff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiActivity size={20} color="#6d28d9" />
          </div>
          <div>
            <h5 className="fw-bold mb-0 text-morado">Historial de actividades</h5>
            <small className="text-muted">
              {historialFiltrado.length} de {historial.length} registro{historial.length !== 1 ? "s" : ""}
            </small>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {Object.entries(conteo).map(([accion, total]) => {
            const est = ACCIONES[accion] || ACCION_DEFAULT;
            return (
              <span key={accion}
                className="d-inline-flex align-items-center gap-1 rounded-pill fw-semibold"
                style={{ background: est.fondo, color: est.texto, fontSize: "0.75rem", padding: "4px 12px" }}
              >
                {est.icono}{est.etiqueta}: {total}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Barra de filtros ── */}
      <div
        className="d-flex flex-wrap align-items-center gap-3 mb-4 p-3 rounded-4"
        style={{ background: "#fff", boxShadow: "0 1px 6px rgba(17,24,39,0.06)" }}
      >
        {/* Buscador */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <FiSearch
            size={14}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
          />
          <input
            type="text"
            placeholder="Buscar por hábito, detalle..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: "100%", border: "1px solid #ececf3", borderRadius: 12,
              padding: "8px 12px 8px 34px", fontSize: "0.83rem",
              outline: "none", color: "#374151", background: "#fafafa",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
            onBlur={(e) => (e.target.style.borderColor = "#ececf3")}
          />
        </div>

        {/* Filtro por acción */}
        <div className="d-flex align-items-center gap-1 flex-wrap">
          <FiFilter size={13} style={{ color: "#9ca3af", marginRight: 4 }} />
          {["TODOS", ...Object.keys(ACCIONES)].map((clave) => {
            const est = clave === "TODOS" ? null : ACCIONES[clave];
            const activo = accionActiva === clave;
            return (
              <button
                key={clave}
                onClick={() => setAccionActiva(clave)}
                style={{
                  border: activo ? `1.5px solid ${est?.borde || "#6d28d9"}` : "1.5px solid #ececf3",
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: activo ? (est?.fondo || "#f5f3ff") : "#fafafa",
                  color: activo ? (est?.texto || "#6d28d9") : "#6b7280",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {est?.icono}
                {clave === "TODOS" ? "Todos" : est?.etiqueta}
              </button>
            );
          })}
        </div>

        {/* Filtro por periodo */}
        <div className="d-flex gap-1 flex-wrap">
          {PERIODOS.map(({ clave, etiqueta }) => {
            const activo = periodoActivo === clave;
            return (
              <button
                key={clave}
                onClick={() => setPeriodoActivo(clave)}
                style={{
                  border: activo ? "1.5px solid #6d28d9" : "1.5px solid #ececf3",
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: activo ? "#f5f3ff" : "#fafafa",
                  color: activo ? "#6d28d9" : "#6b7280",
                  transition: "all 0.15s ease",
                }}
              >
                {etiqueta}
              </button>
            );
          })}
        </div>

        {/* Limpiar filtros */}
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="d-inline-flex align-items-center gap-1"
            style={{
              border: "none", background: "transparent",
              color: "#c0392b", fontSize: "0.78rem", fontWeight: 600,
              cursor: "pointer", padding: "4px 8px", borderRadius: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fde8ef")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FiX size={13} /> Limpiar
          </button>
        )}
      </div>

      {/* ── Sin resultados ── */}
      {historialFiltrado.length === 0 ? (
        <div className="text-center py-5">
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "#f5f3ff",
            display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <FiSearch size={22} color="#6d28d9" />
          </div>
          <p className="fw-semibold text-muted mb-1">No hay resultados para los filtros aplicados</p>
          <small className="text-muted">
            Intenta con otros términos o{" "}
            <span
              style={{ color: "#6d28d9", cursor: "pointer", fontWeight: 600 }}
              onClick={limpiarFiltros}
            >
              limpia los filtros
            </span>
            .
          </small>
        </div>
      ) : (
        /* ── Timeline agrupada ── */
        <div className="d-flex flex-column gap-4">
          {Object.entries(grupos).map(([clave, grupo]) => (
            <div key={clave}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <span style={{
                  background: "#f5f3ff", color: "#6d28d9",
                  fontSize: "0.72rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  padding: "4px 12px", borderRadius: 999, whiteSpace: "nowrap",
                }}>
                  {grupo.label}
                </span>
                <div style={{ flex: 1, height: 1, background: "#ececf3" }} />
                <span style={{ fontSize: "0.72rem", color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {grupo.entradas.length} evento{grupo.entradas.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
                gap: 10,
              }}>
                {grupo.entradas.map((entrada, index) => (
                  <TarjetaEntrada key={entrada._id || entrada.id || index} entrada={entrada} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorialUsuario;
