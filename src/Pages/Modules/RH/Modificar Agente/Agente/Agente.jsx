import { useEffect, useState, useRef } from "react"
import AdministrarRelaciones from "./AdministrarRelaciones"
import * as fns from '../../../../../Functions'
import BlueBotton from "../../../../../Components/BlueBotton"
import Predictive from "../../../../../Components/Predictive"

function Agente() {
    const divRef = useRef(null);
    const [relacionesFlag, setRelFlag] = useState(false)
    const [agentes, setAgentes] = useState([]);
    const [esquemas, setEsquemas] = useState([]);
    const [agente, setAgente] = useState('');
    const [nombre, setNombre] = useState('');
    const [esquema, setEsquema] = useState('-1');
    const [estatus, setEstatus] = useState('-1');
    const [tipoAgente, setTipoAgente] = useState('-1');
    const [codigo, setCodigo] = useState('');
    useEffect(()=>{
        async function GetData(){
            const respuesta = await Promise.all([fns.GetData('recursos.humanos/agentes/todos'), fns.GetData('recursos.humanos/esquemas/nombres')]);
            console.log(respuesta)
            if(respuesta['mensaje']===undefined){
                setAgentes(respuesta[0].map(item=>{
                    return {...item, nombreUpper:item.nombre.toUpperCase()};
                }))
                setEsquemas(respuesta[1]);
            }else alert(respuesta['mensaje']);

        }
        GetData();
    },[])


    useEffect(()=>{
        if(agente!=''){
            let result = null;
            const end = agentes.length;
            for(let i=0; i<end; i++){
                if(agentes[i].nombreUpper==agente){
                    result = agentes[i];
                    break;
                }
            }
            if(result!==null){
                setNombre(result.nombre);
                if(result.esquema!==null)
                    setEsquema(result.esquema);
                setEstatus(result.estatus);
                setCodigo(result.codigo);
                setTipoAgente(result.grupo)
            }
        }
    }, [agente])

    async function handdleClickGuardar(){
        if(agente!='-1'){
            const respuesta = await fns.PatchData(`recursos.humanos/agente/${codigo}`,{
                nombre,
                esquema,
                estatus,
                grupo:tipoAgente
            })
            if(respuesta['mensaje']===undefined){
                alert(respuesta)
                window.location.reload();
            }
            else alert(respuesta['mensaje']);
        }
    }
    return (
        <div className="flex flex-col select-none">
            <br />
            <div className="flex flex-row bg-cyan-600  w-96 self-center rounded-xl justify-around">
                <label className=" text-white text-2xl hover:cursor-pointer" 
                onClick={e=>setRelFlag(!relacionesFlag)}>
                    Administrar relaciones
                </label>
            </div>
            {relacionesFlag&&<AdministrarRelaciones />}
            <br />
            <div className="flex flex-row justify-center">
                <div className="flex flex-col">
                    <label>Seleccionar agente:</label>
                    <span className="my-1"/>
                    <label>Nombre: </label>
                    <span className="my-1"/>
                    <label>Esquema por defecto:</label>
                    <span className="my-1"/>
                    <label>Estatus:</label>
                    <label>Tipo:</label>
                </div>
                <span className="mx-2"/>
                <div className="flex flex-col" ref={divRef}>
                    <Predictive Parameter='nombreUpper'
                    id={'agente'} change={setAgente} value={agente} list = {agentes}
                    fn={(e)=>{
                        divRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                        //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                    }}
                    />
                    <span className="my-1"/>
                    <input type="text" value={nombre} onChange={e=>setNombre(e.target.value)}/>
                    <span className="my-1"/>
                    <select value={esquema} onChange={e=>setEsquema(e.target.value)}>
                        <option value="-1">seleccionar opcion</option>
                        {esquemas.map(esq=><option key={esq.nombre} value={esq.nombre}>{esq.nombre}</option>)}
                    </select>
                    <span className="my-1"/>
                    <select value={estatus} onChange={e=>setEstatus(e.target.value)}>
                        <option value="-1">Seleccionar Opcion</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                    </select>
                    <select className="border-2 border-black rounded-md" onChange={e=>setTipoAgente(e.target.value)} value={tipoAgente}>
                        <option value="-1">Seleccionar Opcion</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Dependiente</option>
                    </select>
                </div>
            </div>
            <br />
            <BlueBotton text='Guardar'fn={handdleClickGuardar}/>
        </div>
    )
}

export default Agente

/*
<select value={agente} onChange={e=>setAgente(e.target.value)}>
    <option value="-1">Seleccionar Opcion</option>
    {agentes.map(ag=><option key={ag.codigo} value={ag.codigo}>{ag.nombre}</option>)}
</select>
*/