import { useState, useEffect, useRef } from "react"

function DomicilioSelect({lista, fn, predef}){
    const [selected, setSelected] = useState(predef);
    const [displayed, setDisplayed] = useState('');

    const selRef = useRef(null);

    useEffect(()=>{
        selRef.current.blur();
        fn(selected);
    }, [selected])

    function handdleChangeSelect(e){
        setSelected(e.target.value);
    }
    function handdleFocus(){
        setDisplayed('');
    }
    function handdleBlur(){
        if(selected!=='')setDisplayed(lista[selected]['municipio']);
    }
    function getCadena(dom){
        return `${dom['calle']}-${dom['exterior']}-${dom['colonia']}-${dom['municipio']}-${dom['codigoPostal']}-${dom['estado']}`
    }
    function getTipo(dom, n){
        if(dom['tipoDireccion']===0)return 'Fiscal'
        if(dom['tipoDireccion']===1)return `Envio${n}`;
    }
    return (
        <select className='w-full h-full'
        onChange={handdleChangeSelect} 
        value={selected}
        onFocus={handdleFocus}
        onBlur={handdleBlur}
        ref={selRef}>
            <option value="">{displayed!==''?displayed:'-'}</option>
            {lista.map((element, indexelement)=>{
                let cont = 1;
                const tipo = getTipo(element, cont++)
                const cadena = getCadena(element);
            return <option value={element['realIndex']} key={`${indexelement}-${cadena}`}>{displayed!==''?displayed:tipo}</option>
            })}
        </select>
    )
}

export default DomicilioSelect