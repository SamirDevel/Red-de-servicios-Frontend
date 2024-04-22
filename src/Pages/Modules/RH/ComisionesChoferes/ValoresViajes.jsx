import { useState, useEffect } from 'react'
import { fns } from '../../../../Functions'
import ValorViaje from './ValorViaje'
import AddButtonIcon from '../../../../Components/AddButtonIcon'

function ValoresViajes() {
    const [valoresViaje, setValoresViaje] = useState([])
    useEffect(()=>{
        async function getData(){
            const respuesta = await fns.GetData(`/recursos.humanos/bonos.chofer`)
            console.log(respuesta)
            setValoresViaje(respuesta)
        }
        getData()
    }, [])

    function updateEsquema(tipo, nuevoValor){
        //console.log(nuevoValor);
        setValoresViaje(prev=>prev.map(valor=>{
            //console.log(valor.nombre)
            if(valor.tipo===tipo){
                valor.valor = nuevoValor.valor
            }
            return valor;
        }))
    }

    function deleteEsquema(indice){
        setValoresViaje(prev=>prev.filter(valor=>valor.id!=indice))
    }
    function addEsquema(){
        //setValoresViaje(prev=>prev.push({nombre:'', valor:}))
    }

    async function handdleClickSend(){
        const respuesta = await fns.PostData('recursos.humanos/bonos.chofer',valoresViaje)
        console.log(respuesta)
        if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje'])
        else{
            alert(respuesta)
        }
    }
    function getValores(){
        return valoresViaje.map(valor=>{
            return <ValorViaje name={valor['nombre']} value={valor['valor']} type={valor['tipo']} updateFn={updateEsquema} key={`${valor['nombre']}-${valor['tipo']}-${valor['valor']}`}/>
        })
    }
    return (
        <div className="flex flex-col ml-4">
        <div className="flex flex-row justify-around">
            <label>Valores de los viajes</label>
            <button onClick={handdleClickSend}
            className = "text-white text-xl px-2 bg-cyan-600 w-fit h-fit rounded-xl hover:bg-white hover:text-cyan-600">
                Guardar
            </button>
        </div>
        <br />
        <div className="mx-3">
            {}
        </div>
        {getValores()}
    </div>
    )
}

export default ValoresViajes
/*
<label className='my-2'>
    Nuevo valor:
    <span className='mx-3'/>
    <AddButtonIcon />
</label>
*/