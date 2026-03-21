import {
  FiHome,
  FiBarChart2,
  FiClock,
  FiCalendar,
  FiTarget,
  FiZap,
  FiHeart
} from 'react-icons/fi';

function BarraLateralPanel() {
  const menu = [
    { nombre: 'Mis hábitos', icono: <FiHome /> },
    { nombre: 'Modo focus', icono: <FiZap /> },
    { nombre: 'Estadísticas', icono: <FiBarChart2 /> },
    { nombre: 'Historial', icono: <FiClock /> },
    { nombre: 'Sugerencias', icono: <FiHeart /> },
    { nombre: 'Racha', icono: <FiTarget /> },
    { nombre: 'Calendario', icono: <FiCalendar /> }
  ];

  return (
    <aside className="sidebar-panel">
      <div className="logo-panel">
        <div className="logo-icono">H</div>
        <div className="logo-texto">
          <h4>Habits UP</h4>
          <span>Panel personal</span>
        </div>
      </div>

      <div className="menu-seccion-titulo">Navegación</div>

      <div className="menu-lateral">
        {menu.map((item, index) => (
          <button
            key={item.nombre}
            className={`menu-lateral-btn ${index === 0 ? 'activo' : ''}`}
          >
            <span className="menu-icono">{item.icono}</span>
            <span>{item.nombre}</span>
          </button>
        ))}
      </div>

      <div className="tarjeta-lateral">
        <p className="mb-2 opacity-75">Constancia semanal</p>
        <h5 className="fw-bold mb-2">Sigue así, vas excelente</h5>
        <p className="small opacity-75 mb-3">
          Has mantenido un buen ritmo en tus actividades esta semana.
        </p>

        <div className="progress">
          <div className="progress-bar" style={{ width: '72%' }}></div>
        </div>

        <small className="d-block mt-2 opacity-75">72% completado</small>
      </div>
    </aside>
  );
}

export default BarraLateralPanel;