import { useState, useEffect } from "react"
import * as fns from '../../../../Functions.js';
import Esquema from "./Esquema.jsx";
import Penalizacion from "./Penalizacion.jsx";
import Input from "../../../../Components/Input.jsx";

function EsquemasComision() {
    const [esquemas, setEsquemas] = useState([])
    const [penalizaciones, setPenalizaciones] = useState([])
    const [agregado, setAgregado] = useState(0)
    const [agregadoP, setAgregadoP] = useState(0)
    const [meta, setMeta] = useState(0)
    
    useEffect(()=>{
        async function getEsquemas(){
            const respuesta = await Promise.all([
                fns.GetData('recursos.humanos/esquemas'),
                fns.GetData('recursos.humanos/penalizaciones'),
                fns.GetData('recursos.humanos/meta/ventas'),
            ])
            console.log(respuesta)
            setEsquemas(respuesta[0].map((esquema,id)=>{
                esquema.rangos = esquema.rangos.map((rango,id)=>{return {...rango, id}})
                return {...esquema, id}
            }));
            setPenalizaciones(respuesta[1])
            setMeta(respuesta[2]['meta'])
            setAgregadoP(respuesta[1].length)
            setAgregado(respuesta[0].length)
        }
        getEsquemas()
    },[]);

    useEffect(()=>{
        if(agregado>esquemas.length)setEsquemas([...esquemas, {nombre:'', rangos:[], id:agregado}])
    },[agregado])
    useEffect(()=>{
        if(agregadoP>penalizaciones.length)setPenalizaciones([...penalizaciones, {motivo:'', valor:0, id:agregadoP}])
    },[agregadoP])

    function updateEsquema(indice, nuevoEsquema){
        setEsquemas(prev=>prev.map(esquema=>{
            if(esquema.id==indice){
                esquema.nombre = nuevoEsquema.nombre
                esquema.rangos = nuevoEsquema.rangos
            }
            return esquema;
        }))
    }
    function updatePenalizacion(indice, nuevo){
        setPenalizaciones(prev=>prev.map(pen=>{
            if(pen.id==indice){
                pen.motivo = nuevo.motivo
                pen.valor = nuevo.valor
            }
            return pen;
        }))
    }

    function deleteEsquema(indice){
        setEsquemas(prev=>prev.filter(esquema=>esquema.id!=indice))
    }
    function deletePenalizacion(indice){
        setPenalizaciones(prev=>prev.filter(pen=>pen.id!=indice))
    }

    async function handdleClickSend(){
        //console.log(meta)
        const respuesta = await Promise.all([
            fns.PostData('recursos.humanos/esquemas',esquemas),
            fns.PostData('recursos.humanos/penalizaciones',penalizaciones),
            fns.PostData('recursos.humanos/meta/ventas',{meta:fns.fixed2(parseFloat(meta))})
        ])
        console.log(respuesta)
        for(const i in respuesta){
            const result = respuesta[i]
            if(result['mensaje']!==undefined)alert(result['mensaje'])
            else{
                alert(result)
            }
        }
    }
  return (
    <div className="flex flex-col ml-3 items-center">
        <div className="flex flex-row ">
            <div className="flex flex-col">
                <label className=" font-extrabold">Esquemas de Comision</label>
                <br />
                <div className="mx-3">
                    {esquemas.map(esquema=>
                        <Esquema key={esquema.id} id={esquema.id} nombre={esquema.nombre} rangos={esquema.rangos} update={updateEsquema} delete={deleteEsquema}/>
                    )}
                </div>
                
                <label>
                    Nuevo esquema:
                    <button onClick={e=>setAgregado(agregado+1)}>+</button>
                </label>
            </div>
            <div className="flex flex-col items-center">
                <label className="font-extrabold">Penalizaciones de Comision</label>
                <br />
                <div className="mx-3">
                    {penalizaciones.map((penalizacion, index)=>
                        <div key={index}>
                            <br />
                            <Penalizacion key={penalizacion.id} id={penalizacion.id} nombre={penalizacion.motivo} valor={penalizacion.valor} update={updatePenalizacion} del={deletePenalizacion}/>
                            <br />
                        </div>
                    )}
                </div>
                <label>
                    Nueva penalizacion:
                    <button onClick={e=>setAgregadoP(agregadoP+1)}>+</button>
                </label>
                <br />
                <div className="flex flex-col items-center">
                    <label className=" font-bold">
                        Meta de comision (porcentaje cobrado):
                    </label>
                    <Input type={'number'} value={meta} change={e=>setMeta(e.target.value)}/>
                </div>
            </div>
        </div>
        <br />
        <button onClick={handdleClickSend}
        className = "text-white text-xl px-2 bg-cyan-600 w-fit h-fit rounded-xl hover:bg-white hover:text-cyan-600">
            Guardar
        </button>
    </div>
  )
}

export default EsquemasComision