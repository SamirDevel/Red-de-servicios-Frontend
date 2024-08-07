import { useState, useEffect } from 'react'
import FiltrosComision from '../FiltrosComision'
import { fns } from '../../../../Functions'
import Table from '../../../../Components/Table V2'
import OpenBtn from '../../../../Components/OpenButtonIcon'
import Input from '../../../../Components/Input'
import TablaComisionChofer from './TablaCalculoComision'
import { GrHide } from "react-icons/gr";
import IconButton from '../../../../Components/IconButton'

function ComisionChofer() {
    const [inicio, setInicio] = useState('')
    const [final, setFinal] = useState('')
    const [guardados, setGuardados] = useState(false)
    const [choferes, setChoferes] = useState([])
    const [chofer, setChofer] = useState('')
    const [valoresViaje, setValoresViaje] = useState([])
    const [objetos, setObjetos] = useState([])
    const [totales, setTotales] = useState([])
    const [agregados, setAgregados] = useState(0)
    const [guardar, setGuardar] = useState(false)
    const [hidded, setHidded] = useState('')
    const [hidden, setHidden] = useState([])
    const toSave = []

    const comisionHeads = [
        {text:'Ocultar',type:'string'},
        {text:'Codigo',type:'string'},
        {text:'Nombre', type:'string'},
        {text:'Foraneos',type:'string'},
        {text:'Pago',type:'pesos'},
        {text:'A Jalisco',type:'string'},
        {text:'Pago',type:'pesos'},
        {text:'Locales',type:'string'},
        {text:'Pago',type:'pesos'},
        {text:'Viajes',type:'string'},
        {text:'Auxiliar',type:'string'},
        {text:'Pago',type:'pesos'},
        {text:'Subtotal',type:'pesos'},
        {text:'Descuentos',type:'pesos'},
        {text:'Motivo',type:'string'},
        {text:'Total',type:'pesos'},
        {text:'Abrir',type:'string'},
    ]
    useEffect(()=>{
        async function getData(){
            const respuesta = await Promise.all([
                fns.GetData(`/recursos.humanos/bonos.chofer`),
                fns.GetData('recursos.humanos/chofer/todos/ACTIVO')
            ])
            console.log(respuesta)
            setValoresViaje(respuesta[0])
            setChoferes(respuesta[1].map(item=>{
                return {...item, nombreUpper:item['nombre'].toUpperCase()}
            }))
        }
        getData()
    }, [])
    useEffect(()=>{
        if(agregados>0&&objetos.length===0)getViajes(inicio, final,chofer);
    }, [agregados])
    useEffect(()=>{
        async function setData(){
            if(guardar===true){
                const end = toSave.length;
                let error = false;
                for(let i=0; i<end; i++){
                    const element = toSave[i];
                    if(element.totalApagar<0){
                        error=true;
                        alert('No puede tener cantidades negativas');
                        break;
                    }
                    if(element.recalculo>0&&element.motivo===''){
                        error=true;
                        alert('No puede tener un ajuste sin un motivo');
                        break;
                    }
                    if(element.recalculo!==0&&element.tipoRecalculo===''){
                        error=true;
                        alert('Debe seleccionar el tipo de recalculo de comision');
                        break;
                    }
                }
                if(error===false&&guardados===false&&guardar===true){
                    console.log(toSave)
                    const respuesta = await fns.PostData(`/recursos.humanos/comisiones/choferes/${inicio}/${final}`,toSave)
                    if(respuesta['mensaje']===undefined){
                        alert(respuesta);
                        setGuardados(true);
                    }else alert(respuesta['mensaje'])
                }else {
                    setGuardar(false);
                    setGuardados(false);
                }
            }
        }
        setData();
    }, [guardar])
    useEffect(()=>{
        if(hidded!=='' && hidden.length===0){
            setHidden(objetos.filter(objeto=>objeto.CODIGO!==hidded));
            setHidded('')
            setObjetos([])
        }else if(hidded ==='' && hidden.length>0){
            setObjetos(hidden)
            setHidden([])
        }
    }, [hidded, hidden])

    function getValue(number=0){
        let result = 0;
        valoresViaje.forEach(valor=>{
            if(valor['tipo']===number)result =  valor['valor']
        })
        return result;
    }
    function getUrl(chofer, fechaI, fechaF, tipo){
        return `${window.location.href}/desgloce/${chofer}/${fechaI}/${fechaF}/${tipo}`
    }
    function setObjetosGuardados(array, counters, fechaI, fechaF){
        setObjetos(array.map((item)=>{
            const TOTALF = item['pagadoForaneos'];
            const TOTALJ = item['pagadoJalisco'];
            const TOTALL= item['pagadoParadas'];
            const TOTALA = item['pagadoAuxiliar'];
            const subtotal = TOTALF+TOTALJ+TOTALL+TOTALA;
            const tipoRecalculo = item['tipoRecalculo'];
            const recalculo = item['recalculo'];
            const total = (()=>{
                if(tipoRecalculo==='')return 0
                else if(tipoRecalculo==='+')return subtotal + recalculo
                else if(tipoRecalculo==='-')return subtotal - recalculo
            })()
            counters.contF += TOTALF;
            counters.contJ += TOTALJ;
            counters.contL += TOTALL;
            counters.contA += TOTALA;
            counters.contVF += item['foraneos'];
            counters.contVJ += item['aJalisco'];
            counters.contVL += item['paradas'];
            counters.contVA += item['auxiliar'];
            counters.contS += subtotal
            counters.contT += total
            counters.contV += item['viajes'];
            counters.contD += recalculo;
            return {
                HIDE: <IconButton icon={ <GrHide size={25}/>} fn={()=>setHidded(item['chofer'])}/>,
                CODIGO:item['chofer'],
                NOMBRE:item['nombre'].replace(/ /g,'\n'),
                FORANEOS:item['foraneos'],
                TOTALF,
                JALISCO:item['aJalisco'],
                TOTALJ,
                LOCALES:item['paradas'],
                TOTALL,
                VIAJES:item['viajes'],
                AUXILIAR:item['auxiliar'],
                TOTALA,
                SUBTOTAL:subtotal,
                RECALCULOS:item['recalculo'],
                MOTIVO:item['motivo'],
                TOTAL:total,
                BTN:<OpenBtn size={28} url={getUrl(item.codigo!==undefined?item.codigo:item.chofer, fechaI, fechaF, item['tipo'])}/>
            }
        }))
    }
    function setObjetosNoGuardados(array, counters, fechaI, fechaF){
        setObjetos(array.map(item=>{
            const TOTALF = item['foraneos']*getValue(1);
            const TOTALJ = item['jaliscos']*getValue(2);
            const TOTALL= item['paradas']*getValue(3);
            const TOTALA = item['aux']*getValue(4);
            const sum = TOTALF+TOTALJ+TOTALL+TOTALA;
            counters.contF += TOTALF;
            counters.contJ += TOTALJ;
            counters.contL += TOTALL;
            counters.contA += TOTALA;
            counters.contV += item['viajes'];
            counters.contVF += item['foraneos'];
            counters.contVJ += item['jaliscos'];
            counters.contVL += item['paradas'];
            counters.contVA += item['aux'];
            counters.contT += sum
            return {
                CODIGO:item['codigo'],
                NOMBRE:item['nombre'].replace(/ /g,'\n'),
                FORANEOS:item['foraneos'],
                TOTALF,
                JALISCO:item['jaliscos'],
                TOTALJ,
                LOCALES:item['paradas'],
                TOTALL,
                VIAJES:item['viajes'],
                AUXILIAR:item['aux'],
                TOTALA,
                SUBTOTAL:sum,
                AJUSTES:0,
                MOTIVO:0,
                TOTAL:sum,
                BTN:<OpenBtn size={28} url={getUrl(item.codigo!==undefined?item.codigo:item.chofer, fechaI, fechaF, item['tipo'])}/>
            }
        }))
    }
    function setParams(start, end, code){
        setInicio(start);
        setFinal(end)
        setChofer(code)
        setAgregados(prev=>prev+1)
        setObjetos([])
    }
    async function getViajes(inicio, fin, codigo){
        setInicio(inicio);
        setFinal(fin);
        const respuesta = await Promise.all([
            fns.GetData(`/recursos.humanos/comisiones/choferes/${codigo!==''?`${codigo}/`:''}${inicio}/${fin}/1`),
            fns.GetData(`/recursos.humanos/comisiones/choferes/${codigo!==''?`${codigo}/`:''}${inicio}/${fin}/2`),
        ])
        console.log(respuesta);
        const flag = respuesta[0]['guardados']
        setGuardados(flag);
        const conts = {
            contF: 0,
            contJ: 0,
            contL: 0,
            contA: 0,
            contV: 0,
            contVF: 0,
            contVJ: 0,
            contVL: 0,
            contVA: 0,
            contT: 0, 
            contD:0,
            contS:0
        }
        const array = respuesta[0]['registros'].concat(respuesta[1]['registros']);
        if(flag===false){
            setObjetosNoGuardados(array, conts, inicio, fin)
        }
        else setObjetosGuardados(array, conts, inicio, fin)
        setTotales([
            {
                a:'',
                b:'',
                contVF:conts.contVF,
                contF:conts.contF,
                contVJ:conts.contVJ,
                contJ:conts.contJ,
                contVL:conts.contVL,
                contL:conts.contL,
                contV:conts.contV,
                contVA:conts.contVA,
                contA:conts.contA,
                contS:conts.contS,
                c:'',
                d:'',
                contT:conts.contT
            }
        ])
        //setChoferes(respuesta[0]);
        //setAuxiliares(respuesta[1]);
    }
    function handleClickAdministrar(){
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        window.open(`${window.location.href}/valores`,'_blank',`width=${Math.round(screenWidth*0.41)}, height=${screenHeight<1000?Math.round(screenHeight*0.6) :Math.round(screenHeight*0.457)}`)
    }

    async function saveRegistros(){
        if(objetos.length>0){
            if(guardados===false){
                setGuardar(true);
            }else alert('Los regstros ya han sido guardados')
        }else alert('No hay regstros para guardar');
    }

    function getTable(){
        if(guardados===false)
            return<TablaComisionChofer rows={objetos} fechaI={inicio} fechaF={final} save={guardar} fn={
                (item)=>{
                    toSave.push(item);
                }}/>
        if(guardados===true){
            const newTotals = totales.map(total=>{
                return {extra:'', ...total}
            })
            return <Table  theme='bg-blue-950 text-white w-1' colsHeads={comisionHeads} list={objetos} manage={setObjetos} foots={newTotals}/>
        }
    }

    return (
        <div className='flex flex-col mx-3 w-full items-center'>
            <br />
            <button onClick={handleClickAdministrar}
            className = "text-white text-2xl px-2 bg-cyan-600 w-fit h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600">
                Administrar valores de viajes
            </button>
        <br />
            <FiltrosComision saved={guardados} save={saveRegistros} find={setParams} agentes={choferes} text='Chofer: '/>
            <br />
            <div className={`${objetos.length>0?'visible':'hidden'} text-center`}>
                <label>Evaluacion de los viajes</label>
                <div className='flex flex-row justify-center'>
                    <div className='flex flex-col'>
                        {valoresViaje.map((valor, index)=>{
                            return <label className='flex flex-row' key={`nombre-${index}`}>
                                {valor['nombre']}
                            </label>
                        })}
                    </div>
                    <span className='mx-2'/>
                    <div className='flex flex-col'>
                        {valoresViaje.map((valor, index)=>{
                            return <label className='flex flex-row' key={`valor-${index}`}>
                                ${valor['valor']}
                            </label>
                        })}
                    </div>
                </div>
                <br />
                {getTable()}
            </div>
        </div>
    )
}

export default ComisionChofer