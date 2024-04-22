import { useState, useEffect } from "react"
import * as fns from '../../../../Functions.js';

function SelectEsquema(props) {
    const [esquemas, setEsquemas] = useState([])
    const [esquema, setEsquema] = useState(0)//props.inicial)
    useEffect(()=>{
        async function getData(){
            const respuesta = await fns.GetData('recursos.humanos/esquemas');
            setEsquemas(respuesta.map((esquema,id)=>{
                if(props.inicial==esquema.nombre)setEsquema(id)
                esquema.rangos = esquema.rangos.map((rango,id)=>{return {...rango, id}})
                return {...esquema, id}
            }));
        }
        getData();
    },[])

    useEffect(()=>{
        if(esquemas.length>0){
            const rangos = esquemas[esquema]['rangos'];
            const nombre = esquemas[esquema]['nombre'];
            const end = rangos.length-1;
            let i=0;
            while(i<end){
                if(props.ventas>rangos[i]['cantidad'])i++
                else {
                    props.fn(parseFloat(rangos[i]['porcentaje']),nombre);
                    return;
                }
            }
            props.fn(parseFloat(rangos[end]['porcentaje']), nombre);
        }
    },[esquema, esquemas])

    return (
        <div>
            <select onChange={e=>{setEsquema(e.target.value)}} value={esquema}>
                {esquemas.map((item, id)=><option value={id} key={id} >
                    {item['nombre']}
                </option>)}
            </select>
        </div>
    )
}

export default SelectEsquema

//selected={props.inicial==id?id:0}