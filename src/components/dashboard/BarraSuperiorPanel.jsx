import { useState } from 'react';
import { FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ModalPerfil from './ModalPerfil';

function BarraSuperiorPanel() {
  const navigate = useNavigate();
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);

  const handleCerrarSesion = () => {
    navigate('/');
  };

  const abrirModalPerfil = () => {
    setMostrarModalPerfil(true);
  };

  const cerrarModalPerfil = () => {
    setMostrarModalPerfil(false);
  };

  return (
    <>
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

          <button
            className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center"
            style={{ width: '46px', height: '46px' }}
          >
            <FiBell />
          </button>

          <div
            className="text-end"
            style={{ cursor: 'pointer' }}
            onClick={abrirModalPerfil}
          >
            <p className="mb-0 fw-semibold">Usuario</p>
            <small className="text-muted">Nivel constante</small>
          </div>

          <div
            className="avatar-panel"
            style={{ cursor: 'pointer' }}
            onClick={abrirModalPerfil}
          >
            U
          </div>

          <button
            className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '46px', height: '46px' }}
            title="Cerrar sesión"
            onClick={handleCerrarSesion}
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      <ModalPerfil
        mostrar={mostrarModalPerfil}
        cerrarModal={cerrarModalPerfil}
      />
    </>
  );
}

export default BarraSuperiorPanel;