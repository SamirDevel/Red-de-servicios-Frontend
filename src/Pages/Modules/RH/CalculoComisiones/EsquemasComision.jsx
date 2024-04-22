import { useState, useEffect } from "react"
import * as fns from '../../../../Functions.js';
import Esquema from "./Esquema.jsx";

function EsquemasComision() {
    const [esquemas, setEsquemas] = useState([])
    const [agregado, setAgregado] = useState(0)
    
    useEffect(()=>{
        async function getEsquemas(){
            const respuesta = await fns.GetData('recursos.humanos/esquemas');
            console.log(respuesta)
            setEsquemas(respuesta.map((esquema,id)=>{
                esquema.rangos = esquema.rangos.map((rango,id)=>{return {...rango, id}})
                return {...esquema, id}
            }));
            setAgregado(respuesta.length)
        }
        getEsquemas()
    },[]);

    useEffect(()=>{
        if(agregado>esquemas.length)setEsquemas([...esquemas, {nombre:'', rangos:[], id:agregado}])
    },[agregado])

    function updateEsquema(indice, nuevoEsquema){
        setEsquemas(prev=>prev.map(esquema=>{
            if(esquema.id==indice){
                esquema.nombre = nuevoEsquema.nombre
                esquema.rangos = nuevoEsquema.rangos
            }
            return esquema;
        }))
    }

    function deleteEsquema(indice){
        setEsquemas(prev=>prev.filter(esquema=>esquema.id!=indice))
    }

    async function handdleClickSend(){
        const respuesta = await fns.PostData('recursos.humanos/esquemas',esquemas)
        console.log(respuesta)
        if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje'])
        else{
            alert(respuesta)
        }
        //esquemas.map(esquema=>{
            //console.log(esquema.rangos);
        //})
        //console.log(esquemas);
    }
  return (
    <div className="flex flex-col ml-3">
        <div className="flex flex-row justify-around">
            <label>Esquemas de Comision</label>
            <button onClick={handdleClickSend}
            className = "text-white text-xl px-2 bg-cyan-600 w-fit h-fit rounded-xl hover:bg-white hover:text-cyan-600">
                Guardar
            </button>
        </div>
        <br />
        <div className="mx-3">
            {esquemas.map(esquema=>
                <Esquema key={esquema.id} id={esquema.id} nombre={esquema.nombre} rangos={esquema.rangos} update={updateEsquema} delete={deleteEsquema}/>
            )}
        </div>
        {}
        <label>
            Nuevo esquema:
            <button onClick={e=>setAgregado(agregado+1)}>+</button>
        </label>
    </div>
  )
}

export default EsquemasComision