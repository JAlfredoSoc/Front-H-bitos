import { useEffect, useState } from 'react';

const estadoInicial = {
  nombre: '',
  descripcion: '',
  categoria: 'Salud',
  horario: '',
  fechaInicio: '',
  fechaFin: ''
};

function ModalHabito({
  mostrar,
  cerrar,
 guardarHabito,
  habitoEnEdicion = null
}) {
  const [formulario, setFormulario] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (habitoEnEdicion) {
      setFormulario({
        nombre: habitoEnEdicion.nombre || '',
        descripcion: habitoEnEdicion.descripcion || '',
        categoria: habitoEnEdicion.categoria || 'Salud',
        horario: habitoEnEdicion.horario || '',
        fechaInicio: habitoEnEdicion.fechaInicio || '',
        fechaFin: habitoEnEdicion.fechaFin || ''
      });
    } else {
      setFormulario(estadoInicial);
    }

    setErrores({});
    setProcesando(false);
  }, [habitoEnEdicion, mostrar]);

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

    if (!formulario.categoria.trim()) {
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

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarDatosHabito = () => {
    return {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      categoria: formulario.categoria.trim(),
      horario: formulario.horario,
      fechaInicio: formulario.fechaInicio,
      fechaFin: formulario.fechaFin
    };
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarFormulario();

    if (!esValido) return;

    setProcesando(true);

    const datosProcesados = procesarDatosHabito();

    setTimeout(() => {
      guardarHabito(datosProcesados);
      setProcesando(false);
      cerrar();
    }, 500);
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
                  : 'Valida y registra un nuevo hábito en tu panel.'}
              </p>
            </div>
          </div>

          <div className="modal-body px-4 pb-4">
            <form onSubmit={manejarSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre del hábito</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg rounded-4 ${errores.nombre ? 'is-invalid' : ''}`}
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    placeholder="Ejemplo: Tomar agua"
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className={`form-control rounded-4 ${errores.descripcion ? 'is-invalid' : ''}`}
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    rows="4"
                    placeholder="Describe el objetivo o detalle del hábito"
                  ></textarea>
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Categoría</label>
                  <select
                    className={`form-select form-select-lg rounded-4 ${errores.categoria ? 'is-invalid' : ''}`}
                    name="categoria"
                    value={formulario.categoria}
                    onChange={manejarCambio}
                  >
                    <option value="Salud">Salud</option>
                    <option value="Estudio">Estudio</option>
                    <option value="Bienestar">Bienestar</option>
                    <option value="Productividad">Productividad</option>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Relaciones">Relaciones</option>
                  </select>
                  {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Horario</label>
                  <input
                    type="time"
                    className={`form-control form-control-lg rounded-4 ${errores.horario ? 'is-invalid' : ''}`}
                    name="horario"
                    value={formulario.horario}
                    onChange={manejarCambio}
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
                  {procesando
                    ? 'Procesando...'
                    : habitoEnEdicion
                    ? 'Guardar cambios'
                    : 'Crear hábito'}
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