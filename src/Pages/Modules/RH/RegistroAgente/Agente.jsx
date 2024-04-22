import { useEffect, useState } from "react"
import Input from "../../../../Components/Input";
import * as fns from "../../../../Functions"
import BlueBotton from "../../../../Components/BlueBotton";
function Agente() {
  const [nombre, setNombre] = useState('')
  const [tipoAgente, setTipoAgente] = useState('-1')
  async function handleSubmit(e){
    //e.preventDefalt();
    const errores = new Array();
    if(nombre==='')errores.push('El nombre o puede estar vacio')
    if(tipoAgente=='-1')errores.push('Debe seleccionar un tipo de Agente')
    if(errores.length===0){
      try {
        const respuesta = await fns.PostData(`/recursos.humanos/crear/agente`,{nombre, tipo:parseInt(tipoAgente)})
        if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje'])
        else alert(respuesta);
      window.location.reload();
      } catch (error) {
        console.log(error)
        alert('Ha habido un error, más detalles en la consola');
      }
    }
    else errores.forEach(error=>alert(error));
}
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center mr-3">
        <label>Nombre:</label>
        <span className="mr-2"/>
        <Input type="text" change={e=>setNombre(e.target.value)} value={nombre} fn={()=>''}/>
        <label className="self-center mx-2">Tipo de Agente</label>
        <select className="border-2 border-black rounded-md" onChange={e=>setTipoAgente(e.target.value)} value={tipoAgente}>
            <option value="-1">Seleccionar Opcion</option>
            <option value={1}>Administrador</option>
            <option value={2}>Dependiente</option>
        </select>
      </div>
      <br />
      <BlueBotton text='Crear' id='Crear' fn={handleSubmit}/>
    </div>
  )
}

export default Agente