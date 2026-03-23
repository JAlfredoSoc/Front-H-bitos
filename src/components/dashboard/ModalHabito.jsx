// src/components/dashboard/ModalHabito.jsx
import { useEffect, useState } from 'react';
import { crearHabito } from '../../service/habitoService';
import { obtenerCategorias } from '../../service/categoriaService';

const estadoInicial = {
  nombre: '',
  descripcion: '',
  categoria: '',
  horario: '',
  fechaInicio: '',
  fechaFin: '',
  periodo: '',
  frecuencia: ''
};

function ModalHabito({
  mostrar,
  cerrar,
  habitoEnEdicion = null,
  sugerenciaSeleccionada = null,
  onHabitoCreado = null // Callback para actualizar la lista de hábitos
}) {
  const [formulario, setFormulario] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [categorias, setCategorias] = useState([]);

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
    if (habitoEnEdicion) {
      setFormulario({
        nombre: habitoEnEdicion.nombre || '',
        descripcion: habitoEnEdicion.descripcion || '',
        categoria: categoriaId,
        horario: habitoEnEdicion.horario || '',
        fechaInicio: habitoEnEdicion.fechaInicio || '',
        fechaFin: habitoEnEdicion.fechaFin || ''
      });
    } else if (sugerenciaSeleccionada) {
      // Extraer el nombre de la categoría correctamente
      let categoriaId = '';

      if (sugerenciaSeleccionada.categoria) {
        if (typeof sugerenciaSeleccionada.categoria === 'object') {
          categoriaId = sugerenciaSeleccionada.categoria._id;
        }
      }
      
      
      setFormulario({
        nombre: sugerenciaSeleccionada.nombre || '',
        descripcion: sugerenciaSeleccionada.descripcion || '',
        categoria: sugerenciaSeleccionada.categoria?._id || '',
        horario: sugerenciaSeleccionada.horario || '',
        fechaInicio: sugerenciaSeleccionada.fechaInicio || '',
        fechaFin: sugerenciaSeleccionada.fechaFin || ''
      });
    } else {
      setFormulario(estadoInicial);
    }

    setErrores({});
    setProcesando(false);
    setMensajeError('');
    setMensajeExito('');
  }, [habitoEnEdicion, sugerenciaSeleccionada, mostrar]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: ''
    }));
    
    // Limpiar mensajes al editar
    if (mensajeError) setMensajeError('');
    if (mensajeExito) setMensajeExito('');
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del hábito es obligatorio.';
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria.';
    } else if (formulario.descripcion.trim().length < 8) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 8 caracteres.';
    }

    if (!formulario.categoria) {
      nuevosErrores.categoria = 'La categoría es obligatoria.';
    }

    if (!formulario.horario) {
      nuevosErrores.horario = 'El horario es obligatorio.';
    }

    if (formulario.fechaInicio && formulario.fechaFin) {
      if (new Date(formulario.fechaFin) < new Date(formulario.fechaInicio)) {
        nuevosErrores.fechaFin = 'La fecha fin no puede ser menor que la fecha inicio.';
      }
    }

    if (!formulario.periodo) {
      nuevosErrores.periodo = 'El periodo es obligatorio.';
    }

    if (!formulario.frecuencia) {
      nuevosErrores.frecuencia = 'La frecuencia es obligatoria.';
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarDatosHabito = () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    return {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      categoria: formulario.categoria,
      horario: formulario.horario,
      fechaInicio: formulario.fechaInicio,
      fechaFin: formulario.fechaFin || null,
      usuarioId: usuario?._id, // 🔥 AQUÍ ESTÁ LA CLAVE
      periodo: formulario.periodo,
      frecuencia: formulario.frecuencia
    };
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarFormulario();
    if (!esValido) return;

    setProcesando(true);
    setMensajeError('');
    setMensajeExito('');

    const datosProcesados = procesarDatosHabito();

    let resultado;
    
    if (habitoEnEdicion) {
      // Editar hábito existente
      // resultado = await actualizarHabito(habitoEnEdicion._id, datosProcesados);
    } else {
      // Crear nuevo hábito
      resultado = await crearHabito(datosProcesados);
    }

    if (resultado.success) {
      console.log(datosProcesados);
      setMensajeExito(resultado.message);
      
      // Notificar al padre que se creó/actualizó el hábito
      if (onHabitoCreado) {
        onHabitoCreado(resultado.data);
      }
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        cerrar();
        setProcesando(false);
      }, 1500);
    } else {
      setMensajeError(resultado.message);
      setProcesando(false);
    }
  };

  if (!mostrar) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <div>
              <h4 className="fw-bold mb-1 text-morado">
                {habitoEnEdicion ? 'Editar hábito' : 'Nuevo hábito'}
              </h4>
              <p className="text-muted mb-0">
                {habitoEnEdicion
                  ? 'Actualiza la información de tu hábito.'
                  : sugerenciaSeleccionada
                  ? `Basado en la sugerencia: "${sugerenciaSeleccionada.nombre}". Personaliza según tus necesidades.`
                  : 'Valida y registra un nuevo hábito en tu panel.'}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={cerrar}
              disabled={procesando}
            ></button>
          </div>

          <div className="modal-body px-4 pb-4">
            {/* Mensaje de éxito */}
            {mensajeExito && (
              <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {mensajeExito}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMensajeExito('')}
                ></button>
              </div>
            )}

            {/* Mensaje de error */}
            {mensajeError && (
              <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {mensajeError}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMensajeError('')}
                ></button>
              </div>
            )}

            <form onSubmit={manejarSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre del hábito *</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg rounded-4 ${errores.nombre ? 'is-invalid' : ''}`}
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    placeholder="Ejemplo: Tomar agua"
                    disabled={procesando}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción *</label>
                  <textarea
                    className={`form-control rounded-4 ${errores.descripcion ? 'is-invalid' : ''}`}
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    rows="4"
                    placeholder="Describe el objetivo o detalle del hábito"
                    disabled={procesando}
                  ></textarea>
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>

                <select
                  className={`form-select form-select-lg rounded-4 ${errores.categoria ? 'is-invalid' : ''}`}
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

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Periodo *</label>
                  <select
                    className="form-select form-select-lg rounded-4"
                    name="periodo"
                    value={formulario.periodo}
                    onChange={manejarCambio}
                  >
                    <option value="">Seleccione</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Frecuencia *</label>
                  <input
                    type="number"
                    className="form-control form-control-lg rounded-4"
                    name="frecuencia"
                    value={formulario.frecuencia}
                    onChange={manejarCambio}
                    placeholder="Ej: 1, 2, 3..."
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Horario *</label>
                  <input
                    type="date"
                    className={`form-control form-control-lg rounded-4}`}
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

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha fin</label>
                  <input
                    type="date"
                    className={`form-control form-control-lg rounded-4 ${errores.fechaFin ? 'is-invalid' : ''}`}
                    name="fechaFin"
                    value={formulario.fechaFin}
                    onChange={manejarCambio}
                    disabled={procesando}
                  />
                  {errores.fechaFin && <div className="invalid-feedback">{errores.fechaFin}</div>}
                </div>
              </div>

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
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Procesando...
                    </>
                  ) : (
                    habitoEnEdicion ? 'Guardar cambios' : 'Crear hábito'
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