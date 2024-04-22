import { useState, useEffect, useRef } from 'react';
import DeleteButtonIcon from '../../../../../Components/DeleteButtonIcon';
import DomicilioSelect from './Domicilio.Select';
import * as fns from '../../../../../Functions'

function CrearRow({index, doc, deleteFn, number}) {
    const [estado, setEstado] = useState('')
    const [domicilios, setDomicilios] = useState([])
    const [domicilio, setDomicilio] = useState('')
    const [cadena, setCadena] = useState('')
    const [observacion, setObservacion] = useState('')
    const [hora, setHora] = useState('')

    const className = 'justify-center text-center text-xs'
    useEffect(()=>{
        setDomicilios(doc['idCliente']['domicilios']);
        setDomicilio(doc['domicilioElegido']);
    },[])
    useEffect(()=>{
        if(domicilio!==''){
            setEstado(domicilios[domicilio]['municipio'])
            const cad = getCadena(domicilios[domicilio]);
            doc['domicilioElegido'] = cad;
            setCadena(cad);
        }else {
            setEstado('');
            setCadena('')
            doc['domicilioElegido'] = ''
        }
    }, [domicilio])
    useEffect(()=>{
        doc['observacion']=observacion;
    },[observacion])
    useEffect(()=>{
        doc['destino'] = estado;
    },[estado])
    
    function getCadena(dom){
        return `${dom['calle']}-${dom['exterior']}-${dom['colonia']}-${dom['municipio']}-${dom['codigoPostal']}-${dom['estado']}`
    }

    function getDomicilios(cliente){
        console.log(cliente);
        return cliente['domicilios'].map((dom, realIndex)=>{return {...dom, realIndex}}).filter(dom=>{
            //console.log(cliente['rfc']==='XAXX010101000'&&dom['tipoDireccion']==0);
            //console.log(dom['tipoDireccion']==0);
            //console.log(dom);
            if(cliente['rfc']==='XAXX010101000'&&dom['tipoDireccion']==0)return false;
            return true;
        });
    }

    const array = [
        <td className={`${className} w-1`} key={`${doc['serie']}-${doc['folio']}-0`}> <DeleteButtonIcon size={20} fn={e=>{
            e.preventDefault();
            deleteFn(doc)
        }}/></td>,
        <td className={`${className} w-1`} key={`${doc['serie']}-${doc['folio']}-1`}>{number}</td>,
        <td className={`${className} w-52`} key={`${doc['serie']}-${doc['folio']}-2`}>{doc['idCliente']['nombre']}</td>,
        <td className={`${className} w-fit`} key={`${doc['serie']}-${doc['folio']}-3`}>{`${doc['serie']}-${doc['folio']}`}</td>,
        <td className={`${className} w-30`} key={`${doc['serie']}-${doc['folio']}-4`}>
            <DomicilioSelect lista={getDomicilios(doc['idCliente'])} fn={setDomicilio} predef={domicilio}/>
        </td>,
        <td className={`${className} w-60`} key={`${doc['serie']}-${doc['folio']}-6`}>{cadena}</td>,
        <td className={`${className} w-1`} key={`${doc['serie']}-${doc['folio']}-7`}>{doc['unidades']}</td>,
        <td className={`${className} w-1`} key={`${doc['serie']}-${doc['folio']}-8`}>{''}</td>,
        <td className={`${className} w-1`} key={`${doc['serie']}-${doc['folio']}-9`}>{fns.moneyFormat(doc['total'])}</td>,
        <td className={`${className} hidden`} key={`${doc['serie']}-${doc['folio']}-10`}><input type="time" value={hora} onChange={e=>setHora(e.target.value)}/></td>,
        <td className={`${className} w-fit p-0 m-0`} key={`${doc['serie']}-${doc['folio']}-11`}><select className=' w-fit h-7' value={observacion} onChange={e=>setObservacion(e.target.value)}>
                <option value="">-</option>
                <option value="COBRANZA">COBRANZA</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="PLAZO">PLAZO</option>
                <option value="PAQUETERÍA">PAQUETERÍA</option>
                <option value="PAQUETERÍA POR COBRAR">PAQUETERÍA POR COBRAR</option>
                <option value="PAGADA">PAGADA</option>
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                <option value="CONTRARECIBO">CONTRARECIBO</option>
                <option value="FIRMA">FIRMA</option>
            </select>
        </td>,
    ]
    return (
        <tr key={index}>
            {array}
        </tr>
    )
}

export default CrearRow

/*
<select className='w-full h-full' onChange={e=>setDomicilio(e.target.value)} value={domicilio}>
                <option value="">-</option>
                {domicilios.map((dom, indexDom)=>{
                    let cont = 1;
                    const tipo = (()=>{
                        if(dom['tipoDireccion']===0)return 'Fiscal'
                        if(dom['tipoDireccion']===1)return `Envio${cont++}`;
                    })()
                    const cadena = getCadena(dom);
                return <option value={indexDom} key={`${indexDom}-${cadena}`}>{tipo}</option>
                })}
            </select>
*/