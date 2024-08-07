import { useEffect, useState } from 'react';
import * as fns from '../../../../Functions.js';
import Resumen from './resumen/index.jsx';
import Table from '../../../../Components/Table V2'
import IconButton from '../../../../Components/IconButton.jsx';
import { RxOpenInNewWindow } from 'react-icons/rx'
import FiltrosComision from '../FiltrosComision.jsx';
import { GrHide } from 'react-icons/gr';
function ClaculoComisiones() {
    const [inicio, setInicio] = useState('')
    const [fin, setFin] = useState('')
    const [admins, setAdmins] = useState([])
    const [deps, setDeps] = useState([])
    const [agentes, setAgentes] = useState([])
    const [opciones, setOpciones] = useState([])
    //const [opcion, setOpcion] = useState('')
    const [codigo, setCodigo] = useState('')
    const [objetos, setObjetos] = useState([])
    const [agregados, setAgregados] = useState(0)
    const [guardados, setGuardados] = useState(false)
    const [guardar, setGuardar] = useState(false)
    const [meta, setMeta] = useState(0)
    const [hidded, setHidded] = useState('')
    const [hidden, setHidden] = useState([])
    
    const toSave = []
    const comisionHeads = [
        {text:'Agente', type:'string'},
        {text:'Total',type:'pesos'},
        {text:'Cobranza',type:'pesos'},
        {text:'% Cobrado',type:'%'},
        {text:'Cobranza sin IVA', type:'pesos'},
        {text:'Esquema de evaluacion',type:'string'},
        {text:'% Comision',type:'%'},
        {text:'% Penalizacion',type:'%'},
        {text:'Comision',type:'pesos'},
        {text:'Otros descuentos',type:'pesos'},
        {text:'Anticipo',type:'pesos'},
        {text:'Faltante',type:'pesos'},
        {text:'Abrir',type:'string'},
    ]

    useEffect(()=>{
        async function setData(){
            const respuesta = await Promise.all([
                fns.GetData('recursos.humanos/agentes/todos'),
                fns.GetData('recursos.humanos/meta/ventas')
            ])
            console.log(respuesta)
            if(respuesta[0]['mensaje']===undefined){
                setOpciones(respuesta[0].map(item=>{
                    return {...item, nombreUpper:item.nombre.toUpperCase()};
                }))
                setMeta(respuesta[1]['meta']);
            }else alert(respuesta[0]['mensaje']);

        }
        setData();
    },[])
    useEffect(()=>{
        setDeps([])
        setAdmins([])
        setAgentes([])
    }, [agregados])
    useEffect(()=>{
        if(agregados>0 && deps.length==0 && admins.length==0){
            reloadData();
        }
        if(deps.length!=0 || admins.length!=0){
            setAgentes([...deps,...admins]);
        }
    }, [deps, admins])
    useEffect(()=>{
        if(hidded!=='' && hidden.length===0){
            setHidden(objetos.filter(objeto=>objeto.NOMBRE!==hidded));
            setHidded('')
            setObjetos([])
        }else if(hidded ==='' && hidden.length>0){
            setObjetos(hidden)
            setHidden([])
        }
    }, [hidded, hidden])
    useEffect(()=>{
        console.log(agentes);
        if(guardados===true){
            const repetidos = new Array();
            const array = agentes.map(agente=>{
                if(repetidos.indexOf(agente.agente)===-1)repetidos.push(agente.agente);
                else agente.tipo = 2;
                const cobrado = agente.aTiempo + agente.fueraTiempo;
                const cobradoPorcentaje = (cobrado*100/agente.cobranza)
                const obj={
                    HIDE: <IconButton icon={ <GrHide size={25}/>} fn={()=>setHidded(agente.nombre)}/>,
                    NOMBRE:agente.nombre,
                    Total:agente.cobranza,
                    COBRANZA:cobrado,
                    Porcentaje:cobradoPorcentaje,
                    IVA:(cobrado/1.16),
                    ESQUEMA:agente.esquema,
                    PORCENTAJE:agente.porcentaje,
                    PENALIZADO:agente.penalizacion,
                    COMISION:(cobrado/1.16)*((agente.porcentaje-agente.penalizacion)/100),
                    DESCUENTOS:agente.descuentos,
                    ANTICIPADO:agente.anticipo,
                    FALTANTE:agente.faltante,
                    ABRIR:<IconButton icon={ <RxOpenInNewWindow size={25}/>} id={`${agente.agente}`} fn={()=>window.open(`${window.location.href}/desgloce/${agente.agente}/${inicio}/${fin}/${agente.tipo}`,'_blank',)}/>
                }
                return obj
            })
            setObjetos(array)
        }
    },[agentes])
    useEffect(()=>{
        async function setData(){
            if(guardar===true){
                const end = toSave.length;
                let error = false;
                for(let i=0; i<end; i++){
                    if(toSave[i].faltante<0){
                        error=true;
                        break;
                    }
                }
                if(error===false&&guardados===false&&guardar===true){
                    console.log(toSave)
                    const respuesta = await fns.PostData(`/recursos.humanos/comisiones/ventas/${inicio}/${fin}`,toSave)
                    if(respuesta['mensaje']===undefined){
                        alert(respuesta);
                        setGuardados(true);
                    }else alert(respuesta['mensaje'])
                }else {
                    alert('No puede tener cantidades negativas');
                    setGuardar(false);
                    setGuardados(false);
                }
            }
        }
        setData();
    }, [guardar])
    
    function handleClickAdministrar(){
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        window.open(`${window.location.href}/esquemas`,'_blank',`width=${Math.round(screenWidth*0.4)}, height=${screenHeight<1000?Math.round(screenHeight*0.6) :Math.round(screenHeight*0.457)}`)
    }
    async function reloadData(){
        const respuesta = await Promise.all([fns.GetData(`/recursos.humanos/comisiones/ventas/${codigo!==''?`${codigo}/`:''}${inicio}/${fin}/1`),fns.GetData(`/recursos.humanos/comisiones/ventas/${codigo!==''?`${codigo}/`:''}${inicio}/${fin}/2`)])
        if(respuesta[0]['mensaje']===undefined){
            console.log(respuesta);
            setAdmins(respuesta[0]['registros'])
            setDeps(respuesta[1]['registros'])
            const flag = respuesta[0]['guardados']===true||respuesta[1]['guardados']===true
            setGuardados(flag)
        }else alert(respuesta[0]['mensaje']); 
    }

    async function saveRegistros(){
        console.log(admins)
        if(admins.length>0||deps.length>0){
            if(guardados===false){
                setGuardar(true);
            }else alert('Los regstros ya han sido guardados')
        }else alert('No hay regstros para guardar');
    }

    function getTable(){
        if(guardados===false)
            return<Resumen list={agentes} fechaI={inicio} fechaF={fin} save={guardar} fn={
                (item)=>{
                    const end = toSave.length;
                    let repetida = false;
                    for(let i=0; i<end; i++){
                        if(item.id === toSave[i].id){
                            repetida=true;
                            break;
                        }
                    }
                    if(repetida===false)toSave.push(item);
                }}/>
        if(guardados===true)return<Table  theme='bg-blue-950 text-white w-1' colsHeads={[{text:'Ocultar', type:'string'}, ...comisionHeads]} list={objetos} manage={setObjetos}/>

    }

    function setParams(start, end, code){
        setInicio(start);
        setFin(end)
        setCodigo(code)
        setAgregados(prev=>prev+1)
    }

    return (
    <div className='flex flex-col mx-3 w-full'>
        <span className='my-1'/>
        <button onClick={handleClickAdministrar}
        className = "text-white text-2xl px-2 bg-cyan-600 w-fit h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600">
            Administrar esquemas de comision
        </button>
        <span className='my-1'/>
            <FiltrosComision find={setParams} save={saveRegistros} saved={guardados} agentes={opciones} text='Vendedor'/>
        <span className='my-1'/>
        <div className='self-center'>
            <label className=' font-bold'>Meta de cobranza considerada:</label>
            <span className='mx-1'/>
            <label >{meta}%</label>
        </div>
        <span className='my-1'/>
        <div className='flex flex-col'>
            {getTable()}
        </div>
    </div>
  )
}

export default ClaculoComisiones

/*
<div className='flex flex-row justify-center'>
            <label>Periodo </label>
            <span className='mx-1'/>
            <label>
                Desde:
                <span className='mx-1'/>
                <input type="date" value={inicio} onChange={e=>setInicio(e.target.value)}/>
            </label>
            <span className='mx-6'/>
            <label>
                Hasta:
                <span className='mx-1'/>
                <input type="date" value={fin} onChange={e=>setFin(e.target.value)}/>
            </label>
            <span className='mx-6'/>
            <div className='flex flex-row' ref={divRef}>
                <label>Agente:</label>
                <span className='mx-1'/>
                <Predictive Parameter='nombreUpper'
                id={'agente'} change={setOpcion} value={opcion} list = {opciones}
                fn={(e)=>{
                    divRef.current.childNodes[2].childNodes[0].childNodes[0].blur();
                    //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                }}
                />
            </div>
            <span className='mx-6'/>
            <BlueBotton text='Calcular' fn={e=>setAgregados(prev=>prev+1)}/>
            <span className='mx-6'/>
            {!guardados&&
            <BlueBotton text='Guardar' fn={e=>saveRegistros(prev=>prev+1)}/>} 
        </div>
*/