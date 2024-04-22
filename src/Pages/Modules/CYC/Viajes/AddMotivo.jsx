import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LabelInput from '../../../../Components/LabelInput';
import BlueBotton from "../../../../Components/BlueBotton";
import { fns } from "../../../../Functions";

function AddMotivo() {
    const [motivo, setMotivo] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const params = useParams();

    async function handdleSubmit(e){
        e.preventDefault();
        const errores = [];
        if(motivo==='')errores.push('Debe crear un nombre para el motivo.')
        if(descripcion==='')errores.push('Debe crear una descripcion para el motivo.')
        if(errores.length===0){
            const respuesta = await fns.PostData(`credito.cobranza/viajes/motivos/crear/${params['evento']}`, {
                motivo,
                descripcion
            })
            if(respuesta['mensaje']===undefined){
                alert(respuesta);
                window.close()
            }else alert(respuesta['mensaje'])
        }else fns.alertar(errores);
    }
    return (
        <form className="flex flex-col items-center" onSubmit={handdleSubmit}>
            <br />
            <LabelInput text='Motivo' value={motivo} change={e=>setMotivo(e.target.value)} fn={()=>{}}/>
            <br />
            <label>Descripcion:</label>
            <textarea className="mx-2 border-solid border-2 border-black px-1" 
                id="Descripcion" cols="30" rows="3" value={descripcion} onChange={e=>setDescripcion(e.target.value)}></textarea>
            <br />
            <BlueBotton text='Enviar' fn={handdleSubmit}/>
        </form>
    )
}

export default AddMotivo