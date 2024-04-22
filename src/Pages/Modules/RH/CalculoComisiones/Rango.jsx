import { useState, useEffect } from "react"
import { AiFillDelete } from "react-icons/ai"
import IconButton from "../../../../Components/IconButton"
import InputCantidad from "../../../../Components/InputCantidad"
function Rango(props) {
    const [cantidad, setCantidad] = useState(0)
    const [porcentaje, setPorcentaje] = useState(0)
    useEffect(()=>{
        if(props.cantidad!==undefined)setCantidad(props.cantidad)
        if(props.porcentaje!==undefined)setPorcentaje(props.porcentaje)
    }, [])

    useEffect(()=>{
        props.update(props.id, {cantidad, porcentaje})
    }, [cantidad, porcentaje]);

    return (
        <div className="flex flex-row">
            <div className='w-24'>
                <InputCantidad value ={cantidad} fn={setCantidad}/>
            </div>
            <span className='mx-5'/>
            <div>
                <input className='w-14' type="number" placeholder="%" value={porcentaje} onChange={e=>setPorcentaje(e.target.value)}/>
                <label >%</label>
            </div>
            <IconButton icon={<AiFillDelete className="redHover"/>} fn={()=>{props.delete(props.id)}}/>
        </div>
    )
}

export default Rango
//<input className='w-28' type="number" placeholder="Cantidad" value={cantidad} onChange={e=>setCantidad(e.target.value)}/>