import {
  FiHome,
  FiBarChart2,
  FiClock,
  FiHeart
} from 'react-icons/fi';
import logo from '../../assets/logo.jpeg';

function BarraLateralPanel({ seccionActiva, cambiarSeccion }) {
  const menu = [
    { nombre: 'Mis hábitos', clave: 'habitos', icono: <FiHome /> },
    { nombre: 'Estadísticas', clave: 'estadisticas', icono: <FiBarChart2 /> },
    { nombre: 'Historial', clave: 'historial', icono: <FiClock /> },
    { nombre: 'Sugerencias', clave: 'sugerencias', icono: <FiHeart /> }
  ];

  return (
    <aside className="sidebar-panel">
      <div className="logo-panel">
        <div className="logo-icono" style={{ background: "transparent", boxShadow: "none", padding: 0, overflow: "hidden" }}>
          <img src={logo} alt="Habits UP" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: 12 }} />
        </div>
        <div className="logo-texto">
          <h4>Habits UP</h4>
          <span>Panel personal</span>
        </div>
      </div>

      <div className="menu-seccion-titulo">Navegación</div>

      <div className="menu-lateral">
        {menu.map((item) => (
          <button
            key={item.nombre}
            className={`menu-lateral-btn ${seccionActiva === item.clave ? 'activo' : ''}`}
            onClick={() => cambiarSeccion(item.clave)}
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