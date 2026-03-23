import { useMemo, useState, useEffect } from 'react';
import {
  FiActivity,
  FiCheckSquare,
  FiPlus
} from 'react-icons/fi';
import BarraLateralPanel from '../components/dashboard/BarraLateralPanel';
import BarraSuperiorPanel from '../components/dashboard/BarraSuperiorPanel';
import TarjetaHabito from '../components/dashboard/TarjetaHabito';
import ModalHabito from '../components/dashboard/ModalHabito';
import SeccionSugerencias from '../components/dashboard/SeccionSugerencias';
import sugerenciasHabitos from '../../src/components/dashboard/SeccionSugerencias';

import { obtenerHabitosUsuario } from '../../src/service/usuarioService';

function PanelPrincipal() {
  const [habitos, setHabitos] = useState([
  ]);

  const [seccionActiva, setSeccionActiva] = useState('habitos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [habitoEnEdicion, setHabitoEnEdicion] = useState(null);
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState(null);
  const [detalleHabito, setDetalleHabito] = useState(null);

  const abrirCrearHabito = () => {
    setHabitoEnEdicion(null);
    setMostrarModal(true);
  };

  const abrirEditarHabito = (habito) => {
    setHabitoEnEdicion(habito);
    setMostrarModal(true);
  };

  const cambiarSeccion = (nuevaSeccion) => {
    setSeccionActiva(nuevaSeccion);
  };

  const seleccionarSugerencia = (sugerencia) => {
    // Validar que no exista ya en hábitos
    const yaExiste = habitos.some(
      (habito) => habito.nombre.toLowerCase() === sugerencia.nombre.toLowerCase()
    );

    if (yaExiste) {
      alert('Este hábito ya está en tu lista');
      return;
    }

    // Abrir modal con datos precargados de la sugerencia
    setSugerenciaSeleccionada(sugerencia);
    setHabitoEnEdicion(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setHabitoEnEdicion(null);
    setSugerenciaSeleccionada(null);
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

    if (habitoEnEdicion && !sugerenciaSeleccionada) {
      // Editar hábito existente
      actualizarHabito(datosProcesados);
    } else {
      // Crear nuevo hábito (ya sea vacío o desde sugerencia)
      crearHabito(datosProcesados);
      // Si se creó desde sugerencia, cambiar automáticamente a sección de hábitos
      if (sugerenciaSeleccionada) {
        setSeccionActiva('habitos');
      }
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


  useEffect(() => {
    const cargarHabitos = async () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      if (!usuario?._id) {
        console.warn("No hay usuario logueado");
        return;
      }

      const res = await obtenerHabitosUsuario(usuario._id);

      if (res.success) {
        // 🔥 Transformar datos del backend al formato que usa tu UI
        const habitosFormateados = res.data.map((h) => ({
          id: h._id,
          nombre: h.nombre,
          descripcion: h.descripcion,
          categoria: h.categoria?.nombreCategoria || 'Sin categoría',
          horario: h.horario,
          fechaInicio: h.fechaInicio,
          fechaFin: h.fechaFin,
          racha: `${h.progreso?.progreso || 0} días`,
          progreso: h.progreso?.progreso || 0,
          frecuencia: h.progreso?.frecuencia,
          periodo: h.progreso?.periodo
        }));

        setHabitos(habitosFormateados);
      } else {
        console.error(res.message);
      }
    };

    cargarHabitos();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No definida';

    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return '';

    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="d-flex fondo-panel" style={{ minHeight: '100vh' }}>
      <BarraLateralPanel seccionActiva={seccionActiva} cambiarSeccion={cambiarSeccion} />

      <div className="flex-grow-1 d-flex flex-column">
        <BarraSuperiorPanel />

        {seccionActiva === 'habitos' && (
          <>
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
          </>
        )}

        {seccionActiva === 'sugerencias' && (
          <SeccionSugerencias
            sugerencias={sugerenciasHabitos}
            habitosActuales={habitos}
            alSeleccionar={seleccionarSugerencia}
          />
        )}

        {seccionActiva === 'estadisticas' && (
          <main className="p-4 p-lg-5">
            <section className="text-center py-5">
              <h2 className="fw-bold mb-3">Estadísticas</h2>
              <p className="text-muted">
                Esta sección de estadísticas será implementada próximamente.
              </p>
            </section>
          </main>
        )}

        {seccionActiva === 'historial' && (
          <main className="p-4 p-lg-5">
            <section className="text-center py-5">
              <h2 className="fw-bold mb-3">Historial</h2>
              <p className="text-muted">
                Esta sección de historial será implementada próximamente.
              </p>
            </section>
          </main>
        )}
      </div>

      <ModalHabito
        mostrar={mostrarModal}
        cerrar={cerrarModal}
        habitoEnEdicion={habitoEnEdicion}
        sugerenciaSeleccionada={sugerenciaSeleccionada}
        onHabitoCreado={() => {
          // 🔥 recargar desde backend
          const usuario = JSON.parse(localStorage.getItem('usuario'));
          if (usuario?._id) {
            obtenerHabitosUsuario(usuario._id).then((res) => {
              if (res.success) {
                const habitosFormateados = res.data.map((h) => ({
                  id: h._id,
                  nombre: h.nombre,
                  descripcion: h.descripcion,
                  categoria: h.categoria?.nombreCategoria || 'Sin categoría',
                  horario: h.horario,
                  fechaInicio: h.fechaInicio,
                  fechaFin: h.fechaFin,
                  racha: `${h.progreso?.progreso || 0} días`,
                  progreso: h.progreso?.progreso || 0
                }));

                setHabitos(habitosFormateados);
              }
            });
          }
        }}
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
                      <div className="fw-semibold">{formatearHora(detalleHabito.horario) || 'No definido'}</div>
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
                      <div className="fw-semibold">{formatearFecha(detalleHabito.fechaInicio)}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tarjeta-info-mini">
                      <small className="text-muted d-block mb-1">Fecha fin</small>
                      <div className="fw-semibold">{formatearFecha(detalleHabito.fechaFin)}</div>
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