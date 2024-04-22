import { useState, useEffect } from "react"

function InputCantidad(props) {
    const [cantidad, setCantidad] = useState(0)
    const [cantidadFormateada, setCantidadFormateada] = useState('')

    useEffect(()=>{
        if(props.value!==undefined){
            setCantidad(props.value.toString())
        }
    },[])

    useEffect(()=>{
        props.fn(cantidad);
    },[cantidad])

    useEffect(()=>{
        if(props.value!==undefined)handleChange(props.value.toString())
    },[props.value])

    function handleChange(old){
        const value = old.replace(/[^0-9.]/g,'')
        const dotIndex = value.indexOf('.')
        const recorted = dotIndex!==-1?value.substring(0, dotIndex+3):value
        const numero = parseFloat(recorted)
        isNaN(numero)===false?setCantidad(numero):setCantidad(0);
        const separada = separar(recorted);
        setCantidadFormateada(separada)
        //console.log(formated);
    }
    function separar(numero){
        const dotIndex = numero.indexOf('.');
        let result = dotIndex!==-1?numero.substring(dotIndex, numero.length):'';
        const start = dotIndex!==-1?dotIndex-1:numero.length-1;
        for(let i=start, cont=0; i>=0; i--, cont++){
            if(cont === 3){
                result = ',' + result;
                cont = 0
            }
            result=numero[i] + result;
        }
        return result
    }
    return (
        <label className="flex flex-row ml-3">
            $<input type="text" className='w-20 mr-2' onChange={e=>handleChange(e.target.value)} value={cantidadFormateada}/>
        </label>
    )
}

export default InputCantidad