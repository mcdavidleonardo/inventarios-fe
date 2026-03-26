import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Formularios.css';

const NuevaObra = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id_autor: '', id_carrera: '', titulo: '', 
    id_genero: '', id_estado: '', id_clasificacion: ''
  });

  // Estados para los combos
  const [combos, setCombos] = useState({
    autores: [], carreras: [], generos: [], estados: [], clasificaciones: []
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [aut, car, gen, est, cla] = await Promise.all([
        api.get('/catalogos/AUT'),
        api.get('/catalogos/CAR'),
        api.get('/catalogos/GEN'),
        api.get('/catalogos/EOB'),
        api.get('/catalogos/RAN')
      ]);

      setCombos({
        autores: aut.data,
        carreras: car.data,
        generos: gen.data,
        estados: est.data,
        clasificaciones: cla.data
      });
    } catch (err) {
      console.error("Error cargando catálogos", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/obras/crear', form);
      alert("Obra creada con éxito");
      navigate('/inventario');
    } catch (err) {
      alert("Error al crear obra: " + err.response?.data?.message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <header className="form-header">
          <h2>Nueva Obra</h2>
          <button onClick={() => navigate('/inventario')} className="btn-back">Volver</button>
        </header>

        <form onSubmit={handleSubmit} className="minimal-form">
          <div className="form-grid">
            <div className="field">
              <label>Título de la Obra</label>
              <input type="text" required value={form.titulo} 
                onChange={e => setForm({...form, titulo: e.target.value})} />
            </div>

            <div className="field">
              <label>Autor</label>
              <select required value={form.id_autor} onChange={e => setForm({...form, id_autor: e.target.value})}>
                <option value="">Seleccione...</option>
                {combos.autores.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Carrera</label>
              <select required value={form.id_carrera} onChange={e => setForm({...form, id_carrera: e.target.value})}>
                <option value="">Seleccione...</option>
                {combos.carreras.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Género</label>
              <select required value={form.id_genero} onChange={e => setForm({...form, id_genero: e.target.value})}>
                <option value="">Seleccione...</option>
                {combos.generos.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Estado</label>
              <select required value={form.id_estado} onChange={e => setForm({...form, id_estado: e.target.value})}>
                <option value="">Seleccione...</option>
                {combos.estados.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Clasificación (Rango)</label>
              <select required value={form.id_clasificacion} onChange={e => setForm({...form, id_clasificacion: e.target.value})}>
                <option value="">Seleccione...</option>
                {combos.clasificaciones.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-save">Registrar Obra</button>
        </form>
      </div>
    </div>
  );
};

export default NuevaObra;