import {useState, useEffect} from 'react'
import Filtros from '../../Viajes/Filtros'
import Table from '../../Table V2'
import { viajesFns } from '../../Viajes/Functions';
import PrintButtonIcon from '../../PrintButtonIcon';
import { fns } from '../../../Functions';
import makePDF from '../VistaPDF.JS';
function Visualizar({area}) {
    const [viajes, setViajes] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const heads = [
        {text:'Imprimir', type:'string'},
        {text:'Serie', type:'string'},
        {text:'Folio', type:'string'},
        {text:'Chofer', type:'string'},
        {text:'Auxiliar', type:'string'},
        {text:'Vehiculo', type:'string'},
        {text:'Ruta', type:'string'},
        {text:'Expedicion', type:'string'},
        {text:'Usuario', type:'string'}
    ]
    useEffect(()=>{
        async function getObjetos(){
            const objetos = await viajesFns.makeObjetos(viajes,area, (viaje, toPrint)=>{
                return  {
                    IMPRIMIR:< PrintButtonIcon size={30} fn={()=>makePDF(toPrint)}/>,
                    SERIE:viaje['serie']['serie'],
                    FOLIO:viaje['folio'],
                    CHOFER:viaje['chofer']['nombre'],
                    AUXILIAR:viaje['auxiliar']!= null?viaje['auxiliar']['nombre']:'',
                    VEHICULO:`${viaje['vehiculo']['codigo']}`,
                    RUTA:viaje['nombreRuta'],
                    EXPEDICION: fns.dateString(new Date(viaje['expedicion'])),
                    USUARIO:viaje['nombreUsuario'],
                }
            })
            setObjetos(objetos)
        }
        if(viajes.length>0)getObjetos();
    },[viajes])
    return(
        <div className='flex flex-col items-center flex-grow'>
            <br />
            <label className='text-2xl text-cyan-800 font-extrabold'>Consulta de registros</label>
            <br />
            <Filtros area={area} setDocs={setViajes}/>
            <br />
            <div className={`${viajes.length>0?'visble':'hidden'}`}>
                <Table  theme='bg-blue-950 text-white' colsHeads={heads} list={objetos} manage={setObjetos}/>
            </div>
        </div>
    )
}

export default Visualizar
/*
*/