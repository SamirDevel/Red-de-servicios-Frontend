import { useEffect, useState, useRef } from "react"
import * as fns from "../../../../../Functions"
import BlueBotton from "../../../../../Components/BlueBotton";
import AddButtonIcon from '../../../../../Components/AddButtonIcon'
import DeleteButtonIcon from '../../../../../Components/DeleteButtonIcon'

function AdministrarRelaciones() {
    const [relaciones, setRelaciones] = useState([]);
    const [opciones, setopciones] = useState([]);
    const [relacionesAgregadas, setRelacionesAgregadas] = useState([]);
    const [relacionesEliminadas, setRelacionesEliminadas] = useState([]);
    const [relacionEliminada, setRelacionEliminada] = useState({});
    const [relacionAgregada, setRelacionAgregada] = useState({});
    const [addedOptions, setAddedOptions] = useState(0)
    useEffect(()=>{
        async function getData(){
            const resspuesta = await fns.GetData('/recursos.humanos/relaciones')
            console.log(resspuesta)
            if(resspuesta['mensaje']==undefined){
                setRelaciones(resspuesta);
                let cont = 0;
                setopciones(resspuesta.map((item, adminIndex)=>item.dependientes.map((opcion, index)=>{
                    const dato = opcion.codDependiente;
                    cont=index;
                    return<label key={index}>
                        <DeleteButtonIcon fn={e=>handdleClickDelete(item, dato, index, adminIndex)}/>
                        {' '}
                        {dato.nombre}
                    </label>
                })));
                setAddedOptions(cont+1)
            }else alert(resspuesta['mensaje']);
        }
        getData();
    },[])

    useEffect(()=>{
        const indexToAdd = relacionesAgregadas.map(item=>item.index).indexOf(relacionAgregada.index);
        if(indexToAdd==-1){
            if(relacionAgregada.dep!=-1&&relacionAgregada.index!=undefined)setRelacionesAgregadas([...relacionesAgregadas, relacionAgregada]);
        }else{
            setRelacionesAgregadas(prev=>prev.map(item=>{
                if(item.index==relacionAgregada.index){
                    item = relacionAgregada;
                }
                return item;
            }))
        }
    },[relacionAgregada])

    useEffect(()=>{
            if(relacionEliminada.pertenencia!=undefined){
                removeOptions(relacionEliminada.pertenencia, relacionEliminada.index);
                setRelacionesEliminadas([...relacionesEliminadas, relacionEliminada])
            }
    },[relacionEliminada])

    useEffect(()=>{
        //console.log(opciones)
    }, [opciones])
    //Functions
    async function addOptions(index, indexKey, change){
        const lista = await fns.GetData(`/agentes/agentes/corp`);
        const copiaOpciones = opciones.map(item=>item);
        copiaOpciones[index].push(makeSelectAgentes(lista, indexKey, change));
        setopciones(copiaOpciones);
    }

    async function removeOptions(indexAdmn, indexoption){
        const copiaOpciones = opciones.map(item=>item);
        copiaOpciones[indexAdmn]=copiaOpciones[indexAdmn].filter(item=>item.key!=indexoption)
        setopciones(copiaOpciones);
    }

    function makeOptionAgente(agente, index){
        return <option value={agente['codigo']} key={index}>{agente['nombre']}</option>
    }

    function makeSelectAgentes(lista, index, change){
        return <select key={index} onChange={e=>change(e)}>
            <option value={-1}>Sleccionar opcion</option>
            {lista.map((agente,index)=>{
                return makeOptionAgente(agente,index);
            })}
        </select>
    }

    async function handdleClickAdd(indiceRow, row){
        await addOptions(indiceRow, addedOptions, e=>{
            const agregado = e.target.value
            setRelacionAgregada({admin:row.codigo, dep:agregado, index:addedOptions})
        });
        setAddedOptions(addedOptions+1)
    }

    function handdleClickDelete(item, dato, index, adminIndex){
        setRelacionEliminada({admin:item.codigo, dep:dato.codigo, index, pertenencia:adminIndex})
    }

    return (
        <div className="flex flex-col items-center flex-grow">
            <br />
            <div className="flex flex-row">
                <label className=" text-xl">Relaciones</label>
                <span className="mx-4"/>
                <BlueBotton text='Guardar' fn={()=>{
                    relacionesAgregadas.forEach(async (item)=>{
                        const respuesta = await fns.PostData(`/recursos.humanos/relaciones`,{
                            admin:item.admin,
                            dependiente:item.dep
                        });
                        alert(respuesta['mensaje']);
                    })
                    relacionesEliminadas.forEach(async (item)=>{
                        const respuesta = await fns.DeleteData(`/recursos.humanos/relaciones/${item.admin}/${item.dep}`);
                        alert(respuesta['mensaje']);
                    })
                    window.location.reload();
                }}/>
            </div>
            <br />
            {(()=>{
                const rows=[];
                relaciones.forEach((row,indiceRow)=>{
                    const opcionesRelacion = opciones[indiceRow]
                    rows.push(<div className="flex flex-row" key={row.codigo}>
                            <div className="flex flex-col">
                                <label className=" text-xl">{row['nombre']}</label>
                            </div>
                            <span className="mx-5"/>
                            <div className="flex flex-col">
                                {(()=>{
                                    return opcionesRelacion.map((opcion)=>opcion)
                                })()}
                                <span className="mt-2"/>
                                <AddButtonIcon fn={e=>handdleClickAdd(indiceRow, row)}/>
                                <br />
                            </div>
                        </div>
                    )
                })
                return rows;
            })()}
        </div>
    )
}

export default AdministrarRelaciones