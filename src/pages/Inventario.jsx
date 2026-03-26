import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Inventario.css';

const Inventario = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    try {
      const response = await api.get('/obras/inventario');
      setDatos(response.data.data);
    } catch (error) {
      console.error("Error al cargar inventario", error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Control de Inventario</h1>
        <div className="action-bar">
          <button onClick={() => navigate('/obra/crear')} className="btn btn-primary">+ Nueva Obra</button>
          <button onClick={() => navigate('/lote/crear')} className="btn btn-secondary">+ Nuevo Lote</button>
        </div>
      </header>

      <div className="table-wrapper">
        {loading ? (
          <p className="loading-text">Cargando existencias...</p>
        ) : (
          <table className="minimal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Edición</th>
                <th>Plataforma</th>
                <th>Costo</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item) => (
                <tr key={item.id_lote}>
                  <td>{item.id_obra}</td>
                  <td className="bold">{item.titulo}</td>
                  <td>{item.edicion}</td>
                  <td><span className="badge">{item.plataforma}</span></td>
                  <td>${item.costo_unitario.toFixed(2)}</td>
                  <td className="price">${item.precio_unitario.toFixed(2)}</td>
                  <td className={item.stock < 10 ? 'low-stock' : ''}>{item.stock}</td>
                  <td className="row-actions">
                    <button onClick={() => navigate(`/obra/actualizar/${item.id_obra}`)} title="Editar Obra">✎ Obra</button>
                    <button onClick={() => navigate(`/lote/actualizar/${item.id_lote}`, { state: { lote: item } })} title="Editar Lote">⚙ Lote</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inventario;