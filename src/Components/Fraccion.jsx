import { useState, useEffect} from 'react';
import * as fns from '../Functions'
function Fraccion(props) {
    const [numerador, setNumerador] = useState('')
    const [denominador, setDenominador] = useState('')
    const estilo = ' text-center w-5'

    useEffect(()=>{
        if(numerador!==''&&denominador!==''){
            const resultado = parseInt(numerador)/parseInt(denominador);
            //console.log(resultado);
            props.change(resultado);
        }
    }, [numerador, denominador])

    function handleChangeNumerador(value){
        fns.numberLimited(value,setNumerador,2)
    }
    function handleChangeDenominador(value){
        fns.numberLimited(value,setDenominador,2)
    }
    return (
        <div className='flex flex-row h-6 mx-1 select-none'>
            <input className={`${estilo}`} onChange={e=>handleChangeNumerador(e.target.value)} value={numerador}/>
            /
            <input className={`${estilo}`} onChange={e=>handleChangeDenominador(e.target.value)} value={denominador}/>
        </div>
    )
}

export default Fraccion