import { useEffect, useState } from "react";
import { estadisticasUsuario } from "../../service/usuarioService";

const SeccionEstadisticas = ({ usuarioId }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await estadisticasUsuario(usuarioId);
                setStats(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        if (usuarioId) cargar();
    }, [usuarioId]);

    if (!stats) {
        return (
            <div className="p-4 p-lg-5">
                <p className="text-muted">Cargando estadísticas...</p>
            </div>
        );
    }

    const { resumen, categorias, progreso, actividad } = stats;

    const totalCats = Object.values(categorias.conteoCategorias).reduce(
        (a, b) => a + b,
        0,
    );

    const catColors = {
        Productividad: "#7F77DD",
        Salud: "#1D9E75",
        Ejercicio: "#D85A30",
    };

    return (
        <div className="p-4 p-lg-5">
            {/* KPIs */}
            <p className="section-label mb-2">Resumen general</p>
            <div className="row g-3 mb-4">
                {[
                    {
                        label: "Total hábitos",
                        value: resumen.totalHabitos,
                        sub: "activos este mes",
                        accent: "#7F77DD",
                    },
                    {
                        label: "Completados",
                        value: resumen.completados,
                        sub: `de ${resumen.totalHabitos}`,
                        accent: "#1D9E75",
                    },
                    {
                        label: "Pendientes",
                        value: resumen.pendientes,
                        sub: "por completar",
                        accent: "#D85A30",
                    },
                    {
                        label: "Cumplimiento",
                        value: `${resumen.porcentajeCumplimiento}%`,
                        sub: "esta semana",
                        accent: "#BA7517",
                    },
                ].map(({ label, value, sub, accent }) => (
                    <div key={label} className="col-6 col-md-3">
                        <div
                            className="p-3 rounded-3 h-100"
                            style={{
                                background: "var(--bs-secondary-bg)",
                                borderLeft: `2px solid ${accent}`,
                                borderRadius: "0 8px 8px 0",
                            }}
                        >
                            <p
                                className="mb-1"
                                style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: "var(--bs-secondary-color)",
                                    textTransform: "uppercase",
                                    letterSpacing: ".06em",
                                }}
                            >
                                {label}
                            </p>
                            <p
                                className="mb-0 fw-medium"
                                style={{ fontSize: 26, lineHeight: 1 }}
                            >
                                {value}
                            </p>
                            <p
                                className="mb-0 mt-1"
                                style={{ fontSize: 11, color: "var(--bs-tertiary-color)" }}
                            >
                                {sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progreso + Actividad */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div
                        className="p-3 border rounded-3 h-100"
                        style={{ background: "var(--bs-body-bg)" }}
                    >
                        <p className="section-label mb-3">Progreso</p>
                        {[
                            {
                                label: "Promedio",
                                value: `${parseFloat(progreso.progresoPromedio).toFixed(1)}%`,
                                pct: parseFloat(progreso.progresoPromedio),
                                color: "#7F77DD",
                            },
                            {
                                label: "Frec. semanal",
                                value: `${parseFloat(progreso.frecuenciaPromedio).toFixed(2)} días/sem`,
                                pct: (parseFloat(progreso.frecuenciaPromedio) / 7) * 100,
                                color: "#1D9E75",
                            },
                        ].map(({ label, value, pct, color }) => (
                            <div key={label} className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span
                                        style={{ fontSize: 13, color: "var(--bs-secondary-color)" }}
                                    >
                                        {label}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
                                </div>
                                <div
                                    className="rounded-pill overflow-hidden"
                                    style={{ height: 7, background: "var(--bs-secondary-bg)" }}
                                >
                                    <div
                                        style={{
                                            width: `${Math.min(pct, 100)}%`,
                                            height: "100%",
                                            background: color,
                                            borderRadius: 99,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-6">
                    <div
                        className="p-3 border rounded-3 h-100"
                        style={{ background: "var(--bs-body-bg)" }}
                    >
                        <p className="section-label mb-3">Actividad mensual</p>
                        <div
                            className="d-flex align-items-flex-end gap-2"
                            style={{ height: 64, alignItems: "flex-end" }}
                        >
                            {Object.entries(actividad.habitosPorMes).map(([mes, count]) => {
                                const [, m] = mes.split("-");
                                const meses = [
                                    "",
                                    "Ene",
                                    "Feb",
                                    "Mar",
                                    "Abr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Ago",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dic",
                                ];
                                return (
                                    <div
                                        key={mes}
                                        className="d-flex flex-column align-items-center gap-1 flex-grow-1"
                                    >
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 500,
                                                color: "var(--bs-secondary-color)",
                                            }}
                                        >
                                            {count}
                                        </span>
                                        <div
                                            style={{
                                                width: "100%",
                                                background: "#7F77DD",
                                                borderRadius: "4px 4px 0 0",
                                                height: "100%",
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 10,
                                                color: "var(--bs-tertiary-color)",
                                            }}
                                        >
                                            {meses[parseInt(m)]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Categorías */}
            <div
                className="p-3 border rounded-3"
                style={{ background: "var(--bs-body-bg)" }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="section-label mb-0">Categorías</p>
                    <span
                        className="badge rounded-pill"
                        style={{
                            background: "#EEEDFE",
                            color: "#3C3489",
                            fontWeight: 500,
                            fontSize: 11,
                        }}
                    >
                        Top: {categorias.categoriaMasUsada || "N/A"}
                    </span>
                </div>
                {Object.entries(categorias.conteoCategorias).map(([cat, val]) => {
                    const pct = ((val / totalCats) * 100).toFixed(1);
                    const color = catColors[cat] || "#888780";
                    return (
                        <div key={cat} className="d-flex align-items-center gap-3 mb-2">
                            <span style={{ fontSize: 13, minWidth: 100 }}>{cat}</span>
                            <div
                                className="flex-grow-1 rounded-pill overflow-hidden"
                                style={{ height: 7, background: "var(--bs-secondary-bg)" }}
                            >
                                <div
                                    style={{
                                        width: `${pct}%`,
                                        height: "100%",
                                        background: color,
                                        borderRadius: 99,
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--bs-secondary-color)",
                                    minWidth: 20,
                                    textAlign: "right",
                                }}
                            >
                                {val}
                            </span>
                        </div>
                    );
                })}
                <div className="d-flex gap-3 flex-wrap mt-3 pt-3 border-top">
                    {Object.entries(catColors).map(([cat, color]) => (
                        <span
                            key={cat}
                            className="d-flex align-items-center gap-1"
                            style={{ fontSize: 11, color: "var(--bs-secondary-color)" }}
                        >
                            <span
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 2,
                                    background: color,
                                    display: "inline-block",
                                }}
                            />
                            {cat}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeccionEstadisticas;
