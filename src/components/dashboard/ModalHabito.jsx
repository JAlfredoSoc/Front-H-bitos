// src/components/dashboard/ModalHabito.jsx
import { useEffect, useState } from "react";
import { crearHabito, editarHabito } from "../../service/habitoService";
import { obtenerCategorias } from "../../service/categoriaService";

const estadoInicial = {
  nombre: "",
  descripcion: "",
  categoria: "",
  horario: "",
  fechaInicio: "",
  fechaFin: "",
  periodo: "",
  frecuencia: "",
  diasSeleccionados: [],
  notificacionActiva: false,
  tipoNotificacion: "recordatorio",
};

function ModalHabito({
  mostrar,
  cerrar,
  habitoEnEdicion = null,
  sugerenciaSeleccionada = null,
  onHabitoCreado = null,
}) {
  const [formulario, setFormulario] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [totalRepeticiones, setTotalRepeticiones] = useState(0);

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      const res = await obtenerCategorias();
      if (res.success) {
        setCategorias(res.data);
      }
    };

    if (mostrar) {
      cargarCategorias();
    }
  }, [mostrar]);

  useEffect(() => {
    if (formulario.periodo === "diario") {
      setFormulario((prev) => ({
        ...prev,
        frecuencia: prev.diasSeleccionados.length,
      }));
    }
  }, [formulario.diasSeleccionados, formulario.periodo]);

  useEffect(() => {
    if (formulario.periodo === "semanal") {
      const total = Number(formulario.frecuencia * formulario.diasSeleccionados.length);

      setTotalRepeticiones(total);
    } else {
      setTotalRepeticiones(0);
    }
  }, [formulario.frecuencia, formulario.diasSeleccionados, formulario.periodo]);

  // Inicializar formulario
  useEffect(() => {
    if (habitoEnEdicion) {
      setFormulario({
        nombre: habitoEnEdicion.nombre || "",
        descripcion: habitoEnEdicion.descripcion || "",
        categoria: habitoEnEdicion.categoria?._id || habitoEnEdicion.categoria || "",
        horario: habitoEnEdicion.horario 
          ? new Date(habitoEnEdicion.horario).toTimeString().slice(0, 5) 
          : "",
        fechaInicio: habitoEnEdicion.fechaInicio?.split("T")[0] || "",
        fechaFin: habitoEnEdicion.fechaFin?.split("T")[0] || "",
        periodo: habitoEnEdicion.periodo || "",
        frecuencia: habitoEnEdicion.frecuencia || "",

        // 🔥 ESTA ES LA LÍNEA QUE TE FALTA
        diasSeleccionados: habitoEnEdicion.diasSeleccionados || [],

        notificacionActiva: habitoEnEdicion.notificacionConfig?.activa || false,
        tipoNotificacion: habitoEnEdicion.notificacionConfig?.medio || "recordatorio",
      });
    } else if (sugerenciaSeleccionada) {
      setFormulario({
        nombre: sugerenciaSeleccionada.nombre || "",
        descripcion: sugerenciaSeleccionada.descripcion || "",
        categoria: sugerenciaSeleccionada.categoria?._id || "",
        horario: sugerenciaSeleccionada.horario || "",
        fechaInicio: sugerenciaSeleccionada.fechaInicio || "",
        fechaFin: sugerenciaSeleccionada.fechaFin || "",
        periodo: sugerenciaSeleccionada.periodo || "",
        frecuencia: sugerenciaSeleccionada.frecuencia || "",
        notificacionActiva: false,
        tipoNotificacion: "recordatorio",
      });
    } else {
      setFormulario(estadoInicial);
    }

    setErrores({});
    setProcesando(false);
    setMensajeError("");
    setMensajeExito("");
  }, [habitoEnEdicion, sugerenciaSeleccionada, mostrar]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (mensajeError) setMensajeError("");
    if (mensajeExito) setMensajeExito("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del hábito es obligatorio.";
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria.";
    } else if (formulario.descripcion.trim().length < 8) {
      nuevosErrores.descripcion = "La descripción debe tener al menos 8 caracteres.";
    }

    if (!formulario.categoria) {
      nuevosErrores.categoria = "La categoría es obligatoria.";
    }

    if (!formulario.horario) {
      nuevosErrores.horario = "El horario es obligatorio.";
    }

    if (formulario.fechaInicio && formulario.fechaFin) {
      if (new Date(formulario.fechaFin) < new Date(formulario.fechaInicio)) {
        nuevosErrores.fechaFin = "La fecha fin no puede ser menor que la fecha inicio.";
      }
    }

    if (!formulario.periodo) {
      nuevosErrores.periodo = "El periodo es obligatorio.";
    }

    if (!formulario.frecuencia && formulario.periodo !== "diario") {
      nuevosErrores.frecuencia = "La frecuencia es obligatoria.";
    }

    if ((formulario.periodo === "semanal" || formulario.periodo === "diario") && formulario.diasSeleccionados.length === 0) {
      nuevosErrores.diasSeleccionados = "Selecciona al menos un día.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarDatosHabito = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const fechaBase = formulario.fechaInicio || new Date().toISOString().split("T")[0];
    const horarioCompleto = new Date(`${fechaBase}T${formulario.horario}`);

    const fechaFinCalculada = calcularFechaFin();
    const frecuenciaSemanalCalculada = calcularFrecuenciaSemanal();

    return {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      categoria: formulario.categoria,
      horario: horarioCompleto,
      fechaInicio: formulario.fechaInicio,
      fechaFin: fechaFinCalculada,
      usuarioId: usuario?._id,
      periodo: formulario.periodo,
      frecuencia: formulario.frecuencia,

      diasSeleccionados: formulario.diasSeleccionados, 
      frecuenciaSemanal: frecuenciaSemanalCalculada, 

      notificacionActiva: formulario.notificacionActiva,
      tipoNotificacion: formulario.tipoNotificacion,
    };
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarFormulario();
    if (!esValido) return;

    setProcesando(true);
    setMensajeError("");
    setMensajeExito("");

    const datosProcesados = procesarDatosHabito();
    let resultado;

    if (habitoEnEdicion) {
      resultado = await editarHabito(
        habitoEnEdicion._id || habitoEnEdicion.id,
        datosProcesados
      );
    } else {
      resultado = await crearHabito(datosProcesados);
    }

    if (resultado?.success) {
      setMensajeExito(resultado.message);

      if (onHabitoCreado) {
        onHabitoCreado(resultado.data);
      }

      setTimeout(() => {
        cerrar();
        setProcesando(false);
      }, 1500);
    } else {
      setMensajeError(resultado?.message || "Error al crear el hábito");
      setProcesando(false);
    }
  };

  const manejarSeleccionDia = (dia) => {
    setFormulario((prev) => {
      const yaExiste = prev.diasSeleccionados.includes(dia);

      return {
        ...prev,
        diasSeleccionados: yaExiste
          ? prev.diasSeleccionados.filter((d) => d !== dia)
          : [...prev.diasSeleccionados, dia],
      };
    });
  };


  const calcularFechaFin = () => {
    if (!formulario.fechaInicio) return null;

    const fechaInicio = new Date(formulario.fechaInicio);

    if (formulario.periodo === "semanal") {
      const semanas = Number(formulario.frecuencia);
      const diasExtra = semanas * 7;

      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + diasExtra);

      return fechaFin.toISOString().split("T")[0];
    }

    if (formulario.periodo === "diario") {
      const dias = formulario.diasSeleccionados.length;

      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + dias);

      return fechaFin.toISOString().split("T")[0];
    }

    return null;
  };


  const calcularFrecuenciaSemanal = () => {
    if (formulario.periodo === "semanal") {
      return Number(formulario.frecuencia) * formulario.diasSeleccionados.length;
    }
    return 0;
  };





  if (!mostrar) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <div>
              <h4 className="fw-bold mb-1 text-morado">
                {habitoEnEdicion ? "Editar hábito" : "Nuevo hábito"}
              </h4>
              <p className="text-muted mb-0">
                {habitoEnEdicion
                  ? "Actualiza la información de tu hábito."
                  : sugerenciaSeleccionada
                  ? `Basado en la sugerencia: "${sugerenciaSeleccionada.nombre}". Personaliza según tus necesidades.`
                  : "Valida y registra un nuevo hábito en tu panel."}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={cerrar}
              disabled={procesando}
            />
          </div>

          {/* Body */}
          <div className="modal-body px-4 pb-4">
            {/* Mensajes de éxito/error */}
            {mensajeExito && (
              <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {mensajeExito}
                <button type="button" className="btn-close" onClick={() => setMensajeExito("")} />
              </div>
            )}

            {mensajeError && (
              <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {mensajeError}
                <button type="button" className="btn-close" onClick={() => setMensajeError("")} />
              </div>
            )}

            <form onSubmit={manejarSubmit}>
              <div className="row g-3">
                {/* Nombre */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre del hábito *</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg rounded-4 ${errores.nombre ? "is-invalid" : ""}`}
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    placeholder="Ejemplo: Tomar agua"
                    disabled={procesando}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción *</label>
                  <textarea
                    className={`form-control rounded-4 ${errores.descripcion ? "is-invalid" : ""}`}
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    rows="4"
                    placeholder="Describe el objetivo o detalle del hábito"
                    disabled={procesando}
                  />
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>

                {/* Categoría */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Categoría *</label>
                  <select
                    className={`form-select form-select-lg rounded-4 ${errores.categoria ? "is-invalid" : ""}`}
                    name="categoria"
                    value={formulario.categoria}
                    onChange={manejarCambio}
                    disabled={procesando}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nombreCategoria}
                      </option>
                    ))}
                  </select>
                  {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
                </div>

                {/* Periodo y Frecuencia */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Periodo *</label>
                  <select
                    className="form-select form-select-lg rounded-4"
                    name="periodo"
                    value={formulario.periodo}
                    onChange={manejarCambio}
                    disabled={procesando}
                  >
                    <option value="">Seleccione</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    {/* <option value="mensual">Mensual</option> */}
                  </select>
                  {errores.periodo && <div className="invalid-feedback">{errores.periodo}</div>}
                </div>


                {(formulario.periodo === "semanal"  ||  formulario.periodo === "diario") &&(
                <div className="col-12">
                  <label className="form-label fw-semibold">Días de la semana *</label>
                  <div className="d-flex flex-wrap gap-2">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                      <button
                        type="button"
                        key={dia}
                        className={`btn rounded-pill ${
                          formulario.diasSeleccionados?.includes(dia)
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => manejarSeleccionDia(dia)}
                        disabled={procesando}
                      >
                        {dia}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Frecuencia *</label>
                  <input
                    type="number"
                    className={`form-control form-control-lg rounded-4 ${errores.frecuencia ? "is-invalid" : ""}`}
                    name="frecuencia"
                    value={formulario.frecuencia}
                    onChange={manejarCambio}
                    placeholder="Ej: 1, 2, 3..."
                    disabled={procesando || formulario.periodo === "diario"}
                  />
                  {errores.frecuencia && <div className="invalid-feedback">{errores.frecuencia}</div>}
                </div>

                {formulario.periodo === "semanal" && formulario.frecuencia > 0 && formulario.diasSeleccionados.length > 0 && (
                  <div className="alert alert-info mt-2">
                    En total el hábito se repetirá <strong>{totalRepeticiones}</strong> veces.
                  </div>
                )}

                {/* Horario y Fechas */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Horario *</label>
                  <input
                    type="time"
                    className={`form-control form-control-lg rounded-4 ${errores.horario ? "is-invalid" : ""}`}
                    name="horario"
                    value={formulario.horario}
                    onChange={manejarCambio}
                    disabled={procesando}
                  />
                  {errores.horario && <div className="invalid-feedback">{errores.horario}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha inicio</label>
                  <input
                    type="date"
                    className="form-control form-control-lg rounded-4"
                    name="fechaInicio"
                    value={formulario.fechaInicio}
                    onChange={manejarCambio}
                    disabled={procesando}
                  />
                </div>

                {formulario.fechaInicio && (
                <small className="text-muted">
                  📅 Fecha fin estimada: <strong>{calcularFechaFin()}</strong>
                </small>
              )}

                
              </div>

              {/* 🔔 SECCIÓN DE NOTIFICACIONES - UBICADA AL FINAL DEL FORMULARIO */}
              <div className="mt-4">
                <div className="card bg-light rounded-4 p-3 border-0">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="notificacionActiva"
                      checked={formulario.notificacionActiva}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          notificacionActiva: e.target.checked,
                        });
                      }}
                      disabled={procesando}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="notificacionActiva">
                      🔔 Activar notificaciones
                    </label>
                    <small className="text-muted d-block mt-1">
                      Recibirás recordatorios para cumplir con este hábito
                    </small>
                  </div>

                  {formulario.notificacionActiva && (
                    <div className="mt-2">
                      <label className="form-label fw-semibold">Medio de notificación</label>
                      <select
                        className="form-select rounded-4"
                        name="tipoNotificacion"
                        value={formulario.tipoNotificacion}
                        onChange={(e) => {
                          setFormulario({
                            ...formulario,
                            tipoNotificacion: e.target.value,
                          });
                        }}
                        disabled={procesando}
                      >
                        <option value="email">Correo electrónico</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="recordatorio">Recordatorio (app)</option>
                      </select>

                      {formulario.tipoNotificacion === "whatsapp" && (
                        <small className="text-muted d-block mt-2">
                          Asegúrate de tener registrado tu número de teléfono en tu perfil
                        </small>
                      )}
                      {formulario.tipoNotificacion === "email" && (
                        <small className="text-muted d-block mt-2">
                          Las notificaciones se enviarán a tu correo registrado
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light px-4 py-2 rounded-4"
                  onClick={cerrar}
                  disabled={procesando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 rounded-4"
                  disabled={procesando}
                >
                  {procesando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Procesando...
                    </>
                  ) : habitoEnEdicion ? (
                    "Guardar cambios"
                  ) : (
                    "Crear hábito"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalHabito;