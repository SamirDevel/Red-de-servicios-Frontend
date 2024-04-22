import {useState, useEffect} from 'react'
import Filtros from '../../../../Components/Viajes/Filtros'
import LabelSelect from '../../../../Components/LabelSelect'
import Table from '../../../../Components/Table V2';
import { viajesFns } from '../../../../Components/Viajes/Functions';
import PrintButtonIcon from '../../../../Components/PrintButtonIcon';
import { fns } from '../../../../Functions';
import makePDF from '../../FTC/Viajes/VistaPDF.JS';
import makePDFCompleto from './VistaPDF.JS';
import OpenButtonIcon from '../../../../Components/OpenButtonIcon'
import EditButtonIcon from '../../../../Components/EditButtonIcon'
import CancelButtonIcon from '../../../../Components/CancelButtonIcon';
function Consultar() {
    const [viajes, setVIajes] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [estatus, setEstatus] = useState('');
    const heads = [
        {text:'Finalizar', type:'string'},
        {text:'Editar', type:'string'},
        {text:'Cancelar', type:'string'},
        {text:'Imprimir', type:'string'},
        {text:'Factura', type:'string'},
        //{text:'Folio', type:'string'},
        {text:'Chofer', type:'string'},
        {text:'Vehiculo', type:'string'},
        {text:'Ruta', type:'string'},
        {text:'Expedicion', type:'string'},
        {text:'Estatus', type:'string'},
    ]
    useEffect(()=>{
        async function getObjetos(){
            const objetos = await viajesFns.makeObjetos(viajes, 'credito.cobranza',(viaje, toPrint)=>{
                const estatus = viaje['estatus'];
                const color = (()=>{
                    if(estatus==='PENDIENTE')return 'text-blue-700'
                    if(estatus==='COMPLETADO')return 'text-green-600'
                    if(estatus==='CANCELADO')return 'text-red-700'
                })()
                const url = `${window.location}/viaje/${viaje['serie']['serie']}/${viaje['folio']}`
                return  {
                    ABRIR:estatus==='PENDIENTE'?<OpenButtonIcon size={25} url={`${url}/abrir`}/>:'',
                    EDITAR:estatus==='CANCELADO'?'':<EditButtonIcon size={25} url={`${url}/editar`}/>,
                    CANCELAR:estatus==='CANCELADO'?'':<CancelButtonIcon size={25} url={`${url}/cancelar`}/>,
                    IMPRIMIR:< PrintButtonIcon size={30} fn={()=>{
                        if(estatus==='COMPLETADO') return makePDFCompleto(toPrint)
                        else return makePDF(toPrint)
                    }}/>,
                    FACTURA:`${viaje['serie']['serie']}-${viaje['folio']}`,
                    //FOLIO:viaje['folio'],
                    CHOFER:viaje['chofer']['nombre'],
                    VEHICULO:`${viaje['vehiculo']['codigo']}`,
                    RUTA:viaje['nombreRuta'],
                    EXPEDICION: fns.dateString(new Date(viaje['expedicion'])),
                    ESTATUS: <label className={`${color}`}>{estatus}</label>
                }
            })
            setObjetos(objetos)
        }
        if(viajes.length>0)getObjetos();
    },[viajes])

    return(
        <div className='flex flex-col items-center'>
            <br />
            <Filtros area={'credito.cobranza'} setDocs={setVIajes} filtro={{estatus:estatus!=='-1'?estatus:undefined}}>
                <br />
                <LabelSelect text='Estatus' list={['PENDIENTE', 'COMPLETADO', 'CANCELADO']} id='estatus' fn={e=>setEstatus(e.target.value)} vale={estatus} custom='w-48'/>
                <br />
            </Filtros>
            <br />
            <div className={`${viajes.length>0?'visble':'hidden'}`}>
                <Table  theme='bg-blue-950 text-white' colsHeads={heads} list={objetos} manage={setObjetos} keyName='FACTURA'/>
            </div>
        </div>
    )
}

export default Consultar