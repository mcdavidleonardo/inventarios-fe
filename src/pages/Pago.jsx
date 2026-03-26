import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Pago.css';

const Pago = () => {
  const { idLote } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [lote, setLote] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (location.state?.lote) {
      setLote(location.state.lote);
    } else {
      fetchLote();
    }
  }, [idLote]);

  const fetchLote = async () => {
    try {
      const res = await api.get('/lotes/disponibles');
      const encontrado = res.data.data.find(l => l.id_lote === parseInt(idLote));
      if (encontrado) setLote(encontrado);
      else navigate('/tienda');
    } catch (err) {
      navigate('/tienda');
    }
  };

  const totalPagar = lote ? (lote.precio * cantidad).toFixed(2) : 0;

  const handlePago = async (e) => {
    e.preventDefault();
    
    if (cantidad <= 0 || cantidad > lote.stock) {
      alert(`Cantidad no válida. Stock disponible: ${lote.stock}`);
      return;
    }

    setProcesando(true);
    try {
      // Servicio de venta
      const response = await api.post('/lotes/vender', {
        id_lote: lote.id_lote,
        cantidad: cantidad
      });

      alert(`Pago Exitoso\nComprobante Nro: ABC-${Math.floor(Math.random() * 90000) + 10000}\nTotal Pagado: $${totalPagar}`);
      navigate('/tienda');
    } catch (err) {
      alert("Error al procesar la venta: " + (err.response?.data?.message || "Servicio no disponible"));
    } finally {
      setProcesando(false);
    }
  };

  if (!lote) return <div className="loader">Cargando detalles de pago...</div>;

  return (
    <div className="pago-container">
      <div className="pago-card">
        <header className="pago-header">
          <h2>Finalizar Compra</h2>
          <button onClick={() => navigate('/tienda')} className="btn-cancelar">Volver</button>
        </header>

        <div className="pago-content">
          <div className="info-resumen">
            <div className="resumen-item">
              <label>ID Lote:</label> <span>{lote.id_lote}</span>
            </div>
            <div className="resumen-item">
              <label>Obra:</label> <span className="titulo-obra">{lote.titulo}</span>
            </div>
            <div className="resumen-item">
              <label>Edición:</label> <span>{lote.edicion}</span>
            </div>
            <div className="resumen-item">
              <label>Plataforma:</label> <span className="badge-pago">{lote.plataforma}</span>
            </div>
          </div>

          <form onSubmit={handlePago} className="pago-form">
            <div className="pago-grid">
              <div className="pago-field readonly">
                <label>Precio Unitario</label>
                <input type="text" value={`$${lote.precio.toFixed(2)}`} readOnly />
              </div>

              <div className="pago-field readonly">
                <label>Stock Disponible</label>
                <input type="text" value={`${lote.stock} unidades`} readOnly />
              </div>

              <div className="pago-field highlight">
                <label>Cantidad a Comprar</label>
                <input 
                  type="number" 
                  min="1" 
                  max={lote.stock} 
                  value={cantidad} 
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                  required 
                />
              </div>

              <div className="total-box">
                <label>Total a Pagar</label>
                <div className="total-amount">${totalPagar}</div>
              </div>
            </div>

            <button type="submit" className="btn-pagar" disabled={procesando || cantidad <= 0 || cantidad > lote.stock}>
              {procesando ? 'Procesando...' : 'Confirmar y Pagar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pago;