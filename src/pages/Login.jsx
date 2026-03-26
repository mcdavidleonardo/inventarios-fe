import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, clave });
      
      if (response.data.status === 'ok') {
        const token = response.data.access_token;
        localStorage.setItem('access_token', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;

        if (rol === 'R01') {
          navigate('/inventario');
        } else if (rol === 'R02') {
          navigate('/tienda');
        } else {
          setError('Rol no definido.');
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error de conexión con el servidor';
      setError(message);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">Librería ITQ</h2>
        <p className="login-subtitle">Ingrese sus credenciales para continuar</p>
        
        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="ejemplo@itq.edu.ec" 
            required 
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            value={clave} 
            onChange={(e) => setClave(e.target.value)} 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" className="login-button">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;