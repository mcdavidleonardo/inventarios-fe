import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Formularios.css';

const ActualizarLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    id_lote: '',
    id_obra: '',
    titulo: '',
    edicion: '',
    costo_unitario: '',
    stock: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosLote();
  }, [id]);

  const cargarDatosLote = async () => {
    try {
      const dataOriginal = location.state?.lote;

      if (dataOriginal) {
        setForm({
          id_lote: dataOriginal.id_lote,
          id_obra: dataOriginal.id_obra,
          titulo: dataOriginal.titulo,
          edicion: dataOriginal.edicion,
          costo_unitario: dataOriginal.costo_unitario,
          stock: dataOriginal.stock
        });
      } else {
        const res = await api.get('/obras/inventario');
        const loteActual = res.data.data.find(l => l.id_lote === parseInt(id));
        
        if (loteActual) {
          setForm({
            id_lote: loteActual.id_lote,
            id_obra: loteActual.id_obra,
            titulo: loteActual.titulo,
            edicion: loteActual.edicion,
            costo_unitario: loteActual.costo_unitario,
            stock: loteActual.stock
          });
        }
      }
    } catch (err) {
      console.error("Error al recuperar lote", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (parseFloat(form.costo_unitario) <= 0 || parseInt(form.stock) < 0) {
      alert("Ingrese valores válidos (Costo > 0, Stock >= 0)");
      return;
    }

    try {
      await api.put(`/lotes/actualizar/${id}`, {
        costo_unitario: form.costo_unitario,
        stock: form.stock
      });
      
      alert("Lote actualizado con éxito.");
      navigate('/inventario');
    } catch (err) {
      alert("Error al actualizar: " + err.response?.data?.message);
    }
  };

  if (loading) return <div className="form-container"><p>Cargando datos del lote...</p></div>;

  return (
    <div className="form-container">
      <div className="form-card">
        <header className="form-header">
          <h2>Actualizar Lote</h2>
          <button onClick={() => navigate('/inventario')} className="btn-back">Volver</button>
        </header>

        <form onSubmit={handleUpdate} className="minimal-form">
          <div className="form-grid">
            
            <div className="field readonly">
              <label>ID Lote</label>
              <input type="text" value={form.id_lote} readOnly />
            </div>

            <div className="field readonly">
              <label>ID Obra</label>
              <input type="text" value={form.id_obra} readOnly />
            </div>

            <div className="field readonly" style={{ gridColumn: 'span 2' }}>
              <label>Título de la Obra</label>
              <input type="text" value={form.titulo} readOnly />
            </div>

            <div className="field readonly">
              <label>Edición</label>
              <input type="text" value={form.edicion} readOnly />
            </div>

            <div className="field highlight">
              <label>Costo Unitario ($)</label>
              <input 
                type="number" 
                step="0.01" 
                required 
                value={form.costo_unitario} 
                onChange={e => setForm({...form, costo_unitario: e.target.value})} 
              />
            </div>

            <div className="field highlight">
              <label>Aumentar Stock</label>
              <input 
                type="number" 
                required 
                value={form.stock} 
                onChange={e => setForm({...form, stock: e.target.value})} 
              />
            </div>
          </div>

          <button type="submit" className="btn-save">Actualizar Inventario</button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarLote;