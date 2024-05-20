import {useState, useEffect} from 'react'
import Filtros from '../../../../Components/Viajes/Filtros'
import Table from '../../../../Components/Table V2'
import { fns } from '../../../../Functions'
function Rendimientos() {
    const heads = [
        {text:'Empresa', type:'string'},
        {text:'Viaje', type:'string'},
        {text:'Ruta', type:'string'},
        {text:'Chofer', type:'string'},
        {text:'Auxiliar', type:'string'},
        {text:'Vehiculo', type:'string'},
        {text:'Expedicion', type:'date'},
        {text:'Finalizacion', type:'date'},
        {text:'Km Inicial', type:'string'},
        {text:'Km final', type:'string'},
        {text:'Recorrido', type:'string'},
        {text:'Cargas', type:'string'},
        {text:'Consumo', type:'float'},
        {text:'Rendimiento', type:'string'},
    ]

    const [viajes, setViajes] = useState([])
    const [objetos, setObjetos] = useState([]);
    
    useEffect(()=>{
        setObjetos(viajes.map(viaje=>{
            //kilometros entre consumo
            const recorrido = viaje.kmFinal-viaje.kmInicial;
            const rendimiento = viaje.consumo >0
                ?fns.fixed2String(recorrido/viaje.consumo)
                :'no medido'
            const auxiliar = viaje.auxiliar != null
                ?viaje.auxiliar.nombre
                :'N/A'
            return {
                EMPRESA:fns.getEmpresa(viaje.empresa),
                VIAJE:`${viaje.serie.serie}-${viaje.folio}`,
                RUTA:viaje.nombreRuta,
                CHOFER:viaje.chofer.nombre,
                AUXILIAR:auxiliar,
                VEHICULO:`${viaje.vehiculo.codigo}-${viaje.vehiculo.nombre}`,
                EXPEDICION:viaje.expedicion,
                FINALIZACION:viaje.fechaFin,
                KMI:viaje.kmInicial,
                KMF:viaje.kmFinal,
                RECORRIDO:recorrido,
                CARGAS:viaje.cargas,
                CONSUMO:viaje.consumo,
                RENDIMIENTO:rendimiento
            }
        }))
    }, [viajes])

    return (
        <div className=' flex flex-col items-center'>
            <br />
            <Filtros area={'logistica'} setDocs={setViajes}/>
            <br />
            <Table  theme='bg-blue-950 text-white' colsHeads={heads} list={objetos} manage={setObjetos}/>
        </div>
    )
}

export default Rendimientos