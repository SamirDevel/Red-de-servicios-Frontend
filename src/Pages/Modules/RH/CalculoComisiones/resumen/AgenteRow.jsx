import { useEffect, useState } from "react"
import SelectEsquema from "../SelectEsquema";
import InputCantidad from "../../../../../Components/InputCantidad";
import * as fns from '../../../../../Functions';
import { RxOpenInNewWindow } from 'react-icons/rx'
import IconButton from "../../../../../Components/IconButton";
import SelectPenalizacion from "../SelectPenalizacion";

function AgenteRow(props){
    const [ventas, setVentas] = useState(getTotal());
    const [ventasSinIVA, setVentasSinIVA] = useState(0);
    const [cobranzaSinIVA, setCobranzaSinIVA] = useState(0);
    const [porcentaje, setPorcentaje] = useState();
    const [comisionAPagar, setcomisionAPagar] = useState(0);
    const [aTiempo, setAtiempo] = useState(getATiempo());
    const [fueraTiempo, setFueratiempo] = useState(getFueraTiempo());
    const [cobrado, setCobrado] = useState(0)
    const [pCobrado, setPCobrado] = useState(0)
    const [penalizado, setPenalizado] = useState(0)
    const [total, setTotal] = useState(0)
    const [descuentos, setDescuentos] = useState(0)
    const [faltante, setFaltante] = useState(0)
    const [anticipo, setAnticipo] = useState(0)
    const [esquema, setEsquema] = useState('')
    
    useEffect(()=>{
        setVentasSinIVA(cobrado/1.16);
    }, [cobrado])
    useEffect(()=>{
        setCobranzaSinIVA(ventas/1.16);
    }, [ventas])
    useEffect(()=>{
        setCobrado(aTiempo + fueraTiempo);
    }, [aTiempo, fueraTiempo])
    useEffect(()=>{
        setcomisionAPagar(ventasSinIVA*((porcentaje-penalizado)/100))
    },[porcentaje, ventasSinIVA, penalizado])
    useEffect(()=>{
        setAnticipo(comisionAPagar/2);
    },[comisionAPagar])
    useEffect(()=>{
        setTotal(comisionAPagar-descuentos)
    },[comisionAPagar, descuentos])

    useEffect(()=>{
        setFaltante(total-anticipo)
    },[anticipo, total])
    useEffect(()=>{
        setPCobrado((cobrado*100)/ventas);
    }, [cobrado, ventas])

    function handdleChangeSelect(porcentaje, esquema){
        //console.log(esquema)
        setPorcentaje(porcentaje);
        setEsquema(esquema)
    }

    function getTotal(){
        if(props.agente['dependientes']!= undefined){
            const dependientes = props.agente['dependientes']
            let sum=0;
            dependientes.forEach(dep=>{
                const agente = dep.codDependiente;
                sum+=agente.cobranza;
            })
            return sum
        }else return props.agente['cobranza']
    }

    function getATiempo(){
        if(props.agente['dependientes']!= undefined){
            const dependientes = props.agente['dependientes']
            let sum=0;
            dependientes.forEach(dep=>{
                const agente = dep.codDependiente;
                sum+=agente.ventasATiempo;
            })
            return sum
        }else return props.agente['ventasATiempo']
    }

    function getFueraTiempo(){
        if(props.agente['dependientes']!= undefined){
            const dependientes = props.agente['dependientes']
            let sum=0;
            dependientes.forEach(dep=>{
                const agente = dep.codDependiente;
                sum+=agente.ventasFueraTiempo;
            })
            return sum
        }else return props.agente['ventasFueraTiempo']
    }
    //console.log(props.agente);
    if(props.save===true){
        const obj={
            nombre:props.agente.nombre,
            agente:props.agente.codigo,
            cobranza:ventas,
            aTiempo,
            fueraTiempo,
            esquema,
            porcentaje,
            comisionAPagar,
            descuentos,
            anticipo,
            faltante,
            grupo:props.agente.grupo,
            penalizacion:penalizado,
            id:props.id
        }
        if(ventas>0)props.fn(obj)
    }
    const array = [
        <td key={`${props.agente.codigo}-0`}>{props.agente.nombre}</td>,
        <td key={`${props.agente.codigo}-1`}>{fns.moneyFormat(ventas)}</td>,
        <td key={`${props.agente.codigo}-2`}>{fns.moneyFormat(cobrado)}</td>,
        <td key={`${props.agente.codigo}-3`}>{fns.fixedString(pCobrado)}%</td>,
        <td key={`${props.agente.codigo}-4`}>{fns.moneyFormat(ventasSinIVA)}</td>,
        <td key={`${props.agente.codigo}-5`}><SelectEsquema fn={handdleChangeSelect} ventas={cobranzaSinIVA} inicial={props.agente.esquema}/></td>,
        <td key={`${props.agente.codigo}-6`}>{fns.fixedString(porcentaje)} %</td>,
        <td key={`${props.agente.codigo}-7`}> <SelectPenalizacion cobrado={pCobrado} fn={setPenalizado}/> </td>,
        <td key={`${props.agente.codigo}-8`}>{fns.moneyFormat(comisionAPagar)}</td>,
        <td className="p-0" key={`${props.agente.codigo}-9`}><InputCantidad value={descuentos} fn={setDescuentos}/></td>,
        <td className="p-0" key={`${props.agente.codigo}-10`}><InputCantidad value={anticipo} fn={setAnticipo}/></td>,
        <td key={`${props.agente.codigo}-11`}>{fns.moneyFormat(faltante)}</td>,
        <td key={`${props.agente.codigo}-12`}>
            <IconButton icon={ <RxOpenInNewWindow size={25}/>} id={`${props.agente.codigo}`} fn={()=>window.open(`${window.location.href}/desgloce/${props.agente.codigo}/${props.fechaI}/${props.fechaF}/${props.agente.grupo}`,'_blank',)}/>
        </td>,
    ]
    if(ventas>0)return (
        <tr key={props.index}>
            {array}
        </tr>
    )
}

export default AgenteRow
//<td key={`${props.agente.codigo}-8`}>{fns.moneyFormat(total)}</td>,