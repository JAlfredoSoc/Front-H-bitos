import { useEffect, useState } from "react";
import { estadisticasUsuario } from "../../service/usuarioService";
import {
  FiActivity, FiCheckCircle, FiClock, FiTrendingUp,
  FiAward
} from "react-icons/fi";

const MESES = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun",
               "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const CAT_COLORES = {
  Productividad: { color: "#6d28d9", fondo: "#f5f3ff" },
  Salud:         { color: "#0d6efd", fondo: "#e7f1ff" },
  Ejercicio:     { color: "#1e7e34", fondo: "#e9f7ee" },
  Bienestar:     { color: "#b45309", fondo: "#fff8e1" },
  Estudio:       { color: "#5b21b6", fondo: "#ede9fe" },
  Trabajo:       { color: "#475569", fondo: "#f1f5f9" },
};
const CAT_DEFAULT = { color: "#6b7280", fondo: "#f3f4f6" };

const SeccionEstadisticas = ({ usuarioId }) => {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await estadisticasUsuario(usuarioId);
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuarioId]);

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-3 fw-semibold text-muted">Cargando estadísticas...</span>
      </div>
    );
  }

  if (!stats) return null;

  const { resumen, categorias, progreso, actividad } = stats;

  const totalCats = Object.values(categorias.conteoCategorias).reduce((a, b) => a + b, 0);
  const maxMes = Math.max(...Object.values(actividad.habitosPorMes));
  const progresoNum = parseFloat(progreso.progresoPromedio);
  const frecNum = parseFloat(progreso.frecuenciaPromedio);

  const kpis = [
    {
      label: "Total hábitos",
      value: resumen.totalHabitos,
      sub: "activos este mes",
      icono: <FiActivity size={20} />,
      color: "#6d28d9",
      fondo: "#f5f3ff",
    },
    {
      label: "Completados",
      value: resumen.completados,
      sub: `de ${resumen.totalHabitos} hábitos`,
      icono: <FiCheckCircle size={20} />,
      color: "#1e7e34",
      fondo: "#e9f7ee",
    },
    {
      label: "Pendientes",
      value: resumen.pendientes,
      sub: "por completar",
      icono: <FiClock size={20} />,
      color: "#b45309",
      fondo: "#fff8e1",
    },
    {
      label: "Cumplimiento",
      value: `${parseFloat(resumen.porcentajeCumplimiento).toFixed(1)}%`,
      sub: "tasa general",
      icono: <FiTrendingUp size={20} />,
      color: "#0d6efd",
      fondo: "#e7f1ff",
    },
  ];

  return (
    <div className="p-4 p-lg-5">

      {/* ── Encabezado ── */}
      <section className="tarjeta-sugerencias p-4 p-lg-5 mb-4">
        <h2 className="fw-bold mb-2 text-white">Estadísticas</h2>
        <p className="mb-0 text-white opacity-75">
          Resumen de tu actividad y progreso general.
        </p>
      </section>

      {/* ── KPIs ── */}
      <div className="row g-3 mb-4">
        {kpis.map(({ label, value, sub, icono, color, fondo }) => (
          <div key={label} className="col-6 col-md-3">
            <div style={{
              background: "#fff",
              borderRadius: 18,
              padding: "18px 16px",
              boxShadow: "0 2px 12px rgba(17,24,39,0.07)",
              borderTop: `3px solid ${color}`,
              height: "100%",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(17,24,39,0.11)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(17,24,39,0.07)";
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: fondo, color, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>
                {icono}
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>
                {value}
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "6px 0 2px" }}>
                {label}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Fila media: Progreso + Actividad mensual ── */}
      <div className="row g-3 mb-4">

        {/* Progreso */}
        <div className="col-md-5">
          <div style={{
            background: "#fff", borderRadius: 18, padding: "20px",
            boxShadow: "0 2px 12px rgba(17,24,39,0.07)", height: "100%",
          }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <FiTrendingUp size={16} color="#6d28d9" />
              <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>Progreso general</span>
            </div>

            {/* Progreso promedio */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontSize: 13, color: "#6b7280" }}>Promedio de progreso</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9" }}>{progresoNum.toFixed(1)}%</span>
              </div>
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min(progresoNum, 100)}%`, height: "100%",
                  background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
                  borderRadius: 999, transition: "width 0.6s ease",
                }} />
              </div>
            </div>

            {/* Frecuencia */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontSize: 13, color: "#6b7280" }}>Frecuencia semanal</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1e7e34" }}>{frecNum.toFixed(2)} días/sem</span>
              </div>
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min((frecNum / 7) * 100, 100)}%`, height: "100%",
                  background: "linear-gradient(90deg, #22c55e, #1e7e34)",
                  borderRadius: 999, transition: "width 0.6s ease",
                }} />
              </div>
            </div>

            {/* Cumplimiento circular simple */}
            <div className="d-flex align-items-center gap-3 mt-3 pt-3"
              style={{ borderTop: "1px solid #f3f4f6" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `conic-gradient(#6d28d9 ${parseFloat(resumen.porcentajeCumplimiento) * 3.6}deg, #f3f4f6 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9" }}>
                    {parseFloat(resumen.porcentajeCumplimiento).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Tasa de cumplimiento</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                  {resumen.completados} completados de {resumen.totalHabitos}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad mensual */}
        <div className="col-md-7">
          <div style={{
            background: "#fff", borderRadius: 18, padding: "20px",
            boxShadow: "0 2px 12px rgba(17,24,39,0.07)", height: "100%",
          }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <FiActivity size={16} color="#6d28d9" />
              <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>Actividad mensual</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
              {Object.entries(actividad.habitosPorMes).map(([mes, count]) => {
                const [, m] = mes.split("-");
                const pct = maxMes > 0 ? (count / maxMes) * 100 : 0;
                const esMax = count === maxMes;
                return (
                  <div key={mes} style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: esMax ? "#6d28d9" : "#9ca3af" }}>
                      {count}
                    </span>
                    <div style={{
                      width: "100%", height: `${pct}%`, minHeight: 6,
                      background: esMax
                        ? "linear-gradient(180deg, #7c3aed, #6d28d9)"
                        : "linear-gradient(180deg, #c4b5fd, #ddd6fe)",
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.4s ease",
                    }} />
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{MESES[parseInt(m)]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Categorías ── */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: "20px",
        boxShadow: "0 2px 12px rgba(17,24,39,0.07)",
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <FiAward size={16} color="#6d28d9" />
            <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>Distribución por categoría</span>
          </div>
          <span style={{
            background: "#f5f3ff", color: "#6d28d9",
            fontSize: "0.72rem", fontWeight: 700,
            padding: "4px 12px", borderRadius: 999,
          }}>
            Top: {categorias.categoriaMasUsada || "N/A"}
          </span>
        </div>

        <div className="d-flex flex-column gap-3">
          {Object.entries(categorias.conteoCategorias).map(([cat, val]) => {
            const pct = ((val / totalCats) * 100).toFixed(1);
            const { color, fondo } = CAT_COLORES[cat] || CAT_DEFAULT;
            return (
              <div key={cat} className="d-flex align-items-center gap-3">
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: fondo,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color }}>{val}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{cat}</span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: color, borderRadius: 999,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="d-flex flex-wrap gap-3 mt-4 pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
          {Object.entries(categorias.conteoCategorias).map(([cat]) => {
            const { color } = CAT_COLORES[cat] || CAT_DEFAULT;
            return (
              <span key={cat} className="d-flex align-items-center gap-1"
                style={{ fontSize: 11, color: "#6b7280" }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 2,
                  background: color, display: "inline-block",
                }} />
                {cat}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeccionEstadisticas;
