import {useState, useEffect} from 'react'
import { fns } from '../../../../Functions';

function SelectPenalizacion({cobrado, fn}) {
    const [penalizaciones, setPenalizaciones] = useState([])
    const [penalizacion, setPenalizacion] = useState(0)
    const [meta, setMeta] = useState(0);
    const [first, setFirst] = useState(false)
    useEffect(()=>{

        async function getData(){
            const respuesta = await Promise.all([
                fns.GetData('recursos.humanos/penalizaciones'),
                fns.GetData('recursos.humanos/meta/ventas')
            ]);
            console.log(respuesta)
            const array = respuesta[0].map((penalizacion, index)=>{
                return {
                    id:index,
                    ...penalizacion
                }
            })
            setPenalizaciones(array);
            setMeta(respuesta[1]['meta']);
            setFirst(true);
        }
        getData();
    },[])
    useEffect(()=>{
        console.log(penalizaciones)
        if(first===true){
            for(const i in penalizaciones){
                const penalizacion = penalizaciones[i]
                const cantidad = penalizacion.valor
                if(cobrado<meta){
                    //console.log(cantidad)
                    if(cantidad>0){
                        setPenalizacion(penalizacion.id);
                        break;
                    }
                }else{
                    if(cantidad<=0){
                        //console.log(cantidad)
                        setPenalizacion(penalizacion.id);
                        break;
                    }
                }
            }
        }
    }, [first])
    useEffect(()=>{
        for(const i in penalizaciones){
            const pen = penalizaciones[i]
            if(pen.id===penalizacion){
                //console.log(pen.valor)
                fn(pen.valor)
                break;
            }
        }
    },[penalizacion])

    return (
        <div>
            <select value={penalizacion} onChange={e=>setPenalizacion(parseInt(e.target.value))}>
                {
                penalizaciones.map((penalizacion, index)=>{
                    return <option key={index} value={penalizacion.id}>
                        {fns.fixed2String(penalizacion.valor)}%
                    </option>
                })}
            </select>
        </div>
    )
}

export default SelectPenalizacion