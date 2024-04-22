import { useState, useEffect, useRef } from 'react';
import Select from '../../../../Components/Select'
import LabelInput from '../../../../Components/LabelInput';
import CheckList from '../../../../Components/CheckList';
import BlueBotton from '../../../../Components/BlueBotton';
import * as Functions from '../../../../Functions.js'
import Table from '../../../../Components/Table';
function Historico() {
  //#region variables
  const años = (()=>{
    const array = new Array();

    for(let i=new Date().getFullYear(); i>=2022; i--)array.push(i);
    return array;
  })()
  const meses = (()=>{
    const array = new Array();
    for(let i=1; i<=12; i++)array.push(`${i<10?'0':''}${i}`);
    return array;
  })();

  const periodoHead = ['AGENTE','A TIEMPO', 'FUERA DE TIEMPO', 'NO COBRADO']
  const periodoKeys = ['nombre', 'aTiempo', 'fueraTiempo', 'faltante']
  //#endregion
  //#region referencias
  const divRef = useRef(null);
  //#endregion
  //#region Estados
  const [empresa, setEmpresa] = useState('');
  const [agentes, setAgentes] = useState([]);
  const [agentesE, setAgentesE] = useState([]);
  const [rango, setRango] = useState(-1);
  const [fechaI, setFechaI] = useState('');
  const [fechaF, setFechaF] = useState('');
  const [focus, setFocus] = useState(false);
  const [concepto, setConcepto] = useState(0);
  const [añoInicialHistorico, setAñoInicialHistorico] = useState(-1);
  const [mesInicialHistorico, setMesInicialHistorico] = useState(-1);
  const [añoFinalHistorico, setAñoFinalHistorico] = useState(-1);
  const [mesFinalHistorico, setMesFinalHistorico] = useState(-1);
  const [agentesPeriodo, setAgentesPeriodo] = useState([]);
  const [historicoHead, setHistoricoHead] = useState([])
  const [historicoKeys, setHistoricoKeys] = useState([])
  const [agentesPeriodos, setAgentesPeriodos] = useState([]);
  //#endregion
//#region efectos
  useEffect(()=>{
    async function getListas(){
      try {
        const respuesta = await Functions.GetData(`/agentes/agentes/corp`);
        setAgentes(respuesta);
      } catch (error) {
        console.log(error);
      }
    }
    getListas();
  },[]);

  useEffect(()=>{
    if(empresa=='Central Mayorista de Páneles')setEmpresa('cmp');
    else if(empresa=='Comercial Domos Copernico')setEmpresa('cdc')
    else if(empresa=='Ambas')setEmpresa('corp');
    else if(empresa=='Seleccionar Opcion') setEmpresa('');
  },[empresa]);
  useEffect(()=>{
    //console.log(rango);
    if(rango=='Rango por fecha')setRango(1);
    else if(rango=='Rango por periodos')setRango(2)
    else if(rango=='Seleccionar Opcion')setRango(-1);
  },[rango])
  useEffect(()=>{
    //console.log(rango);
    if(concepto=='A tiempo')setConcepto(1);
    else if(concepto=='Fuera de tiempo')setConcepto(2)
    else if(concepto=='No pagado')setConcepto(3)
    else if(concepto=='Todos')setConcepto(4);
  },[concepto])

  useEffect(()=>{
    console.log(agentesE);
    const newHead = ['MES', 'CONCEPTO'].concat(agentesE.map(item=>item));
    setHistoricoHead(newHead);
    
    const newKeys = ['mes', 'concepto'].concat(agentesE.map(item=>item))
    setHistoricoKeys(newKeys);
  },[agentesE])
//#endregion
//#region funciones
  function makeUrl(agente, nuevaFechaI, nuevaFechaF){
    let url=`/credito.cobranza/cobranza.total/${empresa}`;
    url+=`/${nuevaFechaI}/${nuevaFechaF}`
    url+='?list=false';
    url+=agente!=''?`&agente=${agente}`:'';
    return url

  }

  async function getRangoFecha(fecha1, fecha2){
    const result = await Promise.all(agentesE.map(async agente=>{
      const respuesta = await Functions.GetData(makeUrl(agente,fecha1,fecha2));
      console.log(respuesta)
      return {...respuesta, agente};
    }))
    return result
  }

  function getLastDay(year, month){
    const nextMonth = new Date(year, month + 1, 1);
    const lastDay = new Date(nextMonth - 1);
    const day = lastDay.getDate();
    return day;
  }

  async function getRangoPeriodos() {
    const respuestas = new Array()
    for(let i = añoInicialHistorico; i<=añoFinalHistorico; i++){
      let j= (i==añoInicialHistorico?meses.indexOf(mesInicialHistorico):0);
      const end = (i==añoFinalHistorico?meses.indexOf(mesFinalHistorico):12);
      for(j; j<=end;j++){
        //console.log(j);
        const fechaI = `${i}-${meses[j]}-01` //new Date(i, j, 1)
        const fechaF =  `${i}-${meses[j]}-${getLastDay(i,j)}`//new Date(i, j, getLastDay(i,j))
        const respuesta = await getRangoFecha(fechaI,fechaF);
        if(respuesta['error']==undefined){
          if(respuesta.length==0)alert('La consulta no arrojó resultados');
          else{
            const MES = `${new Date(i, j, 1).toLocaleString('default', { month: 'long' })} ${i}`;
            //console.log(respuesta);
            respuestas.push({listado:[...respuesta], MES})
          }
        }else alert(respuesta['error']);
      }
    }
    return respuestas;
  }
  async function handleClickConsultar(e){
    e.preventDefault()
    const errores = new Array();
    if(empresa!=='cdc'&&empresa!=='cmp'&&empresa!=='corp')errores.push('No ha seleccionado un aempresa')
    if(rango!==1&&rango!==2)errores.push('No ha selecconado un rango vaido')
    if(rango===1){
      if(fechaI=='')errores.push('Tiene que seleccionar un inicio para el periodo');
      else if(fechaF=='')errores.push('Tiene que seleccionar un final para el periodo');
      else if(fechaI>fechaF)errores.push('El inicio del periodo no debe ser mayor al fial');
    }
    else if(rango===2){
      if(añoInicialHistorico===-1)errores.push('Tiene que seleccionar un año inicial para el historico');
      else if(añoInicialHistorico>añoFinalHistorico)errores.push('El año inicial debe ser menor al final');
      else if(mesInicialHistorico==-1)errores.push('Tiene que seleccionar un mes inicial para el historico');
      else if(añoFinalHistorico==-1)errores.push('Tiene que seleccionar un año final para el historico');
      else if(mesFinalHistorico==-1)errores.push('Tiene que seleccionar un mes final para el historico');
    }
    if(agentesE.length<=0)errores.push('Debe tener seleccionado al menos un agente')
    //else if(concepto<=0)errores.push('El concepto no es valido')
    if(errores.length>0)Functions.alertar(errores);
    else{
      if(rango===1){
          const respuesta = await getRangoFecha(fechaI,fechaF)
          const objetos = respuesta.map(item=>{
            return {
              nombre: item['agente'],
              aTiempo: Functions.moneyFormat(item['aTiempoPeriodo']),
              fueraTiempo: Functions.moneyFormat(item['fueraTiempoPeriodo']),
              faltante: Functions.moneyFormat(item['faltantePeriodo'])
            }
          })
          setAgentesPeriodo(objetos)
      }
      else if(rango===2){
        const respuesta = await getRangoPeriodos()
        const lista = new Array();
        respuesta.forEach(dupla=>{
          const {MES, listado} = dupla;
          const aTiempo = {
            mes:MES,
            concepto:'A TIEMPO' 
          }
          listado.forEach(item=>{
            aTiempo[item['agente']] = item['aTiempoPeriodo']
          })
          lista.push(aTiempo);
          const fueraTiempo = {
            mes:MES,
            concepto:'FUERA DE TIEMPO' 
          }
          listado.forEach(item=>{
            fueraTiempo[item['agente']] = item['fueraTiempoPeriodo']
          })
          lista.push(fueraTiempo)
          const faltante = {
            mes:MES,
            concepto:'FALTANTE' 
          }
          listado.forEach(item=>{
            faltante[item['agente']] = item['faltantePeriodo']
          })
          lista.push(faltante)
        })
        setAgentesPeriodos(lista);
      }
    }
  }
//#endregion
  return (
    <form className='flex flex-col'>
      <div className='flex flex-row justify-evenly mt-3'>
        <div className='flex flex-row m-1'>
          <div className='flex flex-col m-1'>
            Empresa:
            <br />
            <br />
            Rango:
            <br />
          </div>
          <div className='flex flex-col m-2'>
            <Select fn={e=>setEmpresa(e.target.value)} value={empresa} list={['Central Mayorista de Páneles','Comercial Domos Copernico', 'Ambas']}/>
            <br />
            <Select fn={e=>setRango(e.target.value)} value={rango} list={['Rango por fecha','Rango por periodos']}/>
            <br />
          </div>
        </div>
        <div>
          <div className='flex flex-col m-2'>
            <div className={`${rango===1?'visible':'hidden'}`}>
              <LabelInput custom='flex-grow' text='Fecha Inicial: ' type='date' id='fechaI' change={e=>setFechaI(e.target.value)} value={fechaI} />
              <br />
              <LabelInput custom='flex-grow' text='Fecha Final:' type='date' id='fechaF' change={e=>setFechaF(e.target.value)} value={fechaF} />
            </div>
            <div className={`${rango===2?'visible':'hidden'}`}>
              <div className='flex flex-col'>
                <label>Desde:</label>
                <Select list={años} value={añoInicialHistorico} fn={e=>{setAñoInicialHistorico(e.target.value)}}/>
                <Select list={meses} value={mesInicialHistorico} fn={e=>{setMesInicialHistorico(e.target.value)}}/>
              </div>
              <div className='flex flex-col'>
                <label>Hasta:</label>
                <Select list={años} value={añoFinalHistorico} fn={e=>{setAñoFinalHistorico(e.target.value)}}/>
                <Select list={meses} value={mesFinalHistorico} fn={e=>{setMesFinalHistorico(e.target.value)}}/>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-row items-center' ref={divRef}>
          <div className='flex flex-col m-1'>
            <br />
            <br />
            Concepto:
          </div>
          <div className='flex flex-col m-1'>
            <CheckList list={agentes} name='Agentes' Key='nombre' color='cyan-600' visibility={setFocus} fn={setAgentesE}/>
            <br />
          <Select fn={e=>setConcepto(e.target.value)} value={concepto} list={['A tiempo','Fuera de tiempo', 'No pagado', 'Todos']}/>
          </div>
        </div>
      </div>
      <BlueBotton id='boton2' text='Consultar' fn={handleClickConsultar} />
      <div className= {`flex flex-col justify-center ${focus==true?'':'pointer-events-none'} m-2 ${rango===1?'visible':'hidden'}`}>
        <Table  theme='bg-blue-950 text-white' colsNames={periodoHead} colsKeys={periodoKeys} values={agentesPeriodo} manage={setAgentesPeriodo}/>
      </div>
      <div className= {`flex flex-col justify-center ${focus==true?'':'pointer-events-none'} m-2 ${rango===2?'visible':'hidden'}`}>
        <Table  theme='bg-blue-950 text-white' colsNames={historicoHead} colsKeys={historicoKeys} values={agentesPeriodos} manage={setAgentesPeriodos}/>
      </div>
    </form>
  )
}

export default Historico

//<div className= {`flex flex-col justify-center ${focus==true?'':'pointer-events-none'} m-2 ${rango===1?'visible':'hidden'}`}>
//<Table  theme='bg-blue-950 text-white' colsNames={periodoHead} colsKeys={periodoKeys} values={agentesPeriodo} manage={setAgentesPeriodo}/>
//</div>