import { useState, useEffect } from 'react';
import { fns } from '../../../../Functions';
import BlueBotton from '../../../../Components/BlueBotton';
import Fraccion from '../../../../Components/Fraccion';
import Div from '../../../../Components/Div';
import { useParams } from 'react-router-dom';
import Logo from '../../../../Components/Logo';
import Input from '../../../../Components/Input';
import AbrirRow from './AbrirRow';

function Abrir() {
  const params = useParams();
  //reiniciar
  const [viaje, setViaje] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [empresa, setEmpresa] = useState('');
  const [serie, setSerie] = useState('');
  const [folio, setFolio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [chofer, setChofer] = useState('');
  const [auxiliar, setAuxiliar] = useState('');
  const [vehiculo, setVehiculo] = useState('');  
  const [ruta, setRuta] = useState('');
  const [fechaI, setFechaI] = useState('');
  const [fechaF, setFechaF] = useState('');
  const [horaF, setHoraF] = useState('');
  const [placas, setPlacas] = useState('');
  const [gas, setGas] = useState('');
  const [KM, setKM] = useState('');
  const [cargas, setCargas] = useState('');
  
  const formatCol = 'flex flex-col mr-3 justify-around';
  const formatColEnd = `${formatCol} items-end`
  const formatColStart = `${formatCol} items-start`
  useEffect(()=>{
    async function GetData(){
        const respuesta = await fns.GetData(`credito.cobranza/viajes/consulta?serie=${params['serie']}&folio=${params['folio']}`);
        console.log(respuesta)
        if(respuesta[0]['mensaje']===undefined){
          setViaje(respuesta[0])
        }else alert(respuesta['mensaje']);

    }
    GetData();
  },[])
  useEffect(()=>{
    async function setData(){
        const detalles = await Promise.all(viaje.detalles.map(async (detalle, index)=>{
            const real = await fns.GetData(`credito.cobranza/documento/${viaje.empresa}/${detalle.serie}/${detalle.folio}`)
            if(real.idCliente===undefined){
              console.log(detalle)
              console.log(real)
            }
            return {
                serie:detalle.serie,
                folio:detalle.folio,
                rs:real.idCliente.nombre,
                destino:detalle.destino,
                domicilio:detalle.direccion,
                unidades:real.unidades,
                peso:'',
                total:real.total,
                observacion:detalle.observaciones
            }
        }))
        setDocumentos(detalles)
    }
    if(Object.keys(viaje).length>0){
      console.log(viaje)
      console.log(viaje.chofer)
      setChofer(viaje.chofer.nombre);
      setEmpresa(viaje.empresa)
      setAuxiliar(viaje.auxiliar!==null?viaje.auxiliar.nombre:'')
      setPlacas(viaje.vehiculo.placas)
      setVehiculo(`${viaje.vehiculo.codigo}-${viaje.vehiculo.nombre}`)
      setRuta(viaje.nombreRuta)
      setKM(viaje.kmInicial)
      setSerie(viaje.serie.serie)
      setFolio(viaje.folio)
      setFechaI(fns.dateString(new Date(viaje.expedicion)))
      setData()
    }
  },[viaje])
  
  function getRows(){
    return documentos.map((doc, index)=>{
        doc.pago = doc.total;
        return <AbrirRow documento={doc} index={index} key={index}/>
    })
  }
  
  function getEncabezado(){
    const {origen, rfc} = fns.getDatosFiscales(empresa)
    
    const style = 'text-2xl text-cyan-800 font-extrabold'
    return <>
      <label className={style}>
        EMPRESA: {origen}
      </label>
      <br />
      <label className={style}>
        RFC: {rfc}
      </label>
      <br />
      <label className='text-2xl text-cyan-800 font-extrabold'>Viaje: {serie}-{folio}</label>
    </>
  }
  async function handdleSubmit(e){
    e.preventDefault();
    const errores = [];
    if(fechaF==='')errores.push('Debe haber una fecha de llegada');
    if(gas==='')errores.push('Debe haber un gas de llegada')
    if(horaF==='')errores.push('Debe haber un una hora de llegada del viaje');
    if(cargas==='')errores.push('Debe haber un numero de cargas de gasolina (0 es valido)');
    if(errores.length===0){
        const respuesta = await fns.PostData(`credito.cobranza/viajes/completar/${serie}/${folio}`,{
            fechaFin:fechaF,
            horaFin:horaF,
            gasFinal:gas,
            observacionLlegada:observaciones,
            kmFinal:parseInt(KM),
            documentos:documentos.map(doc=>{
                return {...doc, importe:fns.fixed2(doc['pago'])}
            }),
            cargas:parseFloat(cargas),
            
        })
        if(respuesta['mensaje']===undefined)
            alert(respuesta)
        else alert(respuesta['mensaje'])
        
    }else fns.alertar(errores);
  }
  if(viaje.estatus==='CANCELADO') return (
    <div>
      El viaje ya ha sido cancelado
    </div>
  )
  if(viaje.estatus==='COMPLETADO') return (
    <div>
      El viaje ya ha sido completado
    </div>
  )
  return (
    <form className='flex flex-col' onSubmit={handdleSubmit}>
      <div className={`flex flex-col ${empresa==='-1'?'hidden':'visible'} items-center`}>
        <Logo custom='w-20'/>
        {getEncabezado()}
        <br />
        <div className='flex flex-col items-start w-full pl-10'>
          <label>Domicilio de origen: {(()=>{
            const {dom} = fns.getDatosFiscales(empresa)
            return dom
          })()}</label>
          <span className='my-1'/>
          <label>Fecha de elaboracion: {fechaI}</label>
        </div>
        <br />
        <div className='flex flex-row w-full justify-between px-20'>
          <div className='flex flex-row'>
          <Div width='w-50 mx-1' height='h-10' orientation='flex-row' parent={true}>
            <Div custom={'text-end'}>
              <label>Chofer:</label>
              <label>Auxiliar:</label>
              <label>Auto:</label>
              <label>Placas:</label>
              <label>Gasolina de llegada:</label>
            </Div>
            <Div custom={'text-start'}>
              <label >{chofer}</label>
              <label >{auxiliar}</label>
              <label >{vehiculo}</label>
                <label >{placas}</label>
              <Fraccion value={gas} change={setGas}/>
            </Div>
          </Div>
          </div>
          <div className='flex flex-row'>
            <div className={`${formatColEnd}`}>
              <label>Kilometraje:</label>
              <label>Fecha de llegada:</label>
              <label>Hora de llegada:</label>
              <label>Ruta:</label>
            </div>
            <div className={`${formatColStart}`}>
                <Input type='number' value={KM} change={e=>setKM(e.target.value)}/>
              
                <Input custom='w-full' type='date'value={fechaF} change={e=>setFechaF(e.target.value)}/>
              
                <Input custom='w-full' type='time' value={horaF} change={e=>setHoraF(e.target.value)}/>
              
                {ruta}
            </div>
          </div>
        </div>
        <label>
          Dias estimados:
          <span className='mx-1'/>
          {viaje.dias}
        </label>
        <br />
        <br />
        <label>
          Observaciones:
          <span className='mx-1'/>
          <Input type="text" value={observaciones} change={e=>setObservaciones(e.target.value)} custom='w-1/2'/>
        </label>
        <br />
        <label>
          Cargas:
          <span className='mx-1'/>
          <Input type="number" value={cargas} change={e=>setCargas(e.target.value)} custom='w-1/2'/>
        </label>
        <br />
        <table>
            <thead>
                <tr className="bg-blue-950 text-white text-xs">
                    <th>No.</th>
                    <th>Razon Social</th>
                    <th>Factura</th>
                    <th>Destino</th>
                    <th>Domicilio</th>
                    <th>Total de Productos</th>
                    <th>Peso Aproximado</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
                {getRows()}
            </tbody>
        </table>
        <br />
      </div>
      <BlueBotton text='Aceptar' fn={handdleSubmit}/>
      <br />
    </form>
  )
}

export default Abrir
//