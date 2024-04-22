import { useState, useEffect } from "react"
import Rango from "./Rango"
import IconButton from "../../../../Components/IconButton"
import { RiPlayListAddLine } from "react-icons/ri"
import { AiFillDelete } from "react-icons/ai"

function Esquema(props) {
    const [rangos, setRangos] = useState([])
    const [nombre,setNombre] = useState('')
    const [agregado, setAgregado] = useState(0)

    useEffect(()=>{
        if(props.nombre!==undefined)setNombre(props.nombre)
        if(props.rangos!==undefined)setRangos(props.rangos)
    },[])

    useEffect(()=>{
        if(agregado>0){
            console.log(agregado);
            setRangos([...rangos, {cantidad:'', porcentaje:'', id:agregado}])
        }
    }, [agregado])

    useEffect(()=>{
        props.update(props.id,{nombre, rangos});
    },[nombre, rangos])
    
    function updateRango(indice, nuevoRango){
        setRangos(prev=>prev.map(rango=>{
            if(rango.id==indice){
                rango.cantidad = nuevoRango.cantidad
                rango.porcentaje = nuevoRango.porcentaje
            }
            return rango
        }))
    }
    function deleteRango(indice){
        setRangos(prev=>prev.filter(rango=>rango.id!=indice))
    }
    return (
        <div className="flex flex-col">
            <div className="flx flex-row">
                <input className=' w-40'
                type="text" placeholder="Esquema" 
                value={nombre==undefined?'':`${nombre}`} onChange={e=>setNombre(e.target.value)}/>
                <span className='mx-8'/>
                <IconButton icon={<AiFillDelete className="redHover"/>} fn={()=>{props.delete(props.id)}}/>
            </div>
            <div className="flex flex-col ml-5">
                {rangos.map((rango, index)=>
                    <Rango cantidad={rango.cantidad} porcentaje={rango.porcentaje} key={index} id={index} update={updateRango} delete={deleteRango}/>
                )}
                <IconButton icon={<RiPlayListAddLine/>} fn={e=>setAgregado(agregado+1)} text='+'/>
                <br />
            </div>
        </div>
    )
}

export default Esquema