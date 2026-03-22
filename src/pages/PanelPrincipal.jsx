import { useMemo, useState } from 'react';
import {
  FiActivity,
  FiCheckSquare,
  FiPlus
} from 'react-icons/fi';
import BarraLateralPanel from '../components/dashboard/BarraLateralPanel';
import BarraSuperiorPanel from '../components/dashboard/BarraSuperiorPanel';
import TarjetaHabito from '../components/dashboard/TarjetaHabito';
import ModalHabito from '../components/dashboard/ModalHabito';

function PanelPrincipal() {
  const [habitos, setHabitos] = useState([
    {
      id: 1,
      nombre: 'Meditar',
      descripcion: 'Meditación diaria para reducir el estrés y comenzar el día con calma.',
      categoria: 'Salud',
      horario: '05:30',
      fechaInicio: '2024-11-24',
      fechaFin: '',
      racha: '7 días',
      fechaCreacion: '24/11/2024',
      progreso: 60
    },
    {
      id: 2,
      nombre: 'Planificar el día',
      descripcion: 'Organizar las tareas diarias para mantener enfoque y productividad.',
      categoria: 'Estudio',
      horario: '07:30',
      fechaInicio: '2024-11-24',
      fechaFin: '',
      racha: '4 días',
      fechaCreacion: '24/11/2024',
      progreso: 45
    },
    {
      id: 3,
      nombre: 'Tomar agua',
      descripcion: 'Beber 2 litros de agua al día para mantener una buena hidratación.',
      categoria: 'Salud',
      horario: '07:00',
      fechaInicio: '2024-11-24',
      fechaFin: '',
      racha: '7 días',
      fechaCreacion: '24/11/2024',
      progreso: 80
    },
    {
      id: 4,
      nombre: 'Estudiar programación',
      descripcion: 'Dedicar 2 horas al día al estudio de nuevas tecnologías y lenguajes.',
      categoria: 'Estudio',
      horario: '18:00',
      fechaInicio: '2024-11-24',
      fechaFin: '',
      racha: '3 días',
      fechaCreacion: '24/11/2024',
      progreso: 55
    },
    {
      id: 5,
      nombre: 'Dormir 8 horas',
      descripcion: 'Acostarse temprano para mantener un buen descanso y mejorar el rendimiento.',
      categoria: 'Bienestar',
      horario: '22:00',
      fechaInicio: '2024-12-01',
      fechaFin: '',
      racha: '6 días',
      fechaCreacion: '01/12/2024',
      progreso: 70
    },
    {
      id: 6,
      nombre: 'Tomar pausas mentales',
      descripcion: 'Practicar pausas cortas de 5 minutos durante el trabajo o estudio.',
      categoria: 'Productividad',
      horario: '10:30',
      fechaInicio: '2024-12-01',
      fechaFin: '',
      racha: '5 días',
      fechaCreacion: '01/12/2024',
      progreso: 50
    }
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [habitoEnEdicion, setHabitoEnEdicion] = useState(null);
  const [detalleHabito, setDetalleHabito] = useState(null);

  const abrirCrearHabito = () => {
    setHabitoEnEdicion(null);
    setMostrarModal(true);
  };

  const abrirEditarHabito = (habito) => {
    setHabitoEnEdicion(habito);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setHabitoEnEdicion(null);
  };

  const obtenerFechaActual = () => {
    return new Date().toLocaleDateString('es-CO');
  };

  const procesarHabito = (datosHabito) => {
    return {
      nombre: datosHabito.nombre,
      descripcion: datosHabito.descripcion,
      categoria: datosHabito.categoria,
      horario: datosHabito.horario,
      fechaInicio: datosHabito.fechaInicio,
      fechaFin: datosHabito.fechaFin
    };
  };

  const crearHabito = (datosProcesados) => {
    const nuevoHabito = {
      id: Date.now(),
      nombre: datosProcesados.nombre,
      descripcion: datosProcesados.descripcion,
      categoria: datosProcesados.categoria,
      horario: datosProcesados.horario,
      fechaInicio: datosProcesados.fechaInicio,
      fechaFin: datosProcesados.fechaFin,
      racha: '0 días',
      fechaCreacion: obtenerFechaActual(),
      progreso: 0
    };

    setHabitos((prev) => [nuevoHabito, ...prev]);
  };

  const actualizarHabito = (datosProcesados) => {
    setHabitos((prev) =>
      prev.map((habito) =>
        habito.id === habitoEnEdicion.id
          ? {
              ...habito,
              ...datosProcesados
            }
          : habito
      )
    );
  };

  const guardarHabito = (datosHabito) => {
    const datosProcesados = procesarHabito(datosHabito);

    if (habitoEnEdicion) {
      actualizarHabito(datosProcesados);
    } else {
      crearHabito(datosProcesados);
    }
  };

  const completarHabito = (id) => {
    setHabitos((prev) =>
      prev.map((habito) => {
        if (habito.id !== id) return habito;

        const nuevoProgreso = habito.progreso >= 100 ? 100 : habito.progreso + 10;
        const numeroRacha = parseInt(habito.racha, 10) || 0;

        return {
          ...habito,
          progreso: nuevoProgreso,
          racha: `${numeroRacha + 1} días`
        };
      })
    );
  };

  const eliminarHabito = (id) => {
    setHabitos((prev) => prev.filter((habito) => habito.id !== id));

    if (detalleHabito && detalleHabito.id === id) {
      setDetalleHabito(null);
    }
  };

  const verDetalleHabito = (habito) => {
    setDetalleHabito(habito);
  };

  const resumen = useMemo(() => {
    const activos = habitos.length;
    const completados = habitos.filter((habito) => habito.progreso >= 100).length;

    return [
      {
        titulo: 'Hábitos activos',
        valor: `${activos}`,
        descripcion: 'Rutinas en seguimiento',
        icono: <FiActivity />
      },
      {
        titulo: 'Completados',
        valor: `${completados}`,
        descripcion: 'Hábitos al 100%',
        icono: <FiCheckSquare />
      }
    ];
  }, [habitos]);

  return (
    <div className="d-flex fondo-panel" style={{ minHeight: '100vh' }}>
      <BarraLateralPanel />

      <div className="flex-grow-1 d-flex flex-column">
        <BarraSuperiorPanel />

        <main className="p-4 p-lg-5">
          <section className="tarjeta-bienvenida p-4 p-lg-5 mb-4">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <p className="mb-2 opacity-75">Organiza tu día con intención</p>
                <h2 className="fw-bold mb-3">Construye una mejor versión de ti con cada hábito</h2>
                <p className="mb-0 opacity-75">
                  Lleva el control de tus actividades, fortalece tu constancia y transforma
                  pequeñas acciones en grandes resultados.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <button
                  className="btn btn-light px-4 py-3 fw-semibold rounded-4 d-inline-flex align-items-center gap-2"
                  onClick={abrirCrearHabito}
                >
                  <FiPlus />
                  <span>Nuevo hábito</span>
                </button>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <div className="row g-4">
              {resumen.map((item) => (
                <div className="col-12 col-md-6" key={item.titulo}>
                  <div className="card tarjeta-resumen h-100">
                    <div className="card-body p-4 d-flex align-items-center gap-3">
                      <div className="icono-resumen">{item.icono}</div>
                      <div>
                        <p className="text-muted mb-1">{item.titulo}</p>
                        <h3 className="fw-bold mb-1 text-morado">{item.valor}</h3>
                        <p className="mb-0 text-secondary">{item.descripcion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="seccion-titulo">
              <div>
                <h2 className="fw-bold mb-1">Tus hábitos activos</h2>
                <p className="text-muted mb-0">
                  Organiza, consulta y da seguimiento a tus hábitos diarios.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {habitos.map((habito) => (
                <div className="col-12 col-md-6 col-xl-4" key={habito.id}>
                  <TarjetaHabito
                    habito={habito}
                    alCompletar={completarHabito}
                    alEditar={abrirEditarHabito}
                    alEliminar={eliminarHabito}
                    alVerDetalle={verDetalleHabito}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <ModalHabito
        mostrar={mostrarModal}
        cerrar={cerrarModal}
        guardarHabito={guardarHabito}
        habitoEnEdicion={habitoEnEdicion}
      />

      {detalleHabito && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 px-4 pt-4 pb-2">
                <div>
                  <h4 className="fw-bold mb-1 text-morado">Detalle del hábito</h4>
                  <p className="text-muted mb-0">Información completa del hábito seleccionado.</p>
                </div>

                <button
                  type="button"
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '42px', height: '42px' }}
                  onClick={() => setDetalleHabito(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body px-4 pb-4">
                <div className="mb-3">
                  <span className="etiqueta-categoria">{detalleHabito.categoria}</span>
                </div>

                <h4 className="fw-bold">{detalleHabito.nombre}</h4>
                <p className="text-muted">{detalleHabito.descripcion}</p>

                <div className="row g-3 mt-2">
                  <div className="col-6">
                    <div className="tarjeta-info-mini">
                      <small className="text-muted d-block mb-1">Horario</small>
                      <div className="fw-semibold">{detalleHabito.horario || 'No definido'}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tarjeta-info-mini">
                      <small className="text-muted d-block mb-1">Racha</small>
                      <div className="fw-semibold">{detalleHabito.racha}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tarjeta-info-mini">
                      <small className="text-muted d-block mb-1">Fecha inicio</small>
                      <div className="fw-semibold">{detalleHabito.fechaInicio || 'No definida'}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tarjeta-info-mini">
                      <small className="text-muted d-block mb-1">Fecha fin</small>
                      <div className="fw-semibold">{detalleHabito.fechaFin || 'No definida'}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="tarjeta-info-mini">
                      <small className="text-muted d-block mb-1">Progreso</small>
                      <div className="fw-semibold mb-2">{detalleHabito.progreso}%</div>
                      <div className="progress progreso-personalizado">
                        <div
                          className="progress-bar"
                          style={{ width: `${detalleHabito.progreso}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-primary px-4 rounded-4"
                    onClick={() => setDetalleHabito(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelPrincipal;