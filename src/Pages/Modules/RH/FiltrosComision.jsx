import { useState, useRef, useEffect } from "react";
import Predictive from "../../../Components/Predictive";
import BlueBotton from "../../../Components/BlueBotton";
import { fns } from "../../../Functions";

function FiltrosComision({save, find, saved, agentes, text}) {
    const divRef = useRef(null);

    const [inicio, setInicio] = useState('')
    const [fin, setFin] = useState('')
    const [agente, setAgente] = useState('')
    const [agenteE, setAgenteE] = useState('')

    useEffect(()=>{
        fns.setStateE(agente,agentes,'nombreUpper',setAgenteE)
    },[agente])

    async function handdleSubmit(e){
        e.preventDefault();
        if(inicio==''||fin=='')alert('Debe elegir ambas fechas')
        else {
            const fechaI = new Date(inicio)
            const fechaF = new Date(fin)
            if(fechaI>fechaF)alert('La fecha de inicio no puede ser mayor a la del final')
            else await find(inicio, fin, agenteE['codigo']!==undefined?agenteE['codigo']:'');
        }
    }
    async function handdleClick(){
        await save();
    }
    return (
        <form className='flex flex-row justify-center' onSubmit={handdleSubmit}>
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
                <label>{text}</label>
                <span className='mx-1'/>
                <Predictive Parameter='nombreUpper'
                id={'agente'} change={setAgente} value={agente} list = {agentes}
                fn={(e)=>{
                    divRef.current.childNodes[2].childNodes[0].childNodes[0].blur();
                    //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                }}
                />
            </div>
            <span className='mx-6'/>
            <BlueBotton text='Calcular' fn={handdleSubmit}/>
            <span className='mx-6'/>
            {!saved&&
            <BlueBotton text='Guardar' fn={handdleClick}/>} 
        </form>
    )
}

export default FiltrosComision