import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {GiRotaryPhone, } from 'react-icons/gi';
import {RiWhatsappLine} from 'react-icons/ri';
import * as Functions from '../../../../Functions.js';
import Input from "../../../../Components/Input.jsx";
import IconInput from "../../../../Components/IconInput.jsx";
import InputCantidad from '../../.././../Components/InputCantidad.jsx'

function Dcoumento() {
  const params = useParams();
  //console.log(params['serie'][params['serie'].length-1]);
  const cliente = useRef({});
  const correoRef = useRef(null);
  const [tel1, setTel1] = useState('');
  const [clasfificaciones, setClasificaciones] = useState([]);
  const [tel2, setTel2] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrarecivo, setContrarecivo] = useState('');
  const [diasCredito, setDiasCredito] = useState(0);
  const [limiteCredito, setLimiteCredito] = useState(0);
  const [formaPago, setFormaPago] = useState('');
  const [observacion, setObservacion] = useState('');
  const [originalObs, setOriginal] = useState('');
  const [nombre, SetNombre] = useState('');
  const [resablecido, setRestablecido] = useState(0);
  const [clasificacionActiva, setClasificacionActiva] = useState('');
  const [activo, setActivo] = useState(false);
  function makeUrl(){
    let url=`/credito.cobranza/documento/corp/${params['serie']}/${params['folio']}`;
    console.log(url);
    return url
}
useEffect(()=>{
    async function getFactura(){
      console.log(Functions.getSesion())
      const respuesta = await Functions.GetData(makeUrl());
      console.log(respuesta);
      return respuesta
    }
    async function getData(){
      const obj = await getFactura();
      cliente.current = obj['idCliente'];
      //console.log(cliente.current['NOMBRE']);
      setCorreo(cliente.current['mail1']);
      setContrarecivo(cliente.current['txt4']);
      setDiasCredito(cliente.current['diasCreditoCliente']);
      setLimiteCredito(cliente.current['limiteCreditoCliente']);
      setFormaPago(cliente.current['txt5']);
      setTel1(cliente.current['domicilios'][0]['tel1']);
      setTel2(cliente.current['domicilios'][0]['tel2']);
      SetNombre(cliente.current['nombre']);
      cliente.current['estatus']==0?setActivo(false):setActivo(true);
      setObservacion(obj['observacion']!==undefined?obj['observacion']:'');
      setOriginal(obj['observacion']!==undefined?obj['observacion']:'');

      const clasificaciones = await Functions.GetData('/clientes/clasificaciones/corp');
      console.log(clasificaciones)
      setClasificaciones(clasificaciones.sort((item1,item2)=>{
        return item1.codigo.localeCompare(item2.codigo)
      }))
    }
    getData();
  },[]);

  useEffect(()=>{
    setClasificacionCliente();
  },[clasfificaciones])

  useEffect(()=>{
    if(resablecido!=0){
      handleSubmit(resablecido);
      setRestablecido(0);
    }
  },[resablecido]);

  async function handleSubmit(e){
    e.preventDefault();
    if(correo!=cliente.current['mail1']){
      if(!correoRef.current.checkValidity()){
        alert('correo no valido');
        return;
      }
    }
    let url=`/credito.cobranza/modificar/corp/${params['serie']}/${params['folio']}`;
    const respuesta = await Functions.PostData(url,{
      tel1,
      tel2,
      correo,
      contrarecivo,
      formaPago,
      observacion, 
      clasificacion:clasificacionActiva, 
      activo,
      limiteCredito:parseFloat(limiteCredito),
      diasCredito:parseInt(diasCredito)
    });
    console.log(respuesta);
    if(respuesta['mensaje'] !== undefined)alert(respuesta['mensaje']);
    else alert(respuesta)
  }
  
  function setClasificacionCliente(){
    for(const codigo in clasfificaciones){
      if(clasfificaciones[codigo]['codigo']==cliente.current['clasificacionClienteReal']){
        setClasificacionActiva(clasfificaciones[codigo]['codigo']);
        break;
      }
    }
  }
  function restablecer(e){
    setCorreo(cliente.current['mail1']);
    setContrarecivo(cliente.current['txt4']);
    setDiasCredito(cliente.current['diasCreditoCliente']);
    setLimiteCredito(cliente.current['limiteCreditoCliente']);
    setFormaPago(cliente.current['txt5']);
    setTel1(cliente.current['domicilios'][0]['tel1']);
    setTel2(cliente.current['domicilios'][0]['tel2']);
    SetNombre(cliente.current['nombre']);
    cliente.current['estatus']==0?setActivo(false):setActivo(true);
    setClasificacionCliente()
    setObservacion(originalObs);
    setRestablecido(e);
  }

  function validateNumber(key, callback){
    if(key.nativeEvent.data>='0'&&key.nativeEvent.data<='9'||key.nativeEvent.data=='-'){
      callback(key.target.value);
    }
  }
  return (
    <form action="" onSubmit={handleSubmit}>
      <div className=" flex flex-col justify-center">
        <div className=" flex flex-col justify-center">
          <label className=" text-xl">{`FACTURA ${params['serie']}-${params['folio']} a nombre de ${nombre}`}</label>
          <label className=" text-lg"> CODIGO DEL CLIENTE: <span className="text-xl font-bold">{`${cliente.current['codigo']}`}</span></label>
          <label className=" text-lg"> CLASIFICACION DEL CLIENTE: 
            <select name="" id="clasfificacion" className="text-xl font-bold" onChange={e=>setClasificacionActiva(e.target.value)} value={clasificacionActiva}>
              {clasfificaciones.map((item,index)=>{
                return <option key={index} value={item.codigo}>
                  {`${item.codigo}-${item.nombre}`}
                </option>
              })}
            </select>
          </label>
          <div className=" flex flex-row">
            <label className="mr-2">ACTIVO: </label> 
            <input type="checkbox" checked={activo} onChange={e=>{setActivo(e.target.checked)}}/>
          </div>
        </div>
        <div className="flex flex-row justify-around">
          <div className=" flex flex-col">
            <br />
            <label>Telefonos:</label>
            <div className="my-1">
              <IconInput icon={<GiRotaryPhone size={25}/>} id='tel1' placeholder='Telefono' value={tel1} change={e=>{validateNumber(e,setTel1)}}/>
            </div>
            <div className="my-1 ">
              <IconInput icon={<RiWhatsappLine size={25}/>} id='tel2' placeholder='Telefono' value={tel2} change={e=>{validateNumber(e,setTel2)}}/>
            </div>
            <label className=" h-7"> Correo:</label>
            <Input customRef={correoRef} id='correo' type='email' value={correo} change={e=>{setCorreo(e.target.value)}}/> 
            <label className=" h-7"> Limite de credito:</label>
            <InputCantidad value={limiteCredito} fn={(value)=>{setLimiteCredito(value)}} custom={'px-2 rounded-xl border-solid border-2 border-black h-7'}/> 
            <br />
          </div>
          <div className=" flex flex-col">
            <br />
            <label className="m-1">Forma en que paga el cliente:</label>
            <Input id='formaPago' value={formaPago} change={e=>{setFormaPago(e.target.value)}}/> 
            <label className="m-1">Días para llelet contra-recibo: </label>
            <Input id='contrarecivo' value={contrarecivo} change={e=>{setContrarecivo(e.target.value)}}/>
            <label className=" h-7"> Dias de credito:</label>
            <Input type={'number'} value={diasCredito} change={(e)=>{setDiasCredito(e.target.value)}} custom={'px-2 rounded-xl border-solid border-2 border-black h-7'}/> 
            <div>
              <button 
              className=" bg-blue-800 text-white font-sans rounded-xl w-24 h-7 hover:text-blue-800 hover:bg-white hover:border-blue-800 hover:border-2 my-2 self-center"
              type="submit"
              onClick={handleSubmit}
              >
                Guardar
              </button>
              {' '}
              <button 
              className=" bg-blue-800 text-white font-sans rounded-xl w-24 h-7 hover:text-blue-800 hover:bg-white hover:border-blue-800 hover:border-2 my-2 self-center"
              type="button"
              onClick={restablecer}
              >
                Restablecer
              </button>
            </div>
          </div>
          <br />
        </div>      
        <label className=" self-center" htmlFor="">Observaciones:</label>
        <textarea className="mx-2 border-solid border-2 border-black px-1" 
          id="Observacion" cols="30" rows="3" value={observacion} onChange={e=>setObservacion(e.target.value)}></textarea>
      </div>
    </form>
  )
}

export default Dcoumento
