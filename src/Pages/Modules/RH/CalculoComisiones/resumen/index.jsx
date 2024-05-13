import { useState, useEffect } from "react"
import AgenteRow from "./AgenteRow"
import AgenteRowDesplegable from "./AgenteRowDesplegable"

function resumen(props) {
    function getRows(){
        return props.list.map((agente)=>{  
            if(agente.dependientes===undefined)
                return <AgenteRow save={props.save} fn={props.fn} key={agente.codigo} id={agente.codigo} agente={agente} fechaI={props.fechaI} fechaF={props.fechaF}/>
            else return  <AgenteRowDesplegable save={props.save} fn={props.fn} key={agente.codigo} agente={agente} fechaI={props.fechaI} fechaF={props.fechaF}/>
        })
    }

    return (
        <div className="flex flex-row justify-center">
            <table className="relative">
                <thead className="bg-blue-950 text-white">
                    <tr>
                        <th>Agente</th>
                        <th>Total</th>
                        <th>Cobranza</th>
                        <th>% Cobrado</th>
                        <th>Cobranza sin IVA</th>
                        <th>Esquema de evaluación</th>
                        <th>% Comision</th>
                        <th>% Penalizacion</th>
                        <th>Comision</th>
                        <th>Otros descuentos</th>
                        <th>Anticipo</th>
                        <th>Faltante</th>
                        <th>Abrir</th>
                    </tr>
                </thead>
                <tbody>
                    {getRows()}
                </tbody>
            </table>
        </div>
    )
}

export default resumen

/*
*/