import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventario from './pages/Inventario';
import NuevaObra from './pages/NuevaObra';
import NuevoLote from './pages/NuevoLote';
import ActualizarObra from './pages/ActualizarObra';
import ActualizarLote from './pages/ActualizarLote';
import TiendaObras from './pages/TiendaObras';
import Pago from './pages/Pago';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/inventario" element={<Inventario />} />
        <Route path="/obra/crear" element={<NuevaObra />} />
        <Route path="/obra/actualizar/:id" element={<ActualizarObra />} />
        <Route path="/lote/crear" element={<NuevoLote />} />
        <Route path="/lote/actualizar/:id" element={<ActualizarLote />} />

        <Route path="/tienda" element={<TiendaObras />} />
        <Route path="/pago/:idLote" element={<Pago />} />
      </Routes>
    </Router>
  );
}

export default App;