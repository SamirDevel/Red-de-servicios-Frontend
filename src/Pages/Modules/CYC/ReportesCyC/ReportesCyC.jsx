import {useEffect, useState, useRef} from 'react'
import LabelSelect from '../../../../Components/LabelSelect'
import LabelInput from '../../../../Components/LabelInput';
import Predictive from '../../../../Components/Predictive';
import CheckList from '../../../../Components/CheckList';
import BlueBotton from '../../../../Components/BlueBotton'
import * as Functions from '../../../../Functions.js'
import Graficas from '../../../../Components/Graficas'
import Select from '../../../../Components/Select';
import Table from '../../../../Components/Table';
import 'animate.css'

function ReportesCyC() {
  //constantes
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
  const cobranzaHeads = ['Mes','A tiempo','%', 'Fuera de tiempo','%', 'Cobrado','%', 'No cobrado','%', 'Total','%'];
  const vencidaHeads = ['Mes','Deuda Inicial', 'Cobrado', 'Cancelado', 'Deuda FInal'];
  const promediosHeads = ['Mes','Promedio de Deuda', 'promedio de Vencimientos'];
  const cobranzaKeys = ['MES', 'A_TIEMPO','A_TIEMPOP', 'FUERA_TIEMPO','FUERA_TIEMPOP', 'COBRADO', 'COBRADOP', 'PENDIENTE', 'PENDIENTEP', 'TOTAL','TOTALP',];
  const vencidaKeys = ['MES', 'DEUDA', 'RECUPERACION', 'CANCELADO', 'PERDIDO'];
  const promediosKeys = ['MES','DEUDA', 'VENCIMIENTOS'];
  const celsFunctions = [];
  //referencias
  const divRef = useRef(null);
  const divRef2 = useRef(null);
  const initialRef = useRef(0);
  //estados
  const [empresa, setEmpresa] = useState(-1);
  const [fechaI, setFechaI] = useState('');
  const [fechaF, setFechaF] = useState('');
  const [agentes, setAgentes] = useState([]);
  const [agente, setAgente] = useState('');
  const [rutas, setRutas] = useState([]);
  const [rutasE, setRutasE] = useState([]);
  const [facturasExcluidas, setfacturasExcluidas] = useState([]);
  const [facturasReincorpradas, setfacturasReincorpradas] = useState([]);
  const [total, setTotal] = useState(0);
  const [vencimientos, setVencimientos] = useState(0);
  const [adelantos, setAdelantos] = useState(0);
  const [carteraVencida, setCarteraVencida] = useState(0);
  const [carteraVencidaP, setCarteraVencidaP] = useState(0);
  const [carteraVencidaC, setCarteraVencidaC] = useState(0);
  const [carteraVencidaNP, setCarteraVencidaNP] = useState(0);
  const [atiempo, setATiempo] = useState(0);
  const [fueratiempo, setFueraTiempo] = useState(0);
  const [pagado, setPagado] = useState(0);
  const [deudaDias, setDeudaDias] = useState(0);
  const [vencimientosDias, setVencimientosDias] = useState(0);
  const [añoInicialHistorico, setAñoInicialHistorico] = useState(-1);
  const [mesInicialHistorico, setMesInicialHistorico] = useState(-1);
  const [añoFinalHistorico, setAñoFinalHistorico] = useState(-1);
  const [mesFinalHistorico, setMesFinalHistorico] = useState(-1);
  const [historicoCobranza, setHistoricoCobranza] = useState([]);
  const [historicoVencida, setHistoricoVencida] = useState([]);
  const [historicoPromedios, setHistoricoPromedios] = useState([]);
  const [reporte, setReporte] = useState(-1);
  const [focus, setFocus] = useState(false);
  const [historico, setHistorico] = useState(-1);
  const [series, setSeries] = useState([]);
  const [serie, setSerie] = useState('');
  const [folio, setFolio] = useState(0);
  //efectos
  useEffect(()=>{
        async function getData(){
          try{
            const respuesta = await Promise.all([Functions.GetData(`/documentos/series/corp`), Functions.GetData('/agentes/agentes/corp'), Functions.GetData('/documentos/rutas/corp'),Functions.GetData('/credito.cobranza/ignoradas')]);
            if(respuesta[3]['mensaje']===undefined){
              setSeries(respuesta[0]);
              setAgentes(respuesta[1]);
              setRutas(respuesta[2].filter(rut=>rut['nombre']!=''));
              //console.log(respuesta[2])
              setfacturasExcluidas(respuesta[3])
              initialRef.current = 1;
            }else alert(respuesta[3]['mensaje'])
          }catch(error){
            console.log(error);
          }
        }
        getData();
  },[])
  useEffect(()=>{
      if(empresa=='Central Mayorista de Páneles')setEmpresa(1);
      else if(empresa=='Comercial Domos Copernico')setEmpresa(2)
      else if(empresa=='Ambas')setEmpresa(0);
      else if(empresa=='Seleccionar Opcion') setEmpresa(-1);
  },[empresa]);
  useEffect(()=>{
    //console.log(reporte);
    if(reporte=='Cobranza Total')setReporte(1);
    else if(reporte=='Recuperacion de Cartera Vencida')setReporte(2)
    else if(reporte=='Antigudad promedio de Deuda al fin de mes')setReporte(3);
    else if(reporte == 'Reporte Completo')setReporte(4)
    else if(reporte=='Seleccionar Opcion')setReporte(-1);
  },[reporte])
  useEffect(()=>{
    //console.log(historico);
    if(historico=='Historico cobranza Total')setHistorico(1);
    else if(historico=='Historico de recuperacion de Cartera Vencida')setHistorico(2)
    else if(historico=='Historico promedio de Deuda al fin de mes')setHistorico(3);
    else if(historico == 'Historico Completo')setHistorico(4)
    else if(historico=='Seleccionar Opcion')setHistorico(-1);
  },[historico])
  useEffect(()=>{
    (async()=>{
      console.log(facturasReincorpradas);
      if(facturasReincorpradas.length>0){
        const reincorporar =facturasReincorpradas.map(item=>{
          const array = item.split('-');
          return {serie:array[0], folio:array[1]} 
        })
        const body = reincorporar;
        const url=`/credito.cobranza/reincorporar`;
        const respuesta = await Functions.PostData(url,body)
        window.location.reload();
        if(respuesta['mensaje']===undefined){
          setfacturasExcluidas(respuesta);
        }else alert(respuesta['mensaje'])
      }
    })()
  },[facturasReincorpradas])
  //funciones
  async function handleSubmit(e){
    e.preventDefault();
    const errores = new Array();
    if(fechaI=='')errores.push('Tiene que seleccionar un inicio para el periodo');
    if(fechaF=='')errores.push('Tiene que seleccionar un final para el periodo');
    if(empresa==-1)errores.push('La seleccion de empresa no es valida');
    if(fechaI>fechaF)errores.push('El inicio del periodo no debe ser mayor al fial');
    if(errores.length>0)alert(errores);
    else {
      let error = false;
      const respuesta = await Promise.all([
          Functions.GetData(makeUrl('cobranza.total')),
          Functions.GetData(makeUrl('cartera.vencida')),
          Functions.GetData(makeUrl('promedios')),
        ]);
      //ruta:rutasE,//ruta==''?null:ruta,
      for(const result in respuesta){
        if(respuesta[result]['error']!==undefined){
          error = true;
          break;
        }
      }
      if(error===false){
        if(respuesta.length==0)alert('La consulta no arrojó resultados');
        else{
          console.log(respuesta)
          setVencimientos(respuesta.VENCIMIENTOS_PERIODO);
          setAdelantos(respuesta.ADELANTOS_PERIODO);
          setCarteraVencida(respuesta[1].deudaInicial);
          setCarteraVencidaP(respuesta[1].cobrado);
          setCarteraVencidaC(respuesta[1].cancelado);
          setCarteraVencidaNP(respuesta[1].deudaFinal);
          setPagado(respuesta[0].cobradoPeriodo);
          setTotal(respuesta[0].totalPeriodo);
          setATiempo(respuesta[0].aTiempoPeriodo);
          setFueraTiempo(respuesta[0].fueraTiempoPeriodo)
          setDeudaDias((respuesta[2].promedioDeuda).toFixed(2));
          setVencimientosDias((respuesta[2].promedioVencida).toFixed(2));
        }
      }else {
        console.log(respuesta)
        alert(respuesta)
      };
    }
  }
  function getLastDay(year, month){
    const nextMonth = new Date(year, month + 1, 1);
    const lastDay = new Date(nextMonth - 1);
    const day = lastDay.getDate();
    return day;
  }

  function makeUrl(concepto, nuevaFechaI, nuevaFechaF){
    let url=`/credito.cobranza/${concepto}/`;
    if(empresa===0)url+='corp'
    else{
      if(empresa===1)url += 'cmp';
      if(empresa===2)url += 'cdc';
    }
    if(nuevaFechaI!==undefined && nuevaFechaF !==undefined){
      url+=`/${nuevaFechaI}/${nuevaFechaF}`
    }else url+=`/${fechaI}/${fechaF}`
    url+='?list=false';
    url+=agente!=''?`&agente=${agente}`:'';
    url+=rutasE.length>0?`&rutas=${encodeURIComponent(JSON.stringify(rutasE))}`:'';
    return url
  }
  async function handleSubmitHistorico(e){
    e.preventDefault();
    const url='/facturas/reportes/credito';
    const errores = new Array();
    if(añoInicialHistorico==-1)errores.push('Tiene que seleccionar un año inicial para el historico');
    if(añoInicialHistorico>añoFinalHistorico)errores.push('El año inicial debe ser menor al final');
    if(mesInicialHistorico==-1)errores.push('Tiene que seleccionar un mes inicial para el historico');
    if(añoFinalHistorico==-1)errores.push('Tiene que seleccionar un año final para el historico');
    if(mesFinalHistorico==-1)errores.push('Tiene que seleccionar un mes final para el historico');
    if(empresa==-1)errores.push('La seleccion de empresa no es valida');
    if(fechaI>fechaF)errores.push('El inicio del periodo debe ser mayor al fial');
    if(errores.length>0)alert(errores);
    else {
      const totalArray = new Array();
      const vencidasArray = new Array();
      const promediosArray = new Array();
      const heads = new Array();
      heads.push('CATEGORIA');
      for(let i = añoInicialHistorico; i<=añoFinalHistorico; i++){
        let j= (i==añoInicialHistorico?mesInicialHistorico-1:0);
        const end = (i==añoFinalHistorico?mesFinalHistorico:12);
        for(j; j<end;j++){
          const mesN = j+1;
          const mes = mesN<10?`0${mesN}`:mesN
          const startDate = `${i}-${mes}-01`
          const endDate = `${i}-${mes}-${getLastDay(i,j)}`;
          console.log(startDate)
          const respuesta = await Promise.all([
            Functions.GetData(makeUrl('cobranza.total',startDate,endDate)),
            Functions.GetData(makeUrl('cartera.vencida',startDate, endDate)),
            Functions.GetData(makeUrl('promedios',startDate,endDate)),
          ]);
          console.log(respuesta);
          let error = false
          for(const result in respuesta){
            if(respuesta[result]['error']!==undefined){
              error = true;
              break;
            }
          }
          if(error===false){
              if(respuesta.length===0)alert('La consulta no arrojó resultados');
              else{
                const MES = `${new Date(i, j, 1).toLocaleString('default', { month: 'long' })} ${i}`;
                const totalDiv = respuesta[0].totalPeriodo;
                totalArray.push({
                  MES,
                  TOTAL:Functions.moneyFormat(respuesta[0].totalPeriodo),
                  TOTALP:100,
                  COBRADO: Functions.moneyFormat(respuesta[0].cobradoPeriodo),
                  COBRADOP: ((respuesta[0].cobradoPeriodo)*100/totalDiv).toFixed(2),
                  A_TIEMPO: Functions.moneyFormat(respuesta[0].aTiempoPeriodo),
                  A_TIEMPOP: (respuesta[0].aTiempoPeriodo*100/totalDiv).toFixed(2),
                  FUERA_TIEMPO: Functions.moneyFormat(respuesta[0].fueraTiempoPeriodo),
                  FUERA_TIEMPOP:((respuesta[0].fueraTiempoPeriodo)*100/totalDiv).toFixed(2),
                  PENDIENTE: Functions.moneyFormat(respuesta[0].faltantePeriodo),
                  PENDIENTEP:((respuesta[0].faltantePeriodo)*100/totalDiv).toFixed(2)
                });
                vencidasArray.push({
                  MES, 
                  DEUDA:Functions.moneyFormat(respuesta[1].deudaInicial),
                  RECUPERACION: Functions.moneyFormat(respuesta[1].cobrado),
                  CANCELADO: Functions.moneyFormat(respuesta[1].cancelado),
                  PERDIDO: Functions.moneyFormat(respuesta[1].deudaFinal)
                });
                promediosArray.push({
                  MES,
                  DEUDA:respuesta[2].promedioDeuda.toFixed(0),
                  VENCIMIENTOS: respuesta[2].promedioVencida.toFixed(0)
                });
              }
          }else alert(respuesta[0]['error']);
        }
      }
      setHistoricoCobranza(totalArray);
      setHistoricoVencida(vencidasArray);
      setHistoricoPromedios(promediosArray);
      //setMesesHead(heads);
    }
  }
  function hanldeClickGrafica(tipo, subtipo){
    console.log(`${window.location.href}`);
    window.open(`${window.location.href}/desgloce/${tipo}/${subtipo}/${empresa}/${agente==''?'N-A':agente}/${rutasE.length==0?'N-A':encodeURIComponent(JSON.stringify(rutasE))}/${fechaI}/${fechaF}`,'_blank',);
  }
  async function handleClickSend(e){
    if(e!==undefined)e.preventDefault();
    const errores = new Array();
    if(serie==''^(folio<=0||folio==''))errores.push('El folio y la Serie deben ser validos');
    if(errores.length>0)alert(errores);
    else{
      let respuesta = 0;
      const url=`/credito.cobranza/igonar/${serie}/${folio}`;
      let body = undefined;
      respuesta = await Functions.PostData(url,body)
      if(respuesta['mensaje']===undefined){
        setfacturasExcluidas(respuesta);
      }else alert(respuesta['mensaje'])
    }
  }
  return (
    <form className='flex flex-col'>
      <div className='flex flex-row justify-evenly mt-3'>
        <div className='flex flex-col m-2'>
          <LabelSelect custom='flex-grow' text='Empresa:' fn={e=>setEmpresa(e.target.value)} value={empresa} list={['Central Mayorista de Páneles','Comercial Domos Copernico']}/>
          <br />
          <LabelSelect custom='flex-grow' text='Reporte:' fn={e=>setReporte(e.target.value)} value={reporte} list={['Cobranza Total','Recuperacion de Cartera Vencida', 'Antigudad promedio de Deuda al fin de mes', 'Reporte Completo']}/>
          <br />
        </div>
        <div className='flex flex-col m-2'>
          <LabelInput custom='flex-grow' text='Fecha Inicial: ' type='date' id='fechaI' change={e=>setFechaI(e.target.value)} value={fechaI} />
          <br />
          <LabelInput custom='flex-grow' text='Fecha Final:' type='date' id='fechaF' change={e=>setFechaF(e.target.value)} value={fechaF} />
        </div>
        <div className='flex flex-col items-center' ref={divRef}>
          <CheckList list={rutas} name='Rutas' Key='nombre' color='cyan-600' visibility={setFocus} fn={setRutasE}/>
          <br />
          <label className='flex flex-row'>Agente
              <Predictive Parameter='nombre'
              id={'agente'} change={setAgente} value={agente} list = {agentes}
              fn={(e)=>{
                divRef.current.childNodes[2].childNodes[1].childNodes[0].childNodes[0].blur();
                  //console.log(divRef.current.childNodes[2].childNodes[1]);
              }}
              />
            </label>
        </div>
      </div>
      <BlueBotton id='boton' text='Aplicar' fn={handleSubmit}/>
      <div ref={divRef2} className='flex flex-row justify-evenly m-2'>
        <CheckList list={facturasExcluidas} name='Excluidas' Key='name' color='cyan-600' visibility={setFocus} fn={setfacturasReincorpradas}/>
        <br />
        <label className='flex flex-row'>Serie
              <Predictive Parameter='nombre'
              id={'serie'} change={setSerie} value={serie} list = {series}
              fn={(e)=>{
                divRef2.current.childNodes[2].childNodes[1].childNodes[0].childNodes[0].blur();
                //console.log(divRef.current.childNodes[2].childNodes[1]);
              }}
              />
              
            </label>
        <br />
        <LabelInput custom='flex-grow' text='Folio:' type='number' id='folio' change={e=>setFolio(e.target.value)} value={folio} fn={e=>handleClickSend(e)}/>
        <br />
        <BlueBotton id='boton2' text='Enviar' fn={handleClickSend}/>
      </div>
      <div className= {`flex flex-col justify-center ${reporte===4?'':'h-56'} ${focus==true?'':'pointer-events-none'}`}>
        <div className={`flex flex-col text-center mt-4 animate__animated ${(reporte===1||reporte===4)?'animate__fadeIn':'animate__fadeOut'} `}
        style={{ display:(reporte===1||reporte===4)?'flex':'none'}}>
          <label>COBRANZA TOTAL</label>
          <div className='flex flex-row justify-center'>
            <label className='flex flex-col text-center'>
              TOTAL
              <Graficas handle={()=>hanldeClickGrafica(1,1)} label='TOTAL' labels={[`${Functions.moneyFormat(total)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[total,0]}/>
            </label>
            <label className='flex flex-col text-center'>
              COBRADO
              <Graficas handle={()=>hanldeClickGrafica(1,2)} label='COBRADO' labels={[`${Functions.moneyFormat(pagado)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[pagado,total-pagado]}/>
            </label>
            <label className='flex flex-col text-center'>
              A TIEMPO
              <Graficas handle={()=>hanldeClickGrafica(1,3)} label='A TIEMPO' labels={[`${Functions.moneyFormat(atiempo)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[atiempo,total-atiempo]}/>
            </label>
            <label className='flex flex-col text-center'>
              FUERA DE PLAZO
              <Graficas handle={()=>hanldeClickGrafica(1,4)} label='FUERA DE PLAZO' labels={[`${Functions.moneyFormat(fueratiempo)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[fueratiempo,total-fueratiempo]}/>
            </label>
            <label className='flex flex-col text-center'>
              NO COBRADO
              <Graficas handle={()=>hanldeClickGrafica(1,5)} label='NO COBRADO' labels={[`${Functions.moneyFormat(total-pagado)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[total-pagado,total-(total-pagado)]}/>
            </label>
          </div>
        </div>
        <div className={`flex flex-col text-center mt-4 animate__animated ${(reporte===2||reporte===4) ? 'animate__fadeIn' : 'animate__fadeOut'} `}
        style={{ display:(reporte===2||reporte===4)?'flex':'none'}}>
          <label>CARTERA VENCIDA</label>
          <div className='flex flex-row justify-center'>
            <label className='flex flex-col text-center'>
              DEUDA INICIAL
              <Graficas handle={()=>hanldeClickGrafica(2,1)} label='CARTERA VENCIDA' labels={[`${Functions.moneyFormat(carteraVencida)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[carteraVencida,1]}/>
            </label>
            <label className='flex flex-col text-center'>
              COBRADO
              <Graficas handle={()=>hanldeClickGrafica(2,2)} label='RECUPERADO' labels={[`${Functions.moneyFormat(carteraVencidaP)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[carteraVencidaP,carteraVencida-carteraVencidaP]}/>
            </label>
            <label className='flex flex-col text-center'>
              CANCELADO
              <Graficas handle={()=>hanldeClickGrafica(2,3)} label='CANCELADO' labels={[`${Functions.moneyFormat(carteraVencidaC)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[carteraVencidaC,carteraVencida-carteraVencidaC]}/>
            </label>
            <label className='flex flex-col text-center'>
              DEUDA FINAl
              <Graficas handle={()=>hanldeClickGrafica(2,4)} label='NO RECUPERADO' labels={[`${Functions.moneyFormat(carteraVencidaNP)}`]} bgColors={['21, 94, 117','rgba(59, 57, 49, 0.15)']} data={[carteraVencidaNP,carteraVencida-carteraVencidaNP]}/>
            </label>
          </div>
        </div>
        <div className={`flex justify-center mt-4 animate__animated ${(reporte===3||reporte===4) ? 'animate__fadeIn' : 'animate__fadeOut'} `}
        style={{ display:(reporte===3||reporte===4)?'flex':'none'}}>
            <table>
              <thead>
                <tr>
                <th className='bg-blue-900 text-white'>Promedio de deuda</th>
                <th className='bg-blue-900 text-white'>Promedio de vencimientos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className=' text-center cursor-pointer select-none' onClick={()=>{hanldeClickGrafica(3,1)}}>{deudaDias}</td>
                  <td className=' text-center cursor-pointer select-none' onClick={()=>{hanldeClickGrafica(3,2)}}>{vencimientosDias}</td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <br />
        <label > Historico </label>
        <div className='flex flex-row space-x-4'>
          <div className='flex flex-col justify-center'>
            <LabelSelect text='Historico:' fn={e=>setHistorico(e.target.value)} value={historico} list={['Historico cobranza Total','Historico de recuperacion de Cartera Vencida', 'Historico promedio de Deuda al fin de mes', 'Historico Completo']}/>
          </div>
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
          <BlueBotton id='botonHistorico' text='Aplicar' fn={handleSubmitHistorico}/>
        </div>
          <div className={`m-2 ${(historico==1||historico==4)?'visible':'hidden'}`}>
            <Table  theme='bg-blue-950 text-white' colsNames={cobranzaHeads} colsKeys={cobranzaKeys} values={historicoCobranza} manage={setHistoricoCobranza}/>
          </div>
          <div className={`m-2 ${(historico==2||historico==4)?'visible':'hidden'}`}>
            <Table theme='bg-blue-950 text-white' colsNames={vencidaHeads} colsKeys={vencidaKeys} values={historicoVencida} manage={setHistoricoVencida}/>
          </div>
          <div className={`m-2 ${(historico==3||historico==4)?'visible':'hidden'}`}>
            <Table theme='bg-blue-950 text-white' colsNames={promediosHeads} colsKeys={promediosKeys} values={historicoPromedios} manage={setHistoricoPromedios}/>
          </div>
      </div>
    </form>
  )
}

export default ReportesCyC