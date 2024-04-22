import { useState, useEffect } from "react"
import AgenteRow from "./AgenteRow"

function AgenteRowDesplegable(props) {
    const [agente, setAgente] = useState(null);
    const [agentePropio, setAgentePropio] = useState(null)

    useEffect(()=>{
        const nuevo = props.agente
        const dependientes = nuevo.dependientes
        const end = dependientes.length;
        for(let i=0; i<end; i++){
            const dependiente = dependientes[i]['codDependiente'];
            if(dependiente.codigo===nuevo.codigo){
                dependiente.esquema = 'Rango por ventas'
                dependiente.grupo = 2
                setAgentePropio(dependiente);
                break;
            }        
        }
        const deps = nuevo.dependientes.filter(codDep=>{
            const dep = codDep['codDependiente'];
            return dep['codigo'] !== nuevo['codigo'];
        })
        nuevo.dependientes = deps
        setAgente(nuevo)
    },[props.agente])

    useEffect(()=>{
    },[agentePropio])

    function getSubagente(){
        if(agentePropio!==null)
            return <AgenteRow save={props.save} fn={props.fn} key={`2-${agentePropio.codigo}`} id={`2-${agentePropio.codigo}`} agente={agentePropio} fechaI={props.fechaI} fechaF={props.fechaF}/>
    }
    function getAgente(){
        if(agente!==null)
            return <AgenteRow save={props.save} fn={props.fn} key={`1-${agente.codigo}`} id={`1-${agente.codigo}`} agente={agente} fechaI={props.fechaI} fechaF={props.fechaF}/>
    }

    return (
        <>
            {getAgente()}
            {getSubagente()}
        </>
    )
}

export default AgenteRowDesplegable