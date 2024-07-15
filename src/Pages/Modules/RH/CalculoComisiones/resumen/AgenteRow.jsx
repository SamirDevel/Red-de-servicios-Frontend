import { useEffect, useState } from "react"
import SelectEsquema from "../SelectEsquema";
import InputCantidad from "../../../../../Components/InputCantidad";
import * as fns from '../../../../../Functions';
import { RxOpenInNewWindow } from 'react-icons/rx'
import IconButton from "../../../../../Components/IconButton";
import SelectPenalizacion from "../SelectPenalizacion";

function AgenteRow({agente, save, id, fn, fechaI, fechaF, index}){
    const [agenteE, setAgenteE] = useState(agente);
    const [ventas, setVentas] = useState(0);
    const [ventasSinIVA, setVentasSinIVA] = useState(0);
    const [porcentaje, setPorcentaje] = useState(0);
    const [comisionAPagar, setcomisionAPagar] = useState(0);
    const [aTiempo, setAtiempo] = useState(0);
    const [fueraTiempo, setFueratiempo] = useState(0);
    const [cobrado, setCobrado] = useState(0)
    const [pCobrado, setPCobrado] = useState(0)
    const [penalizado, setPenalizado] = useState(0)
    const [total, setTotal] = useState(0)
    const [descuentos, setDescuentos] = useState(0)
    const [faltante, setFaltante] = useState(0)
    const [anticipo, setAnticipo] = useState(0)
    const [esquema, setEsquema] = useState('')
    useEffect(()=>{
        const ventasToal = getTotal()
        const aTiempoTotal = getATiempo()
        const fueraTiempoTotal = getFueraTiempo()
        setVentas(ventasToal)
        setAtiempo(aTiempoTotal)
        setFueratiempo(fueraTiempoTotal)
    }, [agenteE])
    useEffect(()=>{
        setCobrado(aTiempo + fueraTiempo);
    }, [aTiempo, fueraTiempo])
    useEffect(()=>{
        setPCobrado((cobrado*100)/ventas);
    }, [cobrado, ventas])
    useEffect(()=>{
        setVentasSinIVA(cobrado/1.16);
    }, [cobrado])
    useEffect(()=>{
        setcomisionAPagar(ventasSinIVA*((porcentaje-penalizado)/100))
    },[porcentaje, ventasSinIVA, penalizado])
    useEffect(()=>{
        setTotal(comisionAPagar-descuentos)
    },[comisionAPagar, descuentos])
    useEffect(()=>{
        setAnticipo(total/2);
    },[total])
    useEffect(()=>{
        setFaltante(total-anticipo)
    },[anticipo, total])
    /*
    useEffect(()=>{
        console.log(anticipo)
    }, [anticipo])
    
    */
    
    function handdleChangeSelect(porcentaje, esquema){
        //console.log(esquema)
        setPorcentaje(porcentaje);
        setEsquema(esquema)
    }

    function getTotal(){
        if(agente['grupo'] === 1){
            const dependientes = agente['dependientes']
            let sum=0;
            dependientes.forEach(dep=>{
                const agente = dep.codDependiente;
                sum+=agente.cobranza;
            })
            return sum
        }else return agente['cobranza']
    }

    function getATiempo(){
        if(agente['grupo'] === 1){
            const dependientes = agente['dependientes']
            let sum=0;
            dependientes.forEach(dep=>{
                const agente = dep.codDependiente;
                sum+=agente.ventasATiempo;
            })
            return sum
        }else return agente['ventasATiempo']
    }

    function getFueraTiempo(){
        if(agente['grupo'] === 1){
            const dependientes = agente['dependientes']
            let sum=0;
            dependientes.forEach(dep=>{
                const agente = dep.codDependiente;
                sum+=agente.ventasFueraTiempo;
            })
            return sum
        }else return agente['ventasFueraTiempo']
    }
    if(save===true){
        const obj={
            nombre:agente.nombre,
            agente:agente.codigo,
            cobranza:ventas,
            aTiempo,
            fueraTiempo,
            esquema,
            porcentaje,
            comisionAPagar,
            descuentos,
            anticipo,
            faltante,
            grupo:agente.grupo,
            penalizacion:penalizado,
            id:id
        }
        if(ventas>0)fn(obj)
    }
    const array = [
        <td key={`${agente.codigo}-0`}>{agente.nombre}</td>,
        <td key={`${agente.codigo}-1`}>{fns.moneyFormat(ventas)}</td>,
        <td key={`${agente.codigo}-2`}>{fns.moneyFormat(cobrado)}</td>,
        <td key={`${agente.codigo}-3`}>{fns.fixed2String(pCobrado)}%</td>,
        <td key={`${agente.codigo}-4`}>{fns.moneyFormat(ventasSinIVA)}</td>,
        <td key={`${agente.codigo}-5`}><SelectEsquema fn={handdleChangeSelect} ventas={ventasSinIVA} inicial={agente.esquema}/></td>,
        <td key={`${agente.codigo}-6`}>{fns.fixed2String(porcentaje)} %</td>,
        <td key={`${agente.codigo}-7`}> <SelectPenalizacion cobrado={pCobrado} fn={setPenalizado}/> </td>,
        <td key={`${agente.codigo}-8`}>{fns.moneyFormat(comisionAPagar)}</td>,
        <td className="p-0" key={`${agente.codigo}-9`}><InputCantidad value={descuentos} fn={setDescuentos}/></td>,
        <td className="p-0" key={`${agente.codigo}-10`}><InputCantidad value={anticipo} fn={setAnticipo}/></td>,
        <td key={`${agente.codigo}-11`}>{fns.moneyFormat(faltante)}</td>,
        <td key={`${agente.codigo}-12`}>
            <IconButton icon={ <RxOpenInNewWindow size={25}/>} id={`${agente.codigo}`} fn={()=>window.open(`${window.location.href}/desgloce/${agente.codigo}/${fechaI}/${fechaF}/${agente.grupo}`,'_blank',)}/>
        </td>,
    ]
    if(ventas>0)return (
        <tr key={index}>
            {array}
        </tr>
    )
}

export default AgenteRow
//<td key={`${agente.codigo}-8`}>{fns.moneyFormat(total)}</td>,