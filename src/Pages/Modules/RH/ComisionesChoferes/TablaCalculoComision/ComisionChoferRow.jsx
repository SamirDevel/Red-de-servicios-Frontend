import { useState, useEffect } from "react"
import { fns } from "../../../../../Functions"
import InputCantidad from "../../../../../Components/InputCantidad"

function ComisionChoferRow({raw, totDes, tot, save, fn}){
    const [subtotal, setSubtotal] = useState(0)
    const [descuento, setDescuento] = useState(0)
    const [total, setTotal] = useState(0)
    const [motivo, setMotivo] = useState('')

    useEffect(()=>{
        setSubtotal(raw.TOTALF+raw.TOTALJ+raw.TOTALL+raw.TOTALA)
    }, [raw])

    useEffect(()=>{
        setTotal(subtotal-descuento);
    }, [subtotal, descuento])
    useEffect(()=>{
        raw.descuento = descuento;
        totDes()
    }, [descuento])
    useEffect(()=>{
        raw.totalApagar = total;
        tot()
    }, [total])

    if(save===true){
        const obj={
            chofer:raw.CODIGO,
            foraneos:raw.FORANEOS,
            pagadoForaneos:raw.TOTALF,
            aJalisco:raw.JALISCO,
            pagadoJalisco:raw.TOTALJ,
            paradas:raw.LOCALES,
            pagadoParadas:raw.TOTALL,
            auxiliar:raw.AUXILIAR,
            pagadoAuxiliar:raw.TOTALA,
            totalApagar:total,
            descuentos:descuento,
            motivo
        }
        fn(obj)
    }

    return (
        <tr>
            <td>{raw.CODIGO}</td>
            <td>{raw.NOMBRE}</td>
            <td>{raw.FORANEOS}</td>
            <td>{fns.moneyFormat(raw.TOTALF)}</td>
            <td>{raw.JALISCO}</td>
            <td>{fns.moneyFormat(raw.TOTALJ)}</td>
            <td>{raw.LOCALES}</td>
            <td>{fns.moneyFormat(raw.TOTALL)}</td>
            <td>{raw.VIAJES}</td>
            <td>{raw.AUXILIAR}</td>
            <td>{fns.moneyFormat(raw.TOTALA)}</td>
            <td>{fns.moneyFormat(subtotal)}</td>
            <td>
                <InputCantidad type='number' value={descuento} fn={setDescuento}/>
            </td>
            <td>
                <textarea cols="20" rows="5" value={motivo} onChange={e=>setMotivo(e.target.value)}/>
            </td>
            <td>{fns.moneyFormat(total)}</td>
            <td>{raw.BTN}</td>
        </tr>
    )
}

export default ComisionChoferRow