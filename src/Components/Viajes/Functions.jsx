import { fns } from "../../Functions"

export async function getDets(viaje, area){
    return await Promise.all(
        viaje['detalles'].map(async doc => {
        //console.log(doc)
        const respuesta = await fns.GetData(`${area}/documento/${viaje['empresa']}/${doc['serie']}/${doc['folio']}`)
        return {
            ...respuesta, 
            observacion:doc['observaciones'],
            destino:doc['destino'],
            domicilioElegido:doc['direccion'],
            importe:doc['importe']
        }
        })
    )
}

export async function makeObjetos(viajes, area, callback){
    return await Promise.all(viajes.map(async viaje=>{
        const {origen, rfc, dom} = fns.getDatosFiscales(viaje['empresa'])
        console.log(viaje)
        const toPrint = {
            origen,
            rfc,
            direccion:dom,
            chofer:viaje['chofer']['nombre'],
            auxiliar:viaje['auxiliar']!= null?viaje['auxiliar']['nombre']:'',
            gas:viaje['gasInicial'],
            gasL:viaje['gasFinal'],
            fecha:new Date(viaje['expedicion']),
            auto:`${viaje['vehiculo']['codigo']}-${viaje['vehiculo']['nombre']}`,
            placas:viaje['vehiculo']['placas'],
            serfol:`${viaje['serie']['serie']}-${viaje['folio']}`,
            fechaRuta:new Date(viaje['fechaInicio']),
            fechaRutaL:new Date(viaje['fechaFin']),
            km:viaje['kmInicial'],
            kmL:viaje['kmFinal'],
            ruta:viaje['nombreRuta'],
            obs:viaje['observacionSalida'],
            obsL:viaje['observacionLlegada'],
            docs:await getDets(viaje, area),
            cargas:viaje['cargas']
            
        }
        return callback(viaje, toPrint);
    }))
}

export  * as viajesFns from './Functions'