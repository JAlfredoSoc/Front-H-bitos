import { FiActivity, FiCheckSquare, FiTrendingUp, FiPlus } from 'react-icons/fi';
import BarraLateralPanel from '../components/dashboard/BarraLateralPanel';
import BarraSuperiorPanel from '../components/dashboard/BarraSuperiorPanel';
import TarjetaHabito from '../components/dashboard/TarjetaHabito';

function PanelPrincipal() {
  const habitos = [
    {
      id: 1,
      nombre: 'Meditar',
      descripcion: 'Meditación diaria para reducir el estrés y comenzar el día con calma.',
      categoria: 'Salud',
      horario: '05:30 AM',
      racha: '7 días',
      fechaCreacion: '24/11/2024',
      progreso: 60
    },
    {
      id: 2,
      nombre: 'Planificar el día',
      descripcion: 'Organizar las tareas diarias para mantener enfoque y productividad.',
      categoria: 'Estudio',
      horario: '07:30 AM',
      racha: '4 días',
      fechaCreacion: '24/11/2024',
      progreso: 45
    },
    {
      id: 3,
      nombre: 'Tomar agua',
      descripcion: 'Beber 2 litros de agua al día para mantener una buena hidratación.',
      categoria: 'Salud',
      horario: '07:00 AM',
      racha: '7 días',
      fechaCreacion: '24/11/2024',
      progreso: 80
    },
    {
      id: 4,
      nombre: 'Estudiar programación',
      descripcion: 'Dedicar 2 horas al día al estudio de nuevas tecnologías y lenguajes.',
      categoria: 'Estudio',
      horario: '06:00 PM',
      racha: '3 días',
      fechaCreacion: '24/11/2024',
      progreso: 55
    },
    {
      id: 5,
      nombre: 'Dormir 8 horas',
      descripcion: 'Acostarse temprano para mantener un buen descanso y mejorar el rendimiento.',
      categoria: 'Salud',
      horario: '10:00 PM',
      racha: '6 días',
      fechaCreacion: '01/12/2024',
      progreso: 70
    },
    {
      id: 6,
      nombre: 'Tomar pausas mentales',
      descripcion: 'Practicar pausas cortas de 5 minutos durante el trabajo o estudio.',
      categoria: 'Bienestar',
      horario: '10:30 AM',
      racha: '5 días',
      fechaCreacion: '01/12/2024',
      progreso: 50
    }
  ];

  const resumen = [
    {
      titulo: 'Hábitos activos',
      valor: '12',
      descripcion: 'Rutinas en seguimiento',
      icono: <FiActivity />
    },
    {
      titulo: 'Completados hoy',
      valor: '5',
      descripcion: 'Buen avance diario',
      icono: <FiCheckSquare />
    },
    {
      titulo: 'Racha actual',
      valor: '7 días',
      descripcion: 'Mantén el ritmo',
      icono: <FiTrendingUp />
    }
  ];

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
                <button className="btn btn-light px-4 py-3 fw-semibold rounded-4 d-inline-flex align-items-center gap-2">
                  <FiPlus />
                  <span>Nuevo hábito</span>
                </button>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <div className="row g-4">
              {resumen.map((item) => (
                <div className="col-12 col-md-4" key={item.titulo}>
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

              <button className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2">
                <FiPlus />
                <span>Nuevo hábito</span>
              </button>
            </div>

            <div className="row g-4">
              {habitos.map((habito) => (
                <div className="col-12 col-md-6 col-xl-4" key={habito.id}>
                  <TarjetaHabito habito={habito} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PanelPrincipal;