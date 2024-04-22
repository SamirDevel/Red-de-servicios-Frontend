import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Input from "../../../../Components/Input";
import * as fns from "../../../../Functions"
import BlueBotton from "../../../../Components/BlueBotton";
import Agente from "./Agente";
import Vehiculo from "./Vehiculo";
import Chofer from "./Chofer";

function RegistroAgente() {
    //#region States
    const [nombre, setNombre] = useState('')
    const [empresa, setEmpresa] = useState('-1')
    const [tipoAgente, setTipoAgente] = useState('-1')
    //#endregion
    const params = useParams();

    function getPages(){
        if(params['tipo']==='agente')return <Agente />
        else if(params['tipo']==='chofer')return <Chofer />
        else if(params['tipo']==='vehiculo')return <Vehiculo />
    }

    function getExtras(columna){
        let fragment = null
        if(params.tipo==='chofer'){
            if(columna==1){
                fragment = <label>RFC:</label>
            }else if(columna==2){
                fragment = <Input type="text" />
            }else if(columna==3){
                fragment = <label>Licencia:</label>
            }else if(columna==4){
                fragment = <Input type="text" />    
            }
        }else if(params.tipo==='vehiculo'){
            if(columna==1){
                fragment = <>
                    <label>Placas:</label>
                    <br />
                    <label>Aseguradora:</label>
                    <br />
                    <label>Poliza:</label>
                    <br />
                </>
            }else if(columna==2){
                fragment = <>
                    <Input type="text" />
                    <br />
                    <Input type="text" />
                    <br />
                    <Input type="text" />
                    <br />
                </>
            }else if(columna==3){
                fragment = <>
                    <label>Configuración Vehicular:</label>
                    <br />
                    <label>Tipo de permiso:</label>
                    <br />
                    <label>Numero de permiso (placas):</label>
                    <br />
                </>
            }else if(columna==4){
                fragment = <>
                    <Input type="text" />
                    <br />
                    <Input type="text" placeholder='TPXX00'/>
                    <br />
                    <Input type="text"  />
                </>
            }
        } 
        return fragment;
    }
    async function handleSubmit(e){
        //e.preventDefalt();
        const errores = new Array();
        if(nombre==='')errores.push('El nombre o puede estar vacio')
        if(empresa=='-1')errores.push('La empresa no puede estar vacia')
        if(params['tipo']==='agente'){
            if(tipoAgente=='-1')errores.push('Debe seleccionar un tipo de Agente')
            if(errores.length===0){
                const respuesta = await fns.PostData(`/recursos.humanos/crear/agente`,{nombre, tipo:tipoAgente})
                if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje'])
                else alert(respuesta);
                window.location.reload();
            }
        }
        if(errores.length>0)errores.forEach(error=>alert(error));
    }
    return (
        <div className="flex flex-col">
            <label className=" self-center text-2xl font-bold text-cyan-700"> Registro de {params.tipo}</label>
            <br />
            {getPages()}
            <br />
        </div>
    )
}

export default RegistroAgente
//<BlueBotton text='Crear' id='Crear' fn={handleSubmit}/>