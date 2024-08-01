import { useState, useEffect, useRef } from 'react'
import { RxOpenInNewWindow } from 'react-icons/rx'
import LabelInput from '../../../../Components/LabelInput'
import LabelSelect from '../../../../Components/LabelSelect'
import Graficas from '../../../../Components/Graficas'
import Predictive from '../../../../Components/Predictive'
import Table from '../../../../Components/Table V2'
import IconButton from '../../../../Components/IconButton'
import * as Functions from '../../../../Functions.js'
function SaldoPendeinte() {
  //consts
  const colsHeads = [
    {text:'Abrir', type:'string'},
    {text:'Codigo', type:'string'},
    {text:'Expedicion', type:'date'},
    {text:'Factura', type:'string'},
    {text:'Cliente', type:'string'},
    {text:'Total', type:'pesos'},
    {text:'Saldo', type:'pesos'},
    {text:'Vencimiento', type:'date'},
    {text:'Dias Restantes', type:'string', bg:resaltar},
    {text:'Clasificacion', type:'string'},
    {text:'Observaciones', type:'string'},
  ]
  const resaltarFns = [resaltar];
  const gray = 'rgba(59, 57, 49, 0.15)'
  //className='h-'
  //states
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState('');
  const [clienteE, setClienteE] = useState('');
  const [clasificacion, setClasificacion] = useState(-1);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [ruta, setRuta] = useState('');
  const [agentes, setAgentes] = useState([]);
  const [agente, setAgente] = useState('');
  const [empresa, setEmpresa] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [activo, setActivo] = useState(0);
  const [fechaI, setFechaI] = useState('');
  const [fechaF, setFechaF] = useState('');
  const [diasRI, setdiasRI] = useState('');
  const [diasRF, setdiasRF] = useState('');
  const [facturas, setFacturas] = useState([]);
  const [objetos, setObjetos] = useState([]);
  const [total, setTotal] = useState(0);
  const [amarallos, setAmarillos] = useState(0);
  const [verdes, setVerdes] = useState(0);
  const [azules, setAzules] = useState(0);
  const [rojos, setRojos] = useState(0);
  const [color, setColor] = useState(0);
  const [filtred, setFiltred] = useState([]);
  const [reduced, setReduce] = useState(false);
  const [ignored, setIgnored] = useState([])
  //refs
  const divRef = useRef(null);
  const initialRef = useRef(0);
  //effects
  useEffect(()=>{
    async function getData(){
      try{
        const respuesta = await Promise.all([Functions.GetData('/clientes/corp'), Functions.GetData(`/agentes/agentes/corp`), Functions.GetData(`/documentos/rutas/corp`),Functions.GetData('/clientes/clasificaciones/corp')]);
        console.log(respuesta);
        if(respuesta[0]['mensaje']===undefined){
          setClientes(respuesta[0].map(cli=>{
            return {
              ...cli,
              nombreUpper:`${cli.codigo}-${cli.nombre}`
            }
          }));
          setAgentes(respuesta[1]);
          setRutas(respuesta[2]);
          setClasificaciones(respuesta[3].sort((item1,item2)=>{
            return item1.codigo.localeCompare(item2.codigo)
          }));
          initialRef.current = 1;
        }else alert(respuesta[0]['mensaje'])
      }catch(error){
        console.log(error);
      }
    }
    getData();
  },[]);

  useEffect(()=>{
    if(empresa=='Central Mayorista de Páneles')setEmpresa(1);
    if(empresa=='Comercial Domos Copernico')setEmpresa(2)
    if(empresa=='Ambas')setEmpresa(0);
    if(saldo!=-1&&empresa!=-1)setActivo(activo+1);
  },[empresa]);

  useEffect(()=>{
    if(saldo=='Con saldo Pendiente')setSaldo(0);
    if(saldo=='Sin saldo Pendiente')setSaldo(1)
    if(saldo=='Todas')setSaldo(2);
    if(saldo!=-1&&empresa!=-1)setActivo(activo+1);
  },[saldo]);
  useEffect(()=>{
    Functions.setStateE(cliente,clientes,'nombreUpper',setClienteE)
  },[cliente])
  useEffect(()=>{
    async function getData(){
      if(initialRef.current!=0){
        if(saldo==-1||empresa==-1){
          alert('No se ha seleccionado un saldo o una empresa');
        }else{
          let url = '/credito.cobranza/pendientes/';
          if(empresa===0)url += 'corp';
          else{
            if(empresa===1)url += 'cmp';
            if(empresa===2){url += 'cdc';}
          }
          url += '?';
            url+=makeUrl('fechaIS',fechaI)
            url+=makeUrl('fechaFS',fechaF)
            url+=makeUrl('propietario',clienteE!==''?clienteE.nombre:'')
            url+=makeUrl('agente',agente)
            url+=makeUrl('ruta',ruta)
            //makeUrl(,saldo);
            url+=makeUrl('restanteIS',diasRI)
            url+=makeUrl('restanteFS',diasRF)
            url+=makeUrl('clasificacion',clasificacion,-1)
            console.log(url);
          const respuesta = await Functions.GetData(url);
          console.log('respuesta');
          console.log(respuesta);
          if(respuesta['mensaje']==undefined){
            if(respuesta.length==0)alert('La consulta no arrojó resultados');
            else{
              setFacturas(...[respuesta]);
              setActivo(0);
            }
          }else alert(respuesta['mensaje']);
          //console.log(respuesta);
        }
      }
    }
    getData();
  },[activo]);

  useEffect(()=>{
    //console.log(facturas);
    let acumT=0, acumA=0, acumV=0, acumR=0, acumAz=0;
    const array = facturas.map(item=>{
      const {expedicion, serie, folio, total, pendiente, vencimientoReal, atraso, /*OBSERVACIONES,*/ idCliente, observacion} = item;
      acumT+=pendiente;
      if(atraso>2)acumA+=pendiente;
      else if(atraso>=-2&&atraso<=2)acumV+=pendiente;
      else if(atraso>=-15&&atraso<=-3)acumR+=pendiente;
      else acumAz+=pendiente;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const obj = {
        ABRIR:<IconButton icon={ <RxOpenInNewWindow size={25}/>} id={`${serie}-${folio}`} fn={()=>window.open(`${window.location.href}/documento/${serie}/${folio}`,'_blank',`width=${Math.round(screenWidth*0.4)}, height=${screenHeight<1000?Math.round(screenHeight*0.6) :Math.round(screenHeight*0.457)}`)}/>,
        CODIGO:idCliente.codigo,
        EXPEDICION: expedicion.substring(0,10),
        FACTURA: `${serie}-${folio}`,
        NOMBRE:idCliente.nombre,
        TOTAL: total,
        PENDIENTE: pendiente,
        VENCIMIENTO: vencimientoReal.substring(0,10),
        ATRASO:atraso,
        CLASIFICACION: idCliente.clasificacionClienteReal,
        OBSERVACIONES:observacion!==undefined?observacion:'',
      }
      return obj;
    });
    setTotal(acumT);
    setAmarillos(acumA);
    setVerdes(acumV);
    setRojos(acumR);
    setAzules(acumAz);
    //console.log(array.length);
    setObjetos(array)
    //console.log(facturas);
  },[facturas]);

  useEffect(()=>{
    const newAray = ignored.length>0?objetos.filter(item=>{
      //console.log('ignored');
      if(item.ATRASO>2)return !ignored.includes(1);
      else if(item.ATRASO>=-2&&item.ATRASO<=2)return !ignored.includes(2);
      else if(item.ATRASO>=-15&&item.ATRASO<=-3)return !ignored.includes(3);
      else if(item.ATRASO<=-16)return !ignored.includes(4);
      else return false;
    }):objetos.filter(item=>{
      //console.log('color');
      if(color==1)return item.ATRASO>2?true:false;
      else if(color==2)return (item.ATRASO>=-2&&item.ATRASO<=2)?true:false;
      else if(color==3)return (item.ATRASO>=-15&&item.ATRASO<=-3)?true:false;
      else if(color==4) return item.ATRASO<=-16?true:false;
      else return false;
    });
    setFiltred(newAray);
  },[color, ignored, objetos]);
  
  useEffect(()=>{
    setActivo(activo+1);
  },[clasificacion]);

  //functions
  function resaltar(value){
    if(value>2)return'bg-yellow-500';
    if(value>=-2&&value<=2)return 'bg-green-700';
    if(value>=-15&&value<=-3)return'bg-red-600';
    if(value<=-16)return'bg-blue-400';
  }
  function handleClickGrafica(id){
    //console.log(`${color}-${id}`)
    color==id?(setColor(0),setReduce(false)):(setColor(id),setReduce(true));
  }

  function ignore(id){
    ignored.indexOf(id)==-1?setIgnored(prev=>[...prev,id]):setIgnored(prev=>prev.filter(item=>item!=id));
  }

  function makeUrl(key, value, compare){
    const invalid = (compare!==undefined?compare:'');
    return value==invalid?'':`${key}=${value}&`
  }
  function handdleExport(array){
    const columns = [
      {header:'No.', key:'NO'},
      {header:'Codigo', key:'CODIGO'},
      {header:'Expedicion', key:'EXPEDICION'},
      {header:'Factura', key:'FACTURA'},
      {header:'Cliente', key:'NOMBRE'},
      {header:'Total', key:'TOTAL'},
      {header:'Saldo', key:'PENDIENTE'},
      {header:'Vencimiento', key:'VENCIMIENTO'},
      {header:'Dias Restantes', key:'ATRASO'},
      {header:'Clasificacion', key:'CLASIFICACION'},
      {header:'Observaciones', key:'OBSERVACIONES'},
    ]
    const rows = array.map((obj, index)=>{
      return {
        ...obj,
        NO:index+1
      }
    })
    //console.log(rows)
    return {columns, rows}
  }
  return (
    <div className='flex flex-col'>
      <div className=' flex flex-row justify-around mx-2'>
        <div className='flex'>
          <div className=' flex flex-col justify-evenly text-sm'>
            <LabelSelect text='Empresa:' fn={e=>setEmpresa(e.target.value)} value={empresa} list={['Central Mayorista de Páneles','Comercial Domos Copernico', 'Ambas']}/>
            <LabelInput custom='flex-grow' text='Fecha Inicial: ' type='date' id='fechaI' change={e=>setFechaI(e.target.value)} value={fechaI} fn={()=>setActivo(activo+1)}/>
            <LabelInput custom='flex-grow' text='Fecha Final:' type='date' id='fechaF' change={e=>setFechaF(e.target.value)} value={fechaF} fn={()=>setActivo(activo+1)}/>
          </div>
          <div className='justify-evenly text-s hidden'>
              <LabelSelect text='Saldo:' fn = {e=>{setSaldo(e.target.value)}} value={saldo} list={['Con saldo Pendiente','Sin saldo Pendiente', 'Todas']}/>
          </div>
          <div className=' flex justify-evenly mx-11'>
            <div className=' flex flex-col justify-evenly items-end mr-1'>
              <label>Cliente:</label>
              <label>Agente:</label>
              <label>Ruta:</label>
            </div>
            <div ref={divRef} className=' flex flex-col justify-evenly mr-5'>
              <Predictive Parameter='nombreUpper' Diferencer='codigo'
              id={'cliente'} change={setCliente} value={cliente} list = {clientes}
              fn={()=>{
                divRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                setActivo(activo+1);
                //console.log(divRef.current.childNodes[1].childNodes[0].childNodes[0]);
              }}
              />
              <Predictive Parameter='nombre'
                id={'agente'} change={setAgente} value={agente} list = {agentes}
                fn={()=>{
                  divRef.current.childNodes[1].childNodes[0].childNodes[0].blur();
                  setActivo(activo+1);
                }}
              />
              <Predictive Parameter='nombre' Diferencer='codigo'
                id={'ruta'} change={setRuta} value={ruta} list = {rutas}
                fn={()=>{
                  divRef.current.childNodes[2].childNodes[0].childNodes[0].blur();
                  setActivo(activo+1);
                }}
              />
            </div>
            <div className=' flex flex-col justify-evenly text-sm'>
            <label className=" text-lg"> Clasificacion: 
            <select name="" id="clasfificacion" className="text-xl rounded-xl" onChange={e=>setClasificacion(e.target.value)} value={clasificacion}>
              <option value={-1} key={-1}>Seleccionar opcion</option>
              {clasificaciones.map((item,index)=>{
                return <option key={index} value={item.codigo}>
                  {`${item.codigo}-${item.nombre}`}
                </option>
              })}
            </select>
          </label>
              <LabelInput custom='flex-grow' text='Dias Restantes periodo desde: ' type='number' id='diasRI' change={e=>setdiasRI(e.target.value)} value={diasRI} fn={()=>setActivo(activo+1)}/>
              <LabelInput custom='flex-grow' text='Dias Restantes periodo hasta:' type='number' id='diasRF' change={e=>setdiasRF(e.target.value)} value={diasRF} fn={()=>setActivo(activo+1)}/>
          </div>
            <div className={` flex flex-col`}>
              <Graficas manage={ignore} handle={handleClickGrafica} variable={1} label='Amarillos' labels={[`${Functions.moneyFormat(amarallos)}`]} bgColors={['234, 179, 8',`${gray}`]} data={[amarallos,total-amarallos]}/>
              <Graficas manage={ignore} handle={handleClickGrafica} variable={2} label='Verdes' labels={[`${Functions.moneyFormat(verdes)}`]} bgColors={['21, 128, 61',`${gray}`]} data={[verdes, total-verdes]} /> 
            </div>
            <div className={` flex flex-col`}>
              <Graficas manage={ignore} handle={handleClickGrafica} variable={3} label='Rojos' labels={[`${Functions.moneyFormat(rojos)}`]} bgColors={['185, 28, 28',`${gray}`]} data={[rojos,total-rojos]}/>
              <Graficas manage={ignore} handle={handleClickGrafica} variable={4} label='Azules' labels={[`${Functions.moneyFormat(azules)}`]} bgColors={['96, 165, 250',`${gray}`]} data={[azules,total-azules]}/>
            </div>
            <div className='flex items-center'>
              <table>
                <thead>
                  <tr>
                    <th className='bg-blue-900 text-white'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{Functions.moneyFormat(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex flex-col mx-32 text-sm items-center ${(reduced==true||ignored.length>0)?'hidden':'visible'}`}>
        <Table theme='bg-blue-950 text-white' colsHeads={colsHeads} list={objetos} manage={setObjetos} handdleExport={()=>handdleExport(objetos)}/>
      </div>
      <div className={`flex flex-col mx-32 text-sm items-center ${(reduced==true||ignored.length>0)?'visible':'hidden'}`}>
        <Table theme='bg-blue-950 text-white' colsHeads={colsHeads} list={filtred} manage={setFiltred} handdleExport={()=>handdleExport(filtred)}/>
      </div>
    </div>
  )
}

export default SaldoPendeinte
