import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fns } from "../../../../Functions";
import Table from "../../../../Components/Table V2";
import PrintButtonIcon from '../../../../Components/PrintButtonIcon'
import makePDFCompleto from "../../CYC/Viajes/VistaPDF.JS";
import { viajesFns } from "../../../../Components/Viajes/Functions";

function Viajes() {
    const [viajes, setVIajes] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [chofer, setChofer] = useState('');

    const params = useParams();

    const heads = [
        {text:'Viaje',type:'string'},
        {text:'Vehiculo', type:'string'},
        {text:'Ruta',type:'string'},
        {text:`Tipo\nde\nRuta`,type:'string'},
        {text:'Fecha\nde\nFinalizacion',type:'string'},
        {text:'Abrir',type:'string'},
    ]

    useEffect(()=>{
        async function getData(){
            const respuesta = await fns.GetData(`recursos.humanos/comisiones/choferes/${params['chofer']}/${params['fechaI']}/${params['fechaF']}/${params['tipo']}`)
            console.log(respuesta);
            if(respuesta['mensaje']!==undefined)alert(respuesta['mensaje']);
            else{
                setVIajes(respuesta['registros'][0]['detalles']);
                setChofer(respuesta['registros'][0]['nombre'])
            }
        }
        getData();
    },[])

    useEffect(()=>{
        async function setViajesPDF(){
            const viajesPDF = await viajesFns.makeObjetos(viajes, 'recursos.humanos', (viaje, toPrint)=>{
                return {
                    VIAJE:`${viaje.serie.serie}-${viaje.folio}`,
                    VEHICULO:viaje.vehiculo.codigo,
                    RUTA:viaje.nombreRuta,
                    TIPOR:viaje.nombreTipoRuta,
                    FIN:fns.dateString(new Date(viaje.fechaFin)),
                    ABRIR:<PrintButtonIcon size={30} fn={()=>makePDFCompleto(toPrint)}/>
                }
            })
            setObjetos(viajesPDF);
        }
        setViajesPDF()
    },[viajes])
    return (
        <div className="flex flex-col justify-center items-center">
            <br />
            <div className="flex flex-row text-2xl font-extrabold text-cyan-950">
                <label>Chofer: </label>
                <span className="mx-2"/>
                <label>{chofer}</label>
            </div>
            <br />
            <div className="flex flex-row text-2xl font-extrabold text-cyan-950">
                <label>Periodo: </label>
                <span className="mx-2"/>
                <label>{`Desde ${params['fechaI']} hasta ${params['fechaF']}`}</label>
            </div>
            <br />
            <Table theme='bg-blue-950 text-white' colsHeads={heads} list={objetos} manage={setObjetos}/>
        </div>
    )
}

export default Viajes