import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Formularios.css';

const ActualizarObra = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    id_obra: '', titulo: '', id_estado: '', id_clasificacion: ''
  });

  const [combos, setCombos] = useState({ estados: [], clasificaciones: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [est, cla, obraRes] = await Promise.all([
        api.get('/catalogos/EOB'),
        api.get('/catalogos/RAN'),
        api.get(`/obras/${id}`)
      ]);

      setCombos({ estados: est.data, clasificaciones: cla.data });
      
      const obra = obraRes.data;
      setForm({
        id_obra: obra.id_obra,
        titulo: obra.titulo,
        id_estado: obra.id_estado,
        id_clasificacion: obra.id_clasificacion
      });
    } catch (err) {
      alert("Error al recuperar datos de la obra");
      navigate('/inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/obras/actualizar/${id}`, {
        id_estado: form.id_estado,
        id_clasificacion: form.id_clasificacion
      });
      alert("Obra actualizada correctamente");
      navigate('/inventario');
    } catch (err) {
      alert("Error al actualizar: " + err.response?.data?.message);
    }
  };

  if (loading) return <div className="form-container"><p>Cargando información...</p></div>;

  return (
    <div className="form-container">
      <div className="form-card">
        <header className="form-header">
          <h2>Actualizar Obra</h2>
          <button onClick={() => navigate('/inventario')} className="btn-back">Volver</button>
        </header>

        <form onSubmit={handleUpdate} className="minimal-form">
          <div className="form-grid">
            
            <div className="field readonly">
              <label>ID Obra</label>
              <input type="text" value={form.id_obra} readOnly />
            </div>

            <div className="field readonly">
              <label>Título</label>
              <input type="text" value={form.titulo} readOnly />
            </div>

            <div className="field">
              <label>Estado</label>
              <select 
                required 
                value={form.id_estado} 
                onChange={e => setForm({...form, id_estado: e.target.value})}
              >
                {combos.estados.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Clasificación</label>
              <select 
                required 
                value={form.id_clasificacion} 
                onChange={e => setForm({...form, id_clasificacion: e.target.value})}
              >
                {combos.clasificaciones.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

          </div>

          <button type="submit" className="btn-save">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarObra;