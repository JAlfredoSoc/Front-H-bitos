import { FiPlus, FiTag } from 'react-icons/fi';

const COLORES_CATEGORIA = {
  Salud:        { fondo: "#e7f1ff", texto: "#0d6efd", borde: "#0d6efd" },
  Ejercicio:    { fondo: "#e9f7ee", texto: "#1e7e34", borde: "#1e7e34" },
  Bienestar:    { fondo: "#f3e8ff", texto: "#6d28d9", borde: "#6d28d9" },
  Productividad:{ fondo: "#fff8e1", texto: "#b45309", borde: "#f59e0b" },
  Estudio:      { fondo: "#ede9fe", texto: "#5b21b6", borde: "#5b21b6" },
  Trabajo:      { fondo: "#f1f5f9", texto: "#475569", borde: "#475569" },
  Relaciones:   { fondo: "#fde8ef", texto: "#c0392b", borde: "#c0392b" },
};

const COLOR_DEFAULT = { fondo: "#f3f4f6", texto: "#6b7280", borde: "#d1d5db" };

function TarjetaSugerencia({ sugerencia, alSeleccionar }) {
  const nombreCategoria =
    sugerencia.categoria?.nombreCategoria ||
    sugerencia.categoria?.nombre ||
    sugerencia.categoria ||
    "General";

  const color = COLORES_CATEGORIA[nombreCategoria] || COLOR_DEFAULT;

  return (
    <div
      className="h-100"
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(17,24,39,0.07)",
        borderTop: `4px solid ${color.borde}`,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(109,40,217,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(17,24,39,0.07)";
      }}
    >
      <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Categoría */}
        <div className="mb-3">
          <span
            className="d-inline-flex align-items-center gap-1 fw-bold rounded-pill"
            style={{
              background: color.fondo,
              color: color.texto,
              fontSize: "0.7rem",
              padding: "4px 10px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <FiTag size={11} />
            {nombreCategoria}
          </span>
        </div>

        {/* Nombre */}
        <h6
          className="fw-bold mb-2"
          style={{ fontSize: "1rem", color: "#111827", lineHeight: 1.35 }}
        >
          {sugerencia.nombre}
        </h6>

        {/* Descripción */}
        <p
          className="mb-0"
          style={{
            fontSize: "0.83rem",
            color: "#6b7280",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {sugerencia.descripcion}
        </p>
      </div>

      {/* Botón */}
      <div style={{ padding: "0 20px 20px" }}>
        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          style={{ borderRadius: 12, fontWeight: 600, fontSize: "0.85rem", padding: "9px" }}
          onClick={() => alSeleccionar(sugerencia)}
        >
          <FiPlus size={15} />
          Seleccionar
        </button>
      </div>
    </div>
  );
}

export default TarjetaSugerencia;
