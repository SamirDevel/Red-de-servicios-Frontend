import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import * as fns from '../../../../../Functions'
import Table from "../../../../../Components/Table V2"
import { PiMicrosoftExcelLogoFill } from "react-icons/pi"

function index() {
  const params = useParams();
  const [agente, setAgente] = useState(undefined)
  const [dependientes, setDependientes] = useState([])
  const [documentos, setDocumentos] = useState([])
  const [objetos, setObjetos] = useState([])
  const [total, setTotal] = useState(0);
  const [cobranza, setCobranza] = useState(0);
  const [aTiempo, setATIempo] = useState(0);
  const [fueraTiempo, setFueraTiempo] = useState(0);

  const comisionHeads = [
    {text:'Factura', type:'string'},
    {text:'Cliente',type:'string'},
    {text:'Expedicion',type:'string'},
    {text:'Vencimiento',type:'sring'},
    {text:'Total de la factura',type:'pesos'},
    {text:'Por cobrar',type:'pesos'},
    {text:'Adelanto',type:'pesos'},
    {text:'Cobrado',type:'pesos'},
    {text:'A Tiempo',type:'pesos'},
    {text:'Fuera de Tiempo',type:'pesos'},
    {text:'Cancelado',type:'pesos'},
    {text:'Cobranza',type:'pesos'},
    {text:'No Cobrado', type:'pesos'},
  ]
  
  useEffect(()=>{
    async function getData(){
      const respuesta = await fns.GetData(`/recursos.humanos/comision/ventas/${params['agente']}/${params['fechaI']}/${params['fechaF']}/${params['grupo']}`);
      if(respuesta['mensaje']===undefined){
        setAgente({nombre:respuesta['nombre'], codigo:respuesta.codigo})
        setDocumentos(respuesta['documentos']['_elementos'])
        setDependientes(respuesta['deps'])
        console.log(respuesta)
      }else{
        alert(respuesta['mensaje'])
      }
    }
    getData()
  },[])

  useEffect(()=>{
    setObjetos(documentos.map(doc=>{
      return {
        FACTURA:`${doc.serie}-${doc.folio}`,
        CLIENTE:doc.nombre!==undefined?doc.nombre:doc.idCliente.nombre,
        EXPEDICION:doc.expedicion.substring(0,10),
        VENCIMIENTO:doc.vencimientoReal!==undefined?doc.vencimientoReal.substring(0,10):doc.vencimientoComision.substring(0,10), 
        TOTAL:doc.total,
        PENDIENTEI:doc.pendienteInicio,
        ADELANTO:doc.adelantado,
        COBRADO:doc.cobrado, 
        ATIEMPO:doc.aTiempo,
        FUERATIEMPO:doc.fueraTiempo,
        CANCELADO:doc.cancelado,
        COBRANZA: doc.pendienteInicio + doc.adelantado,
        PENDIENTEF:doc.pendienteFinal
      }
    }))
    setTotal(prev=>{
      let sum = 0
      documentos.forEach(doc=>sum+=doc.cobrado)
      return sum
    })
    setCobranza(prev=>{
      let sum = 0
      documentos.forEach(doc=>sum+=doc.pendienteInicio+doc.adelantado)
      return sum
    })
    setATIempo(prev=>{
      let sum = 0
      documentos.forEach(doc=>sum+=doc.aTiempo)
      return sum
    })
    setFueraTiempo(prev=>{
      let sum = 0
      documentos.forEach(doc=>sum+=doc.fueraTiempo)
      return sum
    })
  },[documentos])

  useEffect(()=>{
    setObjetos(objetos)
  }, [objetos])
  
  function makeExcell(){
    const columns = [
      {header:'Factura', key:'FACTURA'},
      {header:'Cliente',key:'CLIENTE'},
      {header:'Expedicion',key:'EXPEDICION'},
      {header:'Vencimiento',key:'VENCIMIENTO'},
      {header:'Total de la factura',key:'TOTAL'},
      {header:'Por cobrar',key:'PENDIENTEI'},
      {header:'Adelanto',key:'ADELANTO'},
      {header:'Cobrado',key:'COBRADO'},
      {header:'A Tiempo',key:'ATIEMPO'},
      {header:'Fuera de Tiempo',key:'FUERATIEMPO'},
      {header:'Cancelado',key:'CANCELADO'},
      {header:'Cobranza',key:'COBRANZA'},
      {header:'No Cobrado', key:'PENDIENTEF'},
    ]
    const rows = objetos.map(obj=>obj)
    return {columns, rows}
  }

  function handdleExport(name){
    fns.exportToExcell(()=>makeExcell(), name);
  }



  return (
    <div className="flex flex-col">
      <label>Facturas asociadas al agente {agente!==undefined?agente.nombre:''}</label>
      <label>Correspondientes al periodo {params['fechaI']} - {params['fechaF']}</label>
      <label>Total: {fns.moneyFormat(cobranza)}</label>
      <label>Cobrado: {fns.moneyFormat(total)}</label>
      <label className="ml-6">-A tiempo: {fns.moneyFormat(aTiempo)}</label>
      <label className="ml-6">-Fuera de tiempo: {fns.moneyFormat(fueraTiempo)}</label>
      {(()=>{
        if(agente!==undefined && dependientes.length>0)return <div className="flex flex-col">
          <label>Agentes asociados:</label>
          {dependientes.map((dep, index)=><label className="ml-6" key={index}>
              {dep.nombre}
            </label>
          )}
        </div>
      })()}
      <Table  theme='bg-blue-950 text-white' colsHeads={comisionHeads} list={objetos} manage={setObjetos} handdleExport={handdleExport} icon={<PiMicrosoftExcelLogoFill size={45} className="green"/>}/>
    </div>
  )
}

export default index