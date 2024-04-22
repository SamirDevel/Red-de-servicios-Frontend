import { useEffect, useState } from "react"
import SelectEsquema from "../SelectEsquema";
import InputCantidad from "../../../../../Components/InputCantidad";
import * as fns from '../../../../../Functions';
import { RxOpenInNewWindow } from 'react-icons/rx'
import IconButton from "../../../../../Components/IconButton";

function AgenteRow(props){
    const [ventas, setVentas] = useState(getTotal());
    const [ventasSinIVA, setVentasSinIVA] = useState(0);
    const [porcentaje, setPorcentaje] = useState();
    const [comisionAPagar, setcomisionAPagar] = useState(0);
    const [aTiempo, setAtiempo] = useState(getATiempo());
    const [fueraTiempo, setFueratiempo] = useState(getFueraTiempo());
    const [total, setTotal] = useState(0)
    const [descuentos, setDescuentos] = useState(0)
    const [faltante, setFaltante] = useState(0)
    const [anticipo, setAnticipo] = useState(0)
    const [esquema, setEsquema] = useState('')
    const [first, setFirst] = useState(false);
    
    useEffect(()=>{
        setVentasSinIVA(ventas/1.16);
    }, [ventas])
    useEffect(()=>{
        setcomisionAPagar(ventasSinIVA*(porcentaje/100))
    },[porcentaje])
    
    useEffect(()=>{
        if(anticipo===0&&comisionAPagar>0&&first===false){
            setAnticipo(comisionAPagar/2);
            setFirst(true);
        }
    },[comisionAPagar, anticipo])

    useEffect(()=>{
        setTotal(comisionAPagar-descuentos)
    },[comisionAPagar, descuentos])

    useEffect(()=>{
        setFaltante(total-anticipo)
    },[anticipo, total])

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
                sum+=agente.ventas;
            })
            return sum
        }else return props.agente['ventas']
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
            id:props.id
        }
        if(ventas>0)props.fn(obj)
    }
    const array = [
        <td key={`${props.agente.codigo}-0`}>{props.agente.nombre}</td>,
        <td key={`${props.agente.codigo}-1`}>{fns.moneyFormat(ventas)}</td>,
        <td key={`${props.agente.codigo}-2`}>{fns.moneyFormat(ventasSinIVA)}</td>,
        <td key={`${props.agente.codigo}-3`}>{fns.moneyFormat(aTiempo)}</td>,
        <td key={`${props.agente.codigo}-4`}>{fns.moneyFormat(fueraTiempo)}</td>,
        <td key={`${props.agente.codigo}-5`}><SelectEsquema fn={handdleChangeSelect} ventas={ventasSinIVA} inicial={props.agente.esquema}/></td>,
        <td key={`${props.agente.codigo}-6`}>{porcentaje}</td>,
        <td key={`${props.agente.codigo}-7`}>{fns.moneyFormat(comisionAPagar)}</td>,
        <td className="p-0" key={`${props.agente.codigo}-8`}><InputCantidad value={descuentos} fn={setDescuentos}/></td>,
        <td className="p-0" key={`${props.agente.codigo}-9`}><InputCantidad value={anticipo} fn={setAnticipo}/></td>,
        <td key={`${props.agente.codigo}-10`}>{fns.moneyFormat(faltante)}</td>,
        <td key={`${props.agente.codigo}-11`}>
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