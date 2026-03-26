import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./TiendaObras.css";

const TiendaObras = () => {
  const [obras, setObras] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const response = await api.get("/lotes/disponibles");
      setObras(response.data.data);
    } catch (error) {
      console.error("Error al cargar tienda", error);
    } finally {
      setLoading(false);
    }
  };

  const obrasFiltradas = obras.filter(
    (obra) =>
      obra.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      obra.autor.toLowerCase().includes(filtro.toLowerCase()),
  );

  if (loading)
    return <div className="loader">Cargando catálogo de obras...</div>;

  return (
    <div className="tienda-container">
      <header className="tienda-header">
        <div className="header-content">
          <h1>Catálogo de Obras</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <button
          className="btn-logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      {obrasFiltradas.length === 0 && !loading ? (
        <div className="no-results">
          <p>No se encontraron obras que coincidan con "{filtro}"</p>
        </div>
      ) : (
        <div className="obras-grid">
          {obrasFiltradas.map((obra) => (
            <div className="obra-card" key={obra.id_lote}>
              <div className="card-image">
                <img
                  src={`https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=500`}
                  alt={obra.titulo}
                />
                <span className="badge-plataforma">{obra.plataforma}</span>
              </div>

              <div className="card-body">
                <div className="card-header-info">
                  <span className="obra-genero">
                    {obra.genero || "Literatura"}
                  </span>
                  <span className="obra-clasificacion">
                    {obra.clasificacion}
                  </span>
                </div>

                <h3 className="obra-titulo">{obra.titulo}</h3>
                <p className="obra-autor">
                  por <span>{obra.autor || "Autor ITQ"}</span>
                </p>
                <p className="obra-edicion">{obra.edicion}</p>

                <div className="card-footer">
                  <div className="price-tag">
                    <span className="currency">$</span>
                    <span className="amount">{obra.precio.toFixed(2)}</span>
                  </div>
                  <div className="stock-info">{obra.stock} disponibles</div>
                </div>

                <button
                  className="btn-comprar"
                  onClick={() => navigate(`/pago/${obra.id_lote}`)}
                  disabled={obra.stock <= 0}
                >
                  {obra.stock > 0 ? "Comprar Ahora" : "Agotado"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TiendaObras;
