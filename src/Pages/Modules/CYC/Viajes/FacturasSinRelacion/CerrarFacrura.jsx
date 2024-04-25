
import React, { useState } from 'react';
import "./FSR.css";

function CerrarFacruna() {
  //Variables a utilizar
  const [nombre, setNombre] = useState('');
  const [factura, setFactura] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  //Validacion de campos
  const handleValidation = () => {
    if (!nombre.trim() || !factura.trim() || !motivo.trim()) {
      setError('Por favor, complete todos los campos');
    } else {
      setError('Datos enviados');
      //Envio de datos
    }
  };

  return (
    <div className="container mx-auto m-7">
      <div className="form-container m-7">
        <div className="form-group mt-2">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="factura">Factura:</label>
          <input
            type="text"
            id="factura"
            value={factura}
            onChange={(e) => setFactura(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>
      <div className="text-area-container justify-center mx-7">
        <label htmlFor="motivo">Motivo:</label>
        <textarea
          id="motivo"
          rows="4"
          placeholder="Escribe aquí..."
          className="w-full p-2 border rounded-md resize-none"
        />
      </div>
  
      <button onClick={handleValidation} className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600">
        Validar
      </button>
      {error && <p className="error text-red-500">{error}</p>}
    </div>
  );
}

export default CerrarFacruna;
