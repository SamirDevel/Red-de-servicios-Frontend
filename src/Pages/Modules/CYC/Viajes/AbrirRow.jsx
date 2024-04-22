import { useEffect, useState } from "react"
import InputCantidad from "../../../../Components/InputCantidad"
import { fns } from "../../../../Functions";

function AbrirRow({documento, index}) {
    const [pago, setPago] = useState(0);
    useEffect(()=>{
        setPago(documento.total)
    }, [])
    useEffect(()=>{
        documento.pago=pago;
    },[pago])
    const arry = [
        <td key={`${documento.serie}-${documento.folio}-0`}>{index +1}</td>,
        <td key={`${documento.serie}-${documento.folio}-1`}>{documento.rs}</td>,
        <td key={`${documento.serie}-${documento.folio}-2`}>{`${documento.serie}-${documento.folio}`}</td>,
        <td key={`${documento.serie}-${documento.folio}-3`}>{documento.destino}</td>,
        <td key={`${documento.serie}-${documento.folio}-4`}>{documento.domicilio}</td>,
        <td key={`${documento.serie}-${documento.folio}-5`}>{documento.unidades}</td>,
        <td key={`${documento.serie}-${documento.folio}-6`}>{documento.peso}</td>,
        <td key={`${documento.serie}-${documento.folio}-7`}>{fns.moneyFormat(documento.total)}</td>,
        <td key={`${documento.serie}-${documento.folio}-9`}><InputCantidad value={pago} fn={setPago}/></td>,
        <td key={`${documento.serie}-${documento.folio}-10`}>{documento.observacion}</td>,
    ]
    return (
        <tr>
            {arry}
        </tr>
    )
}

export default AbrirRow