// src/components/dashboard/TarjetaSugerencia.jsx
import {
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiPlus,
  FiTag
} from 'react-icons/fi';

function obtenerClaseCategoria(categoria) {
  const clases = {};

  // Extraer el nombre de forma simple
  const nombreCategoria = categoria?.nombreCategoria || categoria?.nombre || categoria || '';
  
  return clases[nombreCategoria] || 'categoria-general';
}

function formatearFecha(fecha) {
  if (!fecha) return 'Reciente';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function TarjetaSugerencia({ sugerencia, alSeleccionar }) {
  // Obtener el nombre de la categoría correctamente
  const obtenerNombreCategoria = () => {
    if (!sugerencia.categoria) return 'General';
    
    if (typeof sugerencia.categoria === 'string') {
      return sugerencia.categoria;
    }
    
    // Si es objeto, buscar nombreCategoria o nombre
    return sugerencia.categoria.nombreCategoria || 
           sugerencia.categoria.nombre || 
           'General';
  };
  
  const nombreCategoria = obtenerNombreCategoria();
  const claseCategoria = obtenerClaseCategoria(sugerencia.categoria);

  return (
    <div className={`card tarjeta-habito tarjeta-habito-color ${claseCategoria} h-100`}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className={`etiqueta-categoria ${claseCategoria}`}>
            <FiTag className="me-1" size={12} />
            {nombreCategoria}
          </span>
          <small className="text-muted d-flex align-items-center gap-1">
            <FiCalendar size={12} />
            {formatearFecha(sugerencia.fechaCreacion || sugerencia.createdAt)}
          </small>
        </div>

        <h5 className="fw-bold mb-2">{sugerencia.nombre}</h5>
        <p className="text-muted mb-3">{sugerencia.descripcion}</p>

        <div className="mt-auto">
          <button
            className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 px-4 w-100"
            onClick={() => alSeleccionar(sugerencia)}
          >
            <FiPlus />
            <span>Seleccionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaSugerencia;