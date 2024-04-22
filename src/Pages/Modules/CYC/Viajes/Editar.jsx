import { useState, useEffect, useRef } from 'react';
import { fns } from '../../../../Functions';
import BlueBotton from '../../../../Components/BlueBotton';
import Fraccion from '../../../../Components/Fraccion';
import Div from '../../../../Components/Div';
import { useParams } from 'react-router-dom';
import Logo from '../../../../Components/Logo';
import Input from '../../../../Components/Input';
import AbrirRow from './AbrirRow';
import Predictive from '../../../../Components/Predictive';
import LabelSelect from '../../../../Components/LabelSelect';
function Editar() {
  const params = useParams();

  const chofRef = useRef(null);
  const auxRef = useRef(null)
  const autoRef = useRef(null)
  const divRef = useRef(null)
  const rutaRef = useRef(null)
  //Listas 
  const [choferes, setChoferes] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  //reiniciar
  const [viaje, setViaje] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [empresa, setEmpresa] = useState('');
  const [serie, setSerie] = useState('');
  const [folio, setFolio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [observacionesLL, setObservacionesLL] = useState('');
  const [chofer, setChofer] = useState('');
  const [auxiliar, setAuxiliar] = useState('');
  const [vehiculo, setVehiculo] = useState('');  
  const [ruta, setRuta] = useState('');
  const [expedicion, setExpedicion] = useState('');
  const [fechaI, setFechaI] = useState('');
  const [fechaF, setFechaF] = useState('');
  const [horaI, setHoraI] = useState('');
  const [horaF, setHoraF] = useState('');
  const [placas, setPlacas] = useState('');
  const [gas, setGas] = useState('');
  const [gasLL, setGasLL] = useState('');
  const [KM, setKM] = useState('');
  const [KMLL, setKMLL] = useState('');
  const [cargas, setCargas] = useState('');
  const [dias, setDias] = useState('');
  const [motivos, setMotivos] = useState([])
  const [motivo, setMotivo] = useState('-1')
  const [agentes, setAgentes] = useState([])
  const [responsable, setResponsable] = useState('')

  //eleciones
  const [responsableE, setResponsableE] = useState('')
  const [choferE, setChoferE] = useState('');
  const [auxiliarE, setAuxiliarE] = useState('');
  const [vehiculoE, setVehiculoE] = useState('');
  const [rutaE, setRutaE] = useState('');

  useEffect(()=>{
    async function GetData(){
        const respuesta = await Promise.all([
          fns.GetData(`credito.cobranza/viajes/consulta?serie=${params['serie']}&folio=${params['folio']}`),
          fns.GetData('viajes/choferes?estatus=ACTIVO'), 
          fns.GetData('viajes/vehiculos?estatus=ACTIVO'),
          fns.GetData(`credito.cobranza/viajes/MODIFICACION/motivos`),
          fns.GetData('credito.cobranza/agentes/todos')
        ]);
        console.log(respuesta)
        if(respuesta[0]['mensaje']===undefined){
          setViaje(respuesta[0][0])
          setChoferes(respuesta[1].map(item=>{return {...item, nombreUpper:item.nombre.toUpperCase()}}))
          setVehiculos(respuesta[2].map(item=>{return {...item, id:`${item.codigo}-${item.nombre}`}}))
          setMotivos(respuesta[3])
          setAgentes(respuesta[4].map(item=>{
            return {...item, nombreUpper:item.nombre.toUpperCase()};
          }));
        }else alert(respuesta[0]['mensaje']);

    }
    GetData();
  },[])
  useEffect(()=>{
    async function setData(){
        const detalles = await Promise.all(viaje.detalles.map(async (detalle, index)=>{
            const real = await fns.GetData(`credito.cobranza/documento/${viaje.empresa}/${detalle.serie}/${detalle.folio}`)
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
        const result = await fns.GetData(`/documentos/rutas/${viaje.empresa}`)
        setRutas(result.map(item=>{return {...item, nombreUpper:item.nombre.toUpperCase()}}))
        setDocumentos(detalles)
        setRuta(viaje.nombreRuta.toUpperCase())
    }
    if(Object.keys(viaje).length>0){
      setChofer(viaje.chofer.nombre.toUpperCase());
      setEmpresa(viaje.empresa)
      setAuxiliar(viaje.auxiliar!==null?viaje.auxiliar.nombre.toUpperCase():'')
      setPlacas(viaje.vehiculo.placas)
      setVehiculo(`${viaje.vehiculo.codigo}-${viaje.vehiculo.nombre}`)
      setKM(viaje.kmInicial)
      setKMLL(viaje.kmFinal)
      setSerie(viaje.serie.serie)
      setFolio(viaje.folio)
      setExpedicion(fns.dateString(new Date(viaje.expedicion)))
      setFechaI(fns.dateString(new Date(viaje.fechaInicio)))
      setFechaF(fns.dateString(new Date(viaje.fechaFin)))
      setHoraI(viaje.horaInicio)
      setHoraF(viaje.horaFin)
      setObservaciones(viaje.observacionSalida)
      setObservacionesLL(viaje.observacionLlegada)
      setDias(viaje.dias)
      setCargas(viaje.cargas)
      setGas(viaje.gasInicial)
      setGasLL(viaje.gasFinal)
      setData()
    }
  },[viaje])
  useEffect(()=>{
    fns.setStateE(responsable,agentes,'nombreUpper',setResponsableE)
  },[responsable])
  useEffect(()=>{
    fns.setStateE(chofer,choferes,'nombreUpper',setChoferE)
  },[chofer])
  useEffect(()=>{
    fns.setStateE(vehiculo,vehiculos,'id',setVehiculoE)
  },[vehiculo])
  useEffect(()=>{
    fns.setStateE(auxiliar,choferes,'nombreUpper',setAuxiliarE)
  },[auxiliar])
  useEffect(()=>{
    fns.setStateE(ruta,rutas,'nombreUpper',setRutaE)
  },[ruta])
  
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
      <br />
      <label className={`text-2xl ${viaje.estatus==='COMPLETADO'?'text-green-600':'text-cyan-800'} font-extrabold`}>
        {viaje.estatus}
      </label>
    </>
  }
  //realiza a comparacion automatica de los elemntos que recibe, y los compara para ver si ha habido un cambio
  function makeReturn(original, nuevo){
    return original===nuevo?undefined:nuevo
  }
  function comprobar(obj){
    const keys = Object.keys(obj);
    const result = {};
    for(const index in keys){
      const name = keys[index];
      result[name] = makeReturn(obj[name]['original'],obj[name]['nuevo']);
    }
    console.log(result)
    return result
  }
  function makeObject(name, original, nuevo){
    return {
      [name]:{original, nuevo}
    }
  }
  async function handdleSubmit(e){
    e.preventDefault();
    if(motivo==-1)alert('Debe seleccionar un motivo de modificacion')
    else if(motivo==='otro'){
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const ventana = window.open(`${window.location.href}/crear/motivo/MODIFICACION`,'_blank',`width=${Math.round(screenWidth*0.4)}, height=${screenHeight<1000?Math.round(screenHeight*0.6) :Math.round(screenHeight*0.457)}`)
      if(ventana)ventana.addEventListener('beforeunload', ()=>window.location.reload())
    }else{
      if(responsable==='')
        alert('Debe elegir un Responsable de la cancelacion')
      else{
        const obj = {
          ...makeObject('chofer',viaje.chofer.codigo,choferE['codigo']),
          ...makeObject('vehiculo',viaje.vehiculo.codigo,vehiculoE['codigo']),
          ...makeObject('auxiliar',viaje.auxiliar!==null?viaje.auxiliar['codigo']:'',auxiliarE['codigo']),
          ...makeObject('ruta',viaje.ruta,rutaE['codigo']),
          ...makeObject('gasInicial',viaje.gasInicial,gas),
          ...makeObject('kmInicial',viaje.kmInicial,parseInt(KM)),
          ...makeObject('fechaInicio',fns.dateString(new Date(viaje.fechaInicio)),fechaI),
          ...makeObject('horaInicio',viaje.horaInicio,horaI),
          ...makeObject('dias',viaje.dias,parseInt(dias)),
          ...makeObject('cargas',viaje.cargas,cargas),
          ...makeObject('observacionSalida',viaje.observacionSalida,observaciones),
          ...(()=>{
            if(viaje['estatus']==='COMPLETADO')return {
              ...makeObject('observacionLlegada',viaje.observacionLlegada,observacionesLL),
              ...makeObject('horaFin',viaje.horaFin,horaF),
              ...makeObject('fechaFin',fns.dateString(new Date(viaje.fechaFin)),fechaF),
              ...makeObject('kmFinal',viaje.kmFinal,parseInt(KMLL)),
              ...makeObject('gasFinal',viaje.gasFinal,gasLL),
            }
          })()
        };
        const respuesta = await fns.PatchData(`credito.cobranza/viajes/modificar/${viaje.serie.serie}/${viaje.folio}`,{
          motivo,
          responsable:responsableE['codigo'],
          ...comprobar(obj)
        })
        if(respuesta['mensaje']===undefined)alert(respuesta)
        else alert(respuesta['mensaje'])
      }
    }
        
  }
  function getEnd(){
    if(viaje.estatus==='COMPLETADO')return <Div width='w-50 mx-1' height='h-10' orientation='flex-row' parent={true}>
      <Div custom={'text-end'}>
        <label>Kilometraje Llegada:</label>
        <label>Fecha de Llegada:</label>
        <label>Hora de Llegada:</label>
        <label>Cargas:</label>
        <label>Observaciones de llegada:</label>
        <label>Gasolina de Llegada {viaje.gasFinal}:</label>
      </Div>
      <Div>
          <Input type='number' value={KMLL} change={e=>setKMLL(e.target.value)}/>
          <Input custom='w-full' type='date'value={fechaF} change={e=>setFechaF(e.target.value)}/>
          <Input custom='w-full' type='time' value={horaF} change={e=>setHoraF(e.target.value)}/>
          <Input type="number" value={cargas} change={e=>setCargas(e.target.value)}/>
          <Input type="text" value={observacionesLL} change={e=>setObservacionesLL(e.target.value)}/>
          <Fraccion value={gasLL} change={setGasLL}/>
      </Div>
    </Div>
    else return
  }
  if(viaje.estatus==='CANCELADO') return (
    <div>
      El viaje ya ha sido cancelado
    </div>
  )
  return (
    <form className='flex flex-col' onSubmit={handdleSubmit}>
      <div className={`flex flex-col ${empresa==='-1'?'hidden':'visible'} items-center`}>
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
        <div className='flex flex-col items-start w-full pl-10'>
          <label>Domicilio de origen: {(()=>{
            const {dom} = fns.getDatosFiscales(empresa)
            return dom
          })()}</label>
          <span className='my-1'/>
          <label>Fecha de elaboracion: {expedicion}</label>
        </div>
        <br />
        <div className='flex flex-row w-full justify-center px-20'>
          <Div width='mx-1' height='h-10' orientation='flex-row' parent={true}>
            <Div custom={'text-end'}>
              <label>Chofer:</label>
              <label>Auxiliar:</label>
              <label>Auto:</label>
              <label>Placas:</label>
              <label>Ruta:</label>
            </Div>
            <Div >
              <div ref={chofRef}>
                <Predictive Parameter='nombreUpper'
                  id={'chof'} change={setChofer} value={chofer} list = {choferes}
                  fn={(e)=>{
                    chofRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                  }}
                />
              </div>
              <div ref={auxRef}>
                <Predictive Parameter='nombreUpper'
                  id={'aux'} change={setAuxiliar} value={auxiliar} list = {choferes}
                  fn={(e)=>{
                    auxRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                  }}
                />
              </div>
              <div ref={autoRef}>
                <Predictive Parameter='id'
                  id={'veh'} change={setVehiculo} value={vehiculo} list = {vehiculos}
                  fn={(e)=>{
                    autoRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                  }}
                />
              </div>
              <label>{placas!==''?placas:'NA'}</label>
              <div ref={rutaRef}>
                <Predictive Parameter='nombreUpper'
                  id={'rut'} change={setRuta} value={ruta} list = {rutas}
                  fn={(e)=>{
                      rutaRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                      //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                  }}
                />
              </div>
            </Div>
          </Div>
          <Div width='w-50 mx-1' height='h-10' orientation='flex-row' parent={true}>
            <Div custom={'text-end ml-5'}>
              <label>Kilometraje Salida:</label>
              <label>Fecha de Salida:</label>
              <label>Hora de Salida:</label>
              <label>Dias estimados:</label>
              <label>Observaciones de Salidas:</label>
              <label>Gasolina de Salida {viaje.gasInicial}:</label>
            </Div>
            <Div>
                <Input type='number' value={KM} change={e=>setKM(e.target.value)}/>
                <Input custom='w-full' type='date'value={fechaI} change={e=>setFechaI(e.target.value)}/>
                <Input custom='w-full' type='time' value={horaI} change={e=>setHoraI(e.target.value)}/>
                <Input type="number" value={dias} change={e=>setDias(e.target.value)}/>
                <Input type="text" value={observaciones} change={e=>setObservaciones(e.target.value)}/>
                <Fraccion value={gas} change={setGas}/>
            </Div>
          </Div>
          {getEnd()}
        </div>
        <br />
        <BlueBotton text='Aceptar' fn={e=>handdleSubmit(e)}/>
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
    </form>
  )
}

export default Editar