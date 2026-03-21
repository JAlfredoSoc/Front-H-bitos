import { FiBell, FiSearch } from 'react-icons/fi';

function BarraSuperiorPanel() {
  return (
    <div className="barra-superior-panel d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <p className="text-muted mb-1">Bienvenido de nuevo</p>
        <h3 className="fw-bold m-0 text-morado">Mis hábitos</h3>
      </div>

      <div className="encabezado-derecha">
        <div className="buscador-panel">
          <FiSearch className="buscador-icono" />
          <input type="text" placeholder="Buscar hábito..." />
        </div>

        <button className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center"
          style={{ width: '46px', height: '46px' }}>
          <FiBell />
        </button>

        <div className="text-end">
          <p className="mb-0 fw-semibold">Usuario</p>
          <small className="text-muted">Nivel constante</small>
        </div>

        <div className="avatar-panel">U</div>
      </div>
    </div>
  );
}

export default BarraSuperiorPanel;