import {
  FiHome,
  FiBarChart2,
  FiClock
} from 'react-icons/fi';

function BarraLateralPanel() {
  const menu = [
    { nombre: 'Mis hábitos', icono: <FiHome /> },
    { nombre: 'Estadísticas', icono: <FiBarChart2 /> },
    { nombre: 'Historial', icono: <FiClock /> }
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
    </aside>
  );
}

export default BarraLateralPanel;