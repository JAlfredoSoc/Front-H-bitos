import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaPrincipal from '../pages/PaginaPrincipal';
import PanelPrincipal from '../pages/PanelPrincipal';

function EnrutadorPrincipal() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/panel-principal" element={<PanelPrincipal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default EnrutadorPrincipal;