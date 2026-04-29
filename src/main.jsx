import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/general.css';

// BYPASS TEMPORAL - Eliminar cuando el backend esté disponible
if (!localStorage.getItem('usuario')) {
  localStorage.setItem('usuario', JSON.stringify({
    _id: "dev-user-001",
    nombre: "Usuario Dev",
    email: "dev@test.com"
  }));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);