import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Formularios.css';

const NuevoLote = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id_obra: '', edicion: '', id_plataforma: '', 
    costo_unitario: '', stock: ''
  });

  const [combos, setCombos] = useState({ obras: [], plataformas: [] });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [obr, pla] = await Promise.all([
        api.get('/catalogos/OBR'),
        api.get('/catalogos/PLA')
      ]);
      setCombos({ obras: obr.data, plataformas: pla.data });
    } catch (err) {
      console.error("Error al cargar catálogos", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(form.costo_unitario) <= 0) {
      alert("El costo unitario debe ser mayor a 0");
      return;
    }
    if (parseInt(form.stock) <= 0) {
      alert("El stock inicial debe ser mayor a 0");
      return;
    }

    try {
      await api.post('/lotes/crear', form);
      alert("Lote creado exitosamente.");
      navigate('/inventario');
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <header className="form-header">
          <h2>Nuevo Lote de Obra</h2>
          <button onClick={() => navigate('/inventario')} className="btn-back">Volver</button>
        </header>

        <form onSubmit={handleSubmit} className="minimal-form">
          <div className="form-grid">
            <div className="field">
              <label>Obra / Libro</label>
              <select required value={form.id_obra} onChange={e => setForm({...form, id_obra: e.target.value})}>
                <option value="">Seleccione la obra...</option>
                {combos.obras.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Edición</label>
              <input type="text" placeholder="Ej: Primera Edición 2026" required 
                value={form.edicion} onChange={e => setForm({...form, edicion: e.target.value})} />
            </div>

            <div className="field">
              <label>Plataforma de Venta</label>
              <select required value={form.id_plataforma} onChange={e => setForm({...form, id_plataforma: e.target.value})}>
                <option value="">Seleccione plataforma...</option>
                {combos.plataformas.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Costo Unitario ($)</label>
              <input type="number" step="0.01" min="0.01" required 
                value={form.costo_unitario} onChange={e => setForm({...form, costo_unitario: e.target.value})} />
            </div>

            <div className="field">
              <label>Stock Inicial (Unidades)</label>
              <input type="number" min="1" required 
                value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-save">Crear Lote</button>
        </form>
      </div>
    </div>
  );
};

export default NuevoLote;