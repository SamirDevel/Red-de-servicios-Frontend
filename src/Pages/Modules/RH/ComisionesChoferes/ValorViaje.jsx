import {useState, useEffect} from 'react'
import LabelInput from '../../../../Components/LabelInput'
import InputCantidad from '../../../../Components/InputCantidad'
import DeleteButtonIcon from '../../../../Components/DeleteButtonIcon'
function ValorViaje({name, value, type, updateFn}) {
    const [nombre, setNombre] = useState(name)
    const [valor, setValor] = useState(0);
    const [tipo, setTipo] = useState(0);
    const [primera, setPrimera] = useState(false)
    useEffect(()=>{
        if(name!==undefined)setNombre(name)
        if(value!==undefined)setValor(value)
    },[])
    useEffect(()=>{
        //updateFn(type,{valor})
    }, [valor])

    return (
        <div className='flex flex-row my-1' onBlur={e=>updateFn(type,{valor})} onKeyDown={e=>{
            if(e.key==='Enter')e.target.blur()
            }}>
            <label className='w-12 mr-1'>{name}</label>
            <span className='mx-2'/>
            <InputCantidad value={valor} fn={setValor}/>
            <span className='mx-1'/>
            <label>Tipo: {type}</label>
        </div>
    )
}

export default ValorViaje

//<span className='mx-1'/>
//<DeleteButtonIcon fn={e}/>
//<LabelInput type='text' text='Nombre:' value={nombre} change={e=>setNombre(e.target.value)}/>