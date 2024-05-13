import { useState, useEffect } from "react"
import Input from "../../../../Components/Input"
import AddButton from "../../../../Components/AddButtonIcon"
import DeleteButton from "../../../../Components/DeleteButtonIcon"

function Penalizacion({nombre, valor, id, update, del,}) {
    const [motivoLocal, setMotivo] = useState(nombre)
    const [valorLocal, setValor] = useState(valor)
    useEffect(()=>{
        update(id, {
            motivo:motivoLocal,
            valor:valorLocal
        })
    }, [motivoLocal, valorLocal])
    return (
        <div className="flex flex-row justify-center">
            <div className="flex flex-col w-16">
                <label className="font-bold">
                    Nombre:
                </label>
                <label className=" font-bold">
                    Valor:
                </label>
            </div>
            <span className="mx-1"/>
            <div className="flex flex-col w-56">
                <input type={'text'} onChange={e=>setMotivo(e.target.value)} value={motivoLocal}/>
                <input type={'number'} onChange={e=>setValor(e.target.value)} value={valorLocal}/>
            </div>
            <DeleteButton size={25} fn={()=>del(id)}/>
        </div>
    )
}

export default Penalizacion