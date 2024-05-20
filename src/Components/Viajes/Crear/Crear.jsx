import { useState, useEffect, useRef } from 'react';
import { fns } from '../../../Functions';
import ButtonEmpresa from '../../button.empresa'
import Reloj from '../../Reloj'
import Input from '../../Input';
import Predictive from '../../Predictive';
import Fraccion from '../../Fraccion';
import CrearRow from './CrearRow';
import BlueButton from '../../BlueBotton';
import Div from '../../Div';
import makePDF from '../VistaPDF.JS';
import { useParams } from 'react-router-dom';
import Logo from '../..//Logo';
import LabelInput from '../../LabelInput'
import LabelSelect from '../../LabelSelect'

function Crear({area}) {
  const chofRef = useRef(null);
  const auxRef = useRef(null);
  const autoRef = useRef(null);
  const rutaRef = useRef(null);
  const serRef = useRef(null);
  const params = useParams();

  //listas
  const [series, setSeries] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [impresion, setImpresion] = useState({})
  
  //reiniciar
  const [documentos, setDocumentos] = useState([]);
  const [documentosEliminados, setDocumentosEliminados] = useState([]);
  const [empresa, setEmpresa] = useState('-1');
  const [serieViaje, setSerieViaje] = useState('');
  const [folioViaje, setFolioViaje] = useState(0);
  const [serie, setSerie] = useState('');
  const [folio, setFolio] = useState('');
  const [dias, setDias] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [chofer, setChofer] = useState('');
  const [auxiliar, setAuxiliar] = useState('');
  const [vehiculo, setVehiculo] = useState('');  
  const [ruta, setRuta] = useState('');
  const [fechaI, setFechaI] = useState('');
  const [horaI, setHoraI] = useState('');
  const [placas, setPlacas] = useState('');
  const [gas, setGas] = useState('');
  const [KM, setKM] = useState('');
  const [reemplazo, setReemplazo] = useState(false);
  const [serieReemplazada, setSerieReemplazada] = useState('');
  const [folioReemplazado, setFolioReemplazado] = useState(-1)
  const [first, setFirst] = useState(false);

  //elecciones
  const [choferE, setChoferE] = useState('');
  const [auxiliarE, setAuxiliarE] = useState('');
  const [vehiculoE, setVehiculoE] = useState('');
  const [rutaE, setRutaE] = useState('');

  //automaticos
  const [documento, setDocumento] = useState(null);
  const [visible, setVisible] = useState('');
  const [guardado, setGuardado] = useState(false);
  
  const formatCol = 'flex flex-col mr-3 justify-around';
  const formatColEnd = `${formatCol} items-end`
  const formatColStart = `${formatCol} items-start`
  useEffect(()=>{
    async function GetData(){
        const respuesta = await Promise.all([fns.GetData('viajes/choferes?estatus=ACTIVO'), fns.GetData('viajes/vehiculos?estatus=ACTIVO')]);
        console.log(respuesta)
        if(respuesta['mensaje']===undefined){
          setChoferes(respuesta[0].map(item=>{
            return {...item, nombreUpper:item.nombre.toUpperCase()};
          }))
          setVehiculos(respuesta[1].map(item=>{
            return {...item, id:`${item.codigo}-${item.nombre.toUpperCase()}`};
          }))
        }else alert(respuesta['mensaje']);

    }
    GetData();
  },[])
  useEffect(()=>{
    async function getData(){
      const respuesta = await Promise.all([fns.GetData(`/documentos/rutas/${empresa}`), fns.GetData(`/documentos/series/${empresa}`), fns.GetData(`${area}/viaje/head/${empresa}`)]);
      console.log(respuesta)
      setRutas(respuesta[0].map(item=>{
        return {...item, nombreUpper:item.nombre.toUpperCase()};
      }))
      setSeries(respuesta[1].map(item=>{
        return {...item, nombreUpper:item.nombre.toUpperCase()};
      }))
      setSerieViaje(respuesta[2]['serie'])
      setSerieReemplazada(respuesta[2]['serie'])
      setFolioViaje(respuesta[2]['folio'])
    }
    if((empresa==='cdc'||empresa==='cmp')&&first===false){
      getData();
      setFirst(true)
    }
  }, [empresa])
  useEffect(()=>{
    if(vehiculo===''){
        setPlacas('');
        setKM('')
        setVehiculoE('');
        return;
    }
    vehiculos.forEach(veh=>{
      if(veh['id'] === vehiculo){
        setPlacas(veh['placas']);
        const lastKm = veh['km'];
        setKM(lastKm!==null?lastKm:0)
        setVehiculoE(veh);
      }
    })
  }, [vehiculo])
  useEffect(()=>{
    if(chofer===''){
      setChoferE('');
      return
    }
    if(auxiliar===''){
      setAuxiliarE('');
    }
    choferes.forEach(cho=>{
      if(cho['nombreUpper'] === chofer){
        setChoferE(cho);
      }
      if(cho['nombreUpper'] === auxiliar){
        setAuxiliarE(cho);
      }
    })
  }, [chofer, auxiliar])
  useEffect(()=>{
    if(ruta===''){
      setRutaE('');
      return;
  }
  rutas.forEach(rut=>{
    if(rut['nombreUpper']=== ruta){
      setRutaE(rut);
      if(rut['tipo']==1&&auxiliar=='')alert('Esta es una ruta foranea y no tienes un auxiliar seleccionado')
    }
  })
  },[ruta])
  useEffect(()=>{
    if(documento!==null){
      let agregada = inArray(documento, documentos);
      if(agregada===false)setDocumentos([...documentos, {...documento, domicilioElegido:'', observacion:'', destino:''}]);
      else{
        let eliminada = inArray(documento, documentosEliminados);
        if(eliminada===false)alert('Factura ya en el documento');
        else{
          setDocumentosEliminados(prev=>prev.filter(eliminado=>{
            if(eliminado['serie']===documento['serie']&&eliminado['folio']===documento['folio'])return false
            return true
          }));
        }
      }
      setDocumento(null);
    }
  }, [documento])
  useEffect(()=>{
    if(documentos.length>0){
      if(documentos.length>documentosEliminados.length)setVisible(true)
      else setVisible(false)
    }
    else{
      setVisible(false)
    }
  }, [documentos, documentosEliminados])
  
  
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
      <label className='text-2xl text-cyan-800 font-extrabold'>Viaje: {serieViaje}-{folioViaje}</label>
    </>
  }
  async function handleGetDoc(){
    if(serie!==''&&folio!==''){
      console.log(empresa)
      const respuesta = await fns.GetData(`${area}/documento/${empresa}/${serie}/${folio}`)
      if(respuesta['mensaje']===undefined){
        setDocumento(respuesta);
        setFolio('');
      }else alert(respuesta['mensaje'])
    }
  }
  function getDocumentosActivos(){
    return documentos.filter((doc)=>{            
      return inArray(doc, documentosEliminados)===false;
    })
  }
  function getRows(){
    let cont = 1;
    return getDocumentosActivos().map((doc, index)=><CrearRow doc={doc} key={`${doc['serie']}-${doc['folio']}`} index={index} deleteFn={handdleClickDelete} number={cont++}/>)
  }
  function handdleClickDelete(doc){
    setDocumentosEliminados([...documentosEliminados, doc])
  }
  function inArray(doc, array){
    let flag = false
    array.forEach(docE=>{
      if(docE['serie']===doc['serie']&&docE['folio']===doc['folio']){
        flag = true;
      }
    })
    return flag;
  }
  function comprobar(){
    const correcto  = true;
    const erroes = new Array();
    if(choferE==='')erroes.push('Debe seleccionar un chofer');
    if(vehiculoE==='')erroes.push('Debe seleccionar un vehiculo');
    if(gas==='')erroes.push('Debe haber una cantidad inicial de gas');
    if(KM==='')erroes.push('Debe haber un kilometraje');
    if(fechaI==='')erroes.push('Debe seleccionar la fecha de salida del viaje');
    if(horaI==='')erroes.push('Debe seleccionar una hora de salida');
    if(ruta==='')erroes.push('Debe seleccionar una ruta para el viaje');
    if(dias===''||dias<0)erroes.push('Debe seleccioanr una cantidad vaida de días');
    if(erroes.length>0){
      erroes.forEach(err=>alert(err));
      return false
    }
    return correcto;
  }
  async function handdleSubmit(e){
    e.preventDefault();
    const correcto = comprobar();
    if(correcto===true){
      const docs = getDocumentosActivos();
      if(docs.length<=0)alert('El viaje debe contener dcoumentos');
      else{
        console.log(serieReemplazada)
        console.log(folioReemplazado)
        const respuesta = await fns.PostData(`${area}/viajes/crear/${empresa}`, {
          empresa:empresa,
          serie:serieViaje,
          folio:folioViaje,
          codChofer:choferE['codigo'],
          codAuxiliar:auxiliarE!==''?auxiliarE['codigo']:undefined,
          codVehiculo:vehiculoE['codigo'],
          ruta:rutaE['codigo'],
          fechaInicio:fechaI,
          horaInicio:horaI,
          kmInicial:parseInt(KM),
          gasInicial:gas,
          reemplazo,
          serieAnterior:serieReemplazada,
          folioAnterior:reemplazo===true?folioReemplazado:undefined,
          observacionSalida:observaciones,
          dias:parseInt(dias),
          idUsuario:parseInt(params['id']),
          documentos:docs.map(doc=>{
            const obj={
              empresa:empresa,
              serie:doc['serie'],
              folio:doc['folio'],
              destino:doc['destino'],
              observaciones:doc['observacion'],
              direccion:doc['domicilioElegido'],
            }
            return obj;
          })
        })
        console.log(respuesta);
        if(respuesta['mensaje']===undefined){
          alert(respuesta);
          setGuardado(true);
          const {origen, rfc, dom} = fns.getDatosFiscales(empresa)
          const obj = {
            origen,
            rfc,
            direccion:dom,
            chofer,
            auxiliar,
            gas,
            fecha:new Date(),
            auto:vehiculo,
            placas,
            serfol:`${serieViaje}-${folioViaje}`,
            fechaRuta:`${fechaI} ${horaI}`,
            km:KM,
            ruta,
            obs:observaciones,
            docs:getDocumentosActivos()
          }
          setImpresion(obj);
        }else{
          alert(respuesta['mensaje']);
        }
      }
    }
  }
  
  return (
    <form className='flex flex-col' onSubmit={handdleSubmit}>
      <div className={`flex flex-row ${empresa==='-1'?'visible':'hidden'} justify-center`}>
        <ButtonEmpresa text='CMP' fn={()=>{
          if(first===false)setEmpresa('cmp')
        }}/>
        <span className='mx-1'/>
        <ButtonEmpresa text='CDC' fn={()=>{
          if(first===false)setEmpresa('cdc')
        }}/>
      </div>
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
          <label>Fecha de elaboracion: <Reloj/></label>
        </div>
        <br />
        <div className='flex flex-row w-full justify-between px-20'>
          <div className='flex flex-row'>
          <Div width='w-50 mx-1' height='text-end h-10' orientation='flex-row' parent={true}>
            <Div>
              <label>Chofer:</label>
              <label>Auxiliar:</label>
              <label>Auto:</label>
              <label>Placas:</label>
              <label>Gasolina del vehiculo:</label>
            </Div>
            <Div>
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
              <Div parent={true} orientation='flex-row' height={'h-10 w-full text-start'} width={'w-12'}>
                <label>{placas!==''?placas:'NA'}</label>
              </Div>
              <Fraccion value={gas} change={setGas}/>
            </Div>
          </Div>
          </div>
          <div className='flex flex-row'>
            <div className={`${formatColEnd}`}>
              <label>Kilometraje:</label>
              <label>Fecha de Inicio:</label>
              <label>Hora de Inicio:</label>
              <label>Ruta:</label>
            </div>
            <div className={`${formatColStart}`} ref={rutaRef}>
              <Input type='number' value={KM} change={e=>setKM(e.target.value)}/>
              
              <Input custom='w-full' type='date'value={fechaI} change={e=>setFechaI(e.target.value)}/>
              
              <Input custom='w-full' type='time' value={horaI} change={e=>setHoraI(e.target.value)}/>
              
              <Predictive Parameter='nombreUpper'
                id={'rut'} change={setRuta} value={ruta} list = {rutas}
                fn={(e)=>{
                    rutaRef.current.childNodes[3].childNodes[0].childNodes[0].blur();
                    //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                }}
              />
            </div>
          </div>
        </div>
        <label>
          Dias estimados:
          <span className='mx-1'/>
          <Input type="number" value={dias} change={e=>setDias(e.target.value)}/>
        </label>
        <br />
        <br />
        <label>
          Observaciones:
          <span className='mx-1'/>
          <Input type="text" value={observaciones} change={e=>setObservaciones(e.target.value)} custom='w-1/2'/>
        </label>
        <br />
        <div className='flex flex-row w-full justify-around'>
          <div className='w-fit flex flex-row' ref={serRef}>
            <label>Serie:</label>
            <span className='mx-1'/> 
            <Predictive Parameter='nombreUpper'
              id={'ser'} change={setSerie} value={serie} list = {series}
              fn={(e)=>{
                serRef.current.childNodes[2].childNodes[0].childNodes[0].blur();
                handleGetDoc();
                //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
              }}
            />
          </div>
          <label>Folio:
            <span className='mx-1'/>
            <Input type='number' value={folio} change={e=>setFolio(e.target.value)} fn={handleGetDoc}/>
          </label>
        </div>
        <br />
        <div className={`mx-2 flex flex-col justify-center ${(visible===true)?'visible':'hidden'}`}>
          <table className=' select-none'>
            <thead className="bg-blue-950 text-white text-xs">
                <tr>
                  <th>Eliminar</th>
                  <th>No.</th>
                  <th>Razón Social</th>
                  <th>Factura</th>
                  <th>Destino</th>
                  <th>Domicilio</th>
                  <th>Total de Productos</th>
                  <th>Peso Aproximado</th>
                  <th>Total</th>
                  <th className='hidden'>Llegada Estimada</th>
                  <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
                {getRows()}
            </tbody>
          </table>
          <br />
          <div className={`${guardado===false?'visible flex flex-col':'hidden'}  text-center items-center`}>
            <BlueButton text='Enviar' fn={e=>handdleSubmit(e)}/>
            <br />
            <label className='items-center'>
              Reemplazo de viaje:
              <span className='mx-1'/>
              <input type="checkbox" checked={reemplazo} onChange={e=>{setReemplazo(e.target.checked)}}/>
            </label>
            <br />
            <div className={`${reemplazo===true?'visible':'hidden'}`}>
              <LabelSelect custom='flex-grow' text='Serie que reemplaza' fn={e=>setSerieReemplazada(e.target.value)} value={serieReemplazada} list={[
                'VJCDC','VJCMP'
              ]}/>
            </div>
            <br />
            <div className={`${reemplazo===true?'visible':'hidden'}`}>
              <LabelInput text='Folio que reemplaza' type='number' value={folioReemplazado} change={e=>setFolioReemplazado(parseInt(e.target.value))}/>
            </div>
            <br />
          </div>
          <br />
          <div className={`${guardado===true?'visible':'hidden'} text-center flex-col`}>
            <BlueButton text='Imprimir' fn={(e)=>{
              e.preventDefault();
              const doc = makePDF(impresion);
              window.open(doc.output("bloburl"), "Carta", "width=inherit, height=0")
            }}/>
            <span className='mx-5'/>
            <BlueButton text='Nuevo' fn={(e)=>{
              e.preventDefault();
              window.location.reload()
            }}/>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Crear