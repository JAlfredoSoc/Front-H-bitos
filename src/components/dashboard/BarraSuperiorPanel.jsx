import { useState, useEffect } from 'react';  // ← Agregar useEffect
import { FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ModalPerfil from './ModalPerfil';

function BarraSuperiorPanel() {
  const navigate = useNavigate();
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);
  const [usuario, setUsuario] = useState(null);  // ← Estado para el usuario

  // Función para cargar usuario desde localStorage
  const cargarUsuario = () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  };

  // Cargar usuario al montar el componente
  useEffect(() => {
    cargarUsuario();
    
    // Escuchar cambios en localStorage (cuando se actualiza el perfil)
    const handleStorageChange = (e) => {
      if (e.key === 'usuario') {
        cargarUsuario();
      }
    };
    
    // También escuchar evento personalizado desde ModalPerfil
    const handleUsuarioActualizado = () => {
      cargarUsuario();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('usuarioActualizado', handleUsuarioActualizado);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('usuarioActualizado', handleUsuarioActualizado);
    };
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/');
  };

  const abrirModalPerfil = () => {
    setMostrarModalPerfil(true);
  };

  const cerrarModalPerfil = () => {
    setMostrarModalPerfil(false);
    // Recargar usuario por si hubo cambios en el perfil
    cargarUsuario();
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

          {/* ✅ Mostrar nombre real del usuario */}
          <div
            className="text-end"
            style={{ cursor: 'pointer' }}
            onClick={abrirModalPerfil}
          >
            <p className="mb-0 fw-semibold">
              {usuario ? usuario.nombre : 'Usuario'}
            </p>
            <small className="text-muted">Nivel constante</small>
          </div>

          {/* ✅ Mostrar inicial del nombre en el avatar */}
          <div
            className="avatar-panel"
            style={{ cursor: 'pointer' }}
            onClick={abrirModalPerfil}
          >
            {usuario ? usuario.nombre?.charAt(0)?.toUpperCase() : 'U'}
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