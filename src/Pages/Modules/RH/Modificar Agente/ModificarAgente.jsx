import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import Agente from "./Agente/Agente";
import Chofer from "./Agente/Chofer";
import Vehiculo from "./Agente/Vehiculo";

function ModificarAgente() {
    const params = useParams();
    function getPage(){
        if(params['tipo']=='agente')
            return <Agente />
        if(params['tipo']=='chofer')
            return <Chofer />
        if(params['tipo']=='vehiculo')
            return <Vehiculo />
    }
    return(
        <>
        {getPage()}
        </>
    )
}

export default ModificarAgente