import Table from "../../../../Components/Table";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import * as Functions from '../../../../Functions.js';
function Desgloce() {
    const {tipo, subtipo,empresa, agente, rutas, fechaI, fechaF} = useParams();
    //constantes
    const matrizTittle = [];
    matrizTittle[0] = ['TOTAL','COBRADO EN EL PERIODO', 'A TIEMPO', 'FUERA DE PLAZO', 'NO COBRADO'];
    matrizTittle[1] = ['DEUDA INICIAL','RECUPERADO', 'CANCELADO', 'NO RECUPERADOO'];
    matrizTittle[2] = ['PROMEDIO DE DEUDA', 'PROMEDIO DE VENCIMIENTOS']
    const heads = ['FACTURA','CLIENTE','EXPEDICION','VENCIMIENTO','TOTAL DE LA FACTURA','PENDIENTE INICIAL','COBRADO','PENDIENTE FINAL', `${matrizTittle[tipo-1][subtipo-1]}`];
    const keys =['FACTURA', 'CLIENTE', 'EXPEDICION', 'VENCIMIENTO', 'TOTAL_FACTURA', 'PENDIENTE_INICIAL', 'COBRADO', 'PENDIENTE_FINAL', 'COLUMNAEXTRA']
    const rutasE = rutas=='N-A'?[]:JSON.parse(decodeURIComponent(rutas))
    const styleTittle = 'bg-blue-900 text-white text-xl';
    const styleText = 'bg-white text-black text-xl';
    //States
    const [facturas, setFacturas] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [totalSeccion, setTotalSeccion] = useState(0);
    //Effects
    useEffect(()=>{
        function getTipos(){
            const obj = {}
            if(tipo==1){
                obj.tipo='cobranza.total'
                if(subtipo==1)
                    obj.subtipo = 'total'
                else if(subtipo==2)
                    obj.subtipo = 'cobrado'
                else if(subtipo==3)
                    obj.subtipo = 'a_tiempo'
                else if(subtipo==4)
                    obj.subtipo = 'no_a_tiempo'
                else if(subtipo==5)
                    obj.subtipo = 'no_cobrado'
            }
            else if(tipo==2){
                obj.tipo = 'cartera.vencida'
                if(subtipo==1)
                    obj.subtipo = 'inicial'
                else if(subtipo==2)
                    obj.subtipo = 'cobrado'
                else if(subtipo==3)
                    obj.subtipo = 'cancelado'
                else if(subtipo==4)
                    obj.subtipo = 'final'
            }
            else if(tipo==3){
                obj.tipo = 'promedios'
                if(subtipo==1)
                    obj.subtipo = 'deuda'
                else if(subtipo==2)
                    obj.subtipo = 'vencidas'
            }
            return obj
        }
        function makeUrl(concepto, subConcepto){
            let url=`/credito.cobranza/${concepto}/`;
            if(empresa==0)url+='corp'
            else{
              if(empresa==1)url += 'cmp';
              if(empresa==2)url += 'cdc';
            }
            url+=`/${fechaI}/${fechaF}`
            url+='?list=true';
            url+=agente!='N-A'?`&agente=${agente}`:'';
            url+=rutas!='N-A'?`&rutas=${rutas}`:''
            url+=`&concepto=${subConcepto}`;
            console.log(url);
            return url
        }
        (async ()=>{
              const {tipo, subtipo} = getTipos()
              const respuesta = await Functions.GetData(makeUrl(tipo,subtipo))
              if(respuesta['error']==undefined){
                if(respuesta.length==0)alert('La consulta no arrojó resultados');
                else{
                    //console.log(respuesta);
                    setFacturas(...[respuesta]);
                }
              }else alert(respuesta['error']);
        })();
    },[]);
    
    function toDateMain(){
        return {
            fechaI:new Date(`${fechaI}T00:00:00`),
            fechaF:new Date(`${fechaF}T00:00:00`)
        }
    }
    function toDate(fecha){
        return new Date(`${fecha.substring(0,10)}T00:00:00`)

    }
    function cobrado(factura){
        return {PAGADO_PERIODO:factura.cobrado, ATIEMPO:factura.aTiempo, FUERATIEMPO:factura.fueraTiempo}
    }
    useEffect(()=>{
        console.log(facturas);
        let acum = 0;
        let counter;
        const array = facturas.map((item,index)=>{
            counter = index;
            let {serie, folio, nombre, expedicion, vencimientoReal, total} = item;
            const EXPEDICION = expedicion.substring(0,10);
            const VENCIMIENTO = vencimientoReal.substring(0,10);
            const PENDIENTE_INICIO = item.pendienteInicio;
            const PENDIENTE_FINAL = item.pendienteFinal
            const {PAGADO_PERIODO, ATIEMPO, FUERATIEMPO} = cobrado(item);
            const NOTA_CREDITO = 0;
            const ADELANTADO_PERIODO = item.adelantado
            const {fechaI, fechaF} = toDateMain()
            const matrizFormula = [];
            matrizFormula[0] = [
                ((toDate(VENCIMIENTO)>=fechaI&&toDate(VENCIMIENTO)<=fechaF)?PENDIENTE_INICIO:0)+ADELANTADO_PERIODO,
                PAGADO_PERIODO,
                ATIEMPO,
                FUERATIEMPO,
                (toDate(VENCIMIENTO)>=fechaI&&toDate(VENCIMIENTO)<=fechaF)?PENDIENTE_FINAL:0,
            ];
            matrizFormula[1] = [
                PENDIENTE_INICIO,
                FUERATIEMPO,
                NOTA_CREDITO,
                PENDIENTE_FINAL
            ]
            matrizFormula[2] = [
                (Math.round((fechaF - toDate(EXPEDICION)) / (1000 * 60 * 60 * 24))),
                Functions.daysDif(toDate(VENCIMIENTO), fechaF)
            ]
            acum += matrizFormula[tipo-1][subtipo-1];
            const obj = {
                FACTURA:`${serie}-${folio}`,
                CLIENTE:nombre,
                EXPEDICION,
                VENCIMIENTO,
                TOTAL_FACTURA: Functions.moneyFormat(total),
                PENDIENTE_INICIAL: Functions.moneyFormat(PENDIENTE_INICIO),
                COBRADO: Functions.moneyFormat(PAGADO_PERIODO),
                PENDIENTE_FINAL: Functions.moneyFormat(PENDIENTE_FINAL),
                COLUMNAEXTRA:tipo!=3?Functions.moneyFormat(matrizFormula[tipo-1][subtipo-1]):matrizFormula[tipo-1][subtipo-1]
            }
            return obj;
        });
        //console.log(acum/(counter+1));
        if(tipo==3){
            const result = ((acum/(counter+1))).toFixed(2);
            subtipo==2?setTotalSeccion(result*-1):setTotalSeccion(result)
        }else{
            setTotalSeccion(acum);
        }
        setObjetos(array);
    },[facturas]);
    return (
        <div className="flex flex-col items-center">
            <table className="m-12">
                <thead>
                    <tr>
                        <th className={`${styleTittle}`}>{matrizTittle[tipo-1][subtipo-1]}</th>
                        <th className={`${styleText}`}>{tipo!=3?Functions.moneyFormat(totalSeccion):totalSeccion.toString()}</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                        <td className={`${styleTittle}`}>EMPRESA</td>
                        <td className={`${styleText}`}>{empresa==1?'CMP':empresa==2?'CDC':'AMBAS'}</td>
                    </tr>
                    <tr>
                        <td className={`${styleTittle}`}>AGENTE</td>
                        <td className={`${styleText}`}>{agente=='N-A'?'Sin Agente especificado':agente}</td>
                    </tr>
                    <tr>
                        <td className={`${styleTittle}`}>RUTAS</td>
                        <td className={`${styleText}`}>{rutas=='N-A'?'Sin Rutas especificadas':rutasE.join(', ')}</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex flex-col mx-32 text-sm">
                <Table theme='bg-blue-950 text-white' colsNames={heads} colsKeys={keys} values={objetos} manage={setObjetos}/>
            </div>
        </div>
    )
}

export default Desgloce