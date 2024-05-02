import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fns } from '../../../../../Functions';

import "./FSR.css";

function CerrarFacruna() {
  //parametros url
  const params = useParams();
  console.log(params);
  //Variables a utilizar
  const [factura, setFactura] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  
  async function handdleSubmit(e) {
    e.preventDefault()
      const respuesta = await fns.PostData(`credito.cobranza/viajes/factura/cerrar/${params.serie}/${params.folio}`, {
        motivo,
      })
      if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje'])
      else alert(respuesta)
  }

  useEffect(()=>{
    async function getFac(){
      const respuesta = await fns.GetData(`credito.cobranza/viajes/facturas/sin_relacion${params.concepto==='revisado'?'/cerradas':''}?serie=${params.serie}&folio=${params.folio}`);
      console.log(respuesta);
      setFactura(respuesta[0])
      setMotivo(respuesta[0].motivo)
    }
    getFac();
  }, [])
  //Validacion de campos
  async function handleValidation(){
    if (!motivo.trim()) {
      setError('Por favor, complete todos los campos');
    } else {
      //Envio de datos
      const respuesta = await fns.PostData(`credito.cobranza/viajes/factura/cerrar/${params.serie}/${params.folio}`, {
        motivo,
      })
      if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje'])
      else alert(respuesta)    }
  };

  return (
    <div className="container mx-auto m-7">
      <div className="form-container m-7">
        <div className="form-group mt-2">
          <label htmlFor="nombre">Nombre:</label>
          <label>{`${factura!==''?factura.nombre:''}`}</label>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="factura">Factura:</label>
          <label>{`${factura.serie}-${factura.folio}`}</label>
        </div>
      </div>
      <div className="text-area-container justify-center mx-7">
        <label htmlFor="motivo">Motivo:</label>
        <textarea
          id="motivo"
          rows="4"
          placeholder="Escribe aquí..."
          className="w-full p-2 border rounded-md resize-none"
          onChange={(e) => { setMotivo(e.target.value)} } 
          value={motivo}
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