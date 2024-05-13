import { useState, useEffect, useRef } from "react";
import Div from "../../../../Components/Div";
import Logo from "../../../../Components/Logo";
import { fns } from "../../../../Functions";
import { useParams } from "react-router-dom";
import BlueBotton from "../../../../Components/BlueBotton";
import Predictive from "../../../../Components/Predictive";
import LabelSelect from "../../../../Components/LabelSelect";

function Cancelar() {
  const params = useParams();
  const [viaje, setViaje] = useState({});
  const [detalles, setDetalles] = useState([])
  const [motivos, setMotivos] = useState([])
  const [motivo, setMotivo] = useState('-1')
  const [agentes, setAgentes] = useState([])
  const [responsable, setResponsable] = useState('')
  const [responsableE, setResponsableE] = useState('')
  const divRef = useRef(null)
  useEffect(()=>{
    async function GetData(){
        const respuesta = await Promise.all([
          fns.GetData(`credito.cobranza/viajes/consulta?serie=${params['serie']}&folio=${params['folio']}`),
          fns.GetData(`credito.cobranza/viajes/CANCELACION/motivos`),
          fns.GetData('credito.cobranza/agentes/todos')
      ]);
        console.log(respuesta)
        if(respuesta[0]['mensaje']===undefined){
          setViaje(respuesta[0][0])
          setMotivos(respuesta[1])
          setAgentes(respuesta[2].map(item=>{
            return {...item, nombreUpper:item.nombre.toUpperCase()};
          }));
        }else alert(respuesta[0]['mensaje']);

    }
    GetData();
  },[])
  useEffect(()=>{
    async function getDets(){
      const dets = await Promise.all(viaje.detalles.map(async (detalle, index)=>{
        const real = await fns.GetData(`credito.cobranza/documento/${viaje.empresa}/${detalle.serie}/${detalle.folio}`)
        return <tr key={index}>
          <td>{index+1}</td>
          <td>{real.idCliente.nombre}</td>
          <td>{`${detalle.serie}-${detalle.folio}`}</td>
          <td>{detalle.destino}</td>
          <td>{detalle.direccion}</td>
          <td>{real.unidades}</td>
          <td></td>
          <td>{fns.moneyFormat(real.total)}</td>
          <td>{fns.moneyFormat(detalle.importe)}</td>
          <td>{detalle.observaciones}</td>
        </tr>
      }))
      setDetalles(dets)
    }
    if(viaje.detalles!==undefined)getDets()
  },[viaje])
  useEffect(()=>{
    fns.setStateE(responsable,agentes,'nombreUpper',setResponsableE)
  },[responsable])

  function getEncabezado(){
    const {origen, rfc} = fns.getDatosFiscales(viaje.empresa)
    
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
      <label className={style}>Viaje: {viaje.serie!==undefined?viaje.serie.serie:''}-{viaje.folio}</label>
      <br />
      <label className={`text-2xl ${viaje.estatus==='COMPLETADO'?'text-green-600':'text-cyan-800'} font-extrabold`}>
        {viaje.estatus}
      </label>
    </>
  }
  async function handdleSubmit(e){
    e.preventDefault()
    if(motivo==-1)alert('Debe seleccionar un motivo de cancelacion')
    else if(motivo==='otro'){
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const ventana = window.open(`${window.location.href}/crear/motivo/CANCELACION`,'_blank',`width=${Math.round(screenWidth*0.4)}, height=${screenHeight<1000?Math.round(screenHeight*0.6) :Math.round(screenHeight*0.457)}`)
      if(ventana)ventana.addEventListener('beforeunload', ()=>window.location.reload())
    }else{
      if(responsable==='')
        alert('Debe elegir un Responsable de la cancelacion')
      else{
        const respuesta = await fns.PostData(`credito.cobranza/viajes/cancelar/${viaje.serie.serie}/${viaje.folio}`,{
          motivo,
          responsable:responsableE['codigo']!==undefined?responsableE['codigo']:responsable
        })
        if(respuesta['mensaje']===undefined)alert(respuesta)
        else alert(respuesta['mensaje'])
      }
    }
  }
  if(viaje.estatus==='CANCELADO') return (
    <div>
      El viaje ya ha sido cancelado
    </div>
  )
  return (
    <form className='flex flex-col' onSubmit={handdleSubmit}>
      <div className={`flex flex-col items-center`}>
        <Logo custom='w-20'/>
        {getEncabezado()}
        <br />
        <Div>
          <LabelSelect text='Motivo:' list={[...motivos, {motivo:'otro'}]} value={motivo} fn={e=>setMotivo(e.target.value)} criterio='motivo'/>
          <span className="mx-4"/>
          <label className="flex flex-row">
            Responsable
            <span className="mx-1"/>
            <div ref={divRef}>
              <Predictive Parameter='nombreUpper'
              id={'responsable'} change={setResponsable} value={responsable} list = {agentes}
              fn={(e)=>{
                  divRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                  //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
              }}
              />
            </div>
          </label>
        </Div>
        <br />
        <BlueBotton text='Aceptar' fn={handdleSubmit}/>
        <br />
        <div className='flex flex-col items-start w-full pl-10'>
          <label>Domicilio de origen: {(()=>{
            const {dom} = fns.getDatosFiscales(viaje.empresa)
            return dom
          })()}</label>
          <span className='my-1'/>
          <label>Fecha de elaboracion: {fns.dateString(new Date(viaje.expedicion))}</label>
        </div>
        <br />
        <div className='flex flex-row w-full justify-between px-20'>
          <Div width='w-50 mx-1' height='h-5' orientation='flex-row' parent={true}>
            <Div custom={'text-start'}>
              <label>Chofer:</label>
              <label>Auxiliar:</label>
              <label>Auto:</label>
              <label>Placas:</label>
              <label>Gasolina de Salida:</label>
              <label>Gasolina de Llegada:</label>
            </Div>
            <Div custom={'text-start'}>
              <label >{viaje.chofer!==undefined?viaje.chofer.nombre:''}</label>
              <label >{(viaje.auxiliar!==undefined&&viaje.auxiliar!==null)?viaje.auxiliar.nombre:''}</label>
              <label >{viaje.vehiculo!==undefined?viaje.vehiculo.nombre:''}</label>
              <label >{viaje.vehiculo!==undefined?viaje.vehiculo.placas:''}</label>
              <label >{viaje.gasInicial}</label>
              <label >{viaje.gasFinal}</label>
            </Div>
          </Div>
          <Div width='w-50 mx-1' height='h-5' orientation='flex-row' parent={true}>
            <Div custom={'text-start'}>
              <label>Dias estimados:</label>
              <label>Observaciones de Salida:</label>
              <label>Observaciones de llegada:</label>
              <label>Cargas:</label>
            </Div>
            <Div custom={'text-start'}>
              <label >{viaje.dias}</label>
              <label >{viaje.observacionSalida}</label>
              <label >{viaje.observacionLlegada}</label>
              <label >{viaje.cargas}</label>
            </Div>
          </Div>
          <Div width='w-50 mx-1' height='h-5' orientation='flex-row' parent={true}>
            <Div custom={'text-start'}>
              <label>Kilometraje Inicial:</label>
              <label>Kilometraje Final:</label>
              <label>Fecha de Salida:</label>
              <label>Fecha de llegada:</label>
              <label>Hora de salida:</label>
              <label>Hora de llegada:</label>
              <label>Ruta:</label>
            </Div>
            <Div custom={'text-start'}>
                <label >{viaje.kmInicial}</label>
                <label >{viaje.kmFinal}</label>
                <label >{fns.dateString(new Date(viaje.fechaInicio))}</label>
                <label >{fns.dateString(new Date(viaje.fechaFin))}</label>
                <label >{viaje.horaInicio}</label>
                <label >{viaje.horaFin}</label>
                <label >{viaje.nombreRuta}</label>
            </Div>
          </Div>
        </div>
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
                {detalles}
            </tbody>
        </table>
        <br />
      </div>
      <br />
    </form>
  )
}

export default Cancelar