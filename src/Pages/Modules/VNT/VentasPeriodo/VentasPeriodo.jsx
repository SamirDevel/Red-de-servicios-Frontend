import {useState, useEffect} from 'react'
import Input from '../../../../Components/Input'
import BlueBotton from '../../../../Components/BlueBotton'
import { fns } from '../../../../Functions'
import Table from '../../../../Components/Table V2'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi'

function VentasPeriodo() {
    const [fechaI, setFechaI] = useState('')
    const [fechaF, setFechaF] = useState('')
    const [objetos, setObjetos] = useState([])
    const [buscado, setBuscado] = useState(false);
    const [empresa, setEmpresa] = useState('corp')

    const Heads = [
        {text:'Factura', type:'string'},
        {text:'Expedicion', type:'date'},
        {text:'Codigo cliente', type:'string'},
        {text:'Cliente', type:'string'},
        {text:'RFC', type:'string'},
        {text:'Agente', type:'string'},
        {text:'Ruta', type:'string'},
        {text:'Codigo producto', type:'string'},
        {text:'Producto', type:'string'},
        {text:'Familia', type:'string'},
        {text:'Unidades Facturadas', type:'string'},
        {text:'Costo uniario antes de IVA', type:'pesos'},
        {text:'Costo de adquisicion antes de IVA', type:'pesos'},
        {text:'Precio Unitario antes de IVA', type:'pesos'},
        {text:'Subtotal de venta antes de IVA', type:'pesos'},
        {text:'Utilidad antes de IVA', type:'pesos'},
    ]

    useEffect(()=>{
        async function getList(){
            const query = fns.makeUrlQuery({fechaI, fechaF})
            const respuesta = await fns.GetData(`ventas/periodo/${empresa}${query}`)
            console.log(respuesta);
            setObjetos(respuesta.map(fac=>{
                return {
                    FACTURA:`${fac.serie}-${fac.folio}`
                    ,EXPEDICION:fac.expedicion
                    ,CODIGOCLIENTE:fac.codigoCliente
                    ,CLIENTE:fac.nombreCliente
                    ,RFC:fac.rfc
                    ,AGENTE:fac.nombreAgente
                    ,RUTA:fac.ruta
                    ,CODIGOPRODUCTO:fac.codigoProducto
                    ,PRODUCTO:fac.nombreProducto
                    ,FAMILIA:fac.familia
                    ,UNIDADES:fac.unidadesCapturadas
                    ,UNITARIO:fac.costoUnitario
                    ,ESPECIFICO:fac.costoEspecifico
                    ,PRECIO:fac.precioUnitario
                    ,SUBTOTAL:fac.subTotal
                    ,UTILIDAD:fac.subTotal - fac.costoEspecifico
                }
            }))
        }
        if(buscado===true){
            if(objetos.length===0){
                getList();
                setBuscado(false)
            }else{
                setObjetos([]);
            }
        }
        console.log(buscado)
    },[buscado, objetos])

    function makeExcell(){
        const columns = [
            {header:'Factura', key:'FACTURA'},
            {header:'Expedicion', key:'EXPEDICION'},
            {header:'Codigo cliente', key:'CODIGOCLIENTE'},
            {header:'Cliente', key:'CLIENTE'},
            {header:'RFC', key:'RFC'},
            {header:'Agente', key:'AGENTE'},
            {header:'Ruta', key:'RUTA'},
            {header:'Codigo producto', key:'CODIGOPRODUCTO'},
            {header:'Producto', key:'PRODUCTO'},
            {header:'Familia', key:'FAMILIA'},
            {header:'Unidades Facturadas', key:'UNIDADES'},
            {header:'Costo uniario antes de IVA', key:'UNITARIO'},
            {header:'Costo de adquisicion antes de IVA', key:'ESPECIFICO'},
            {header:'Precio Unitario antes de IVA', key:'PRECIO'},
            {header:'Subtotal de venta antes de IVA', key:'SUBTOTAL'},
            {header:'Utilidad antes de IVA', key:'UTILIDAD'},
        ]
        const rows = objetos.map(obj=>obj)
        return {columns, rows}
    }
    function handdleExport(name){
        fns.exportToExcell(()=>makeExcell(), name);
    }
    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-row'>
                <div className='flex flex-col justify-center items-end'>
                    <label> Inicio:</label>
                    <span className='my-2'/>
                    <label> Final:</label>
                    <span className='my-2'/>
                    <label> Seleccion de empresa:</label>
                </div>
                <span className='mx-2'/>
                <div className='flex flex-col justify-center items-center'>
                    <Input value={fechaI} change={e=>setFechaI(e.target.value)} type={'date'}/>
                    <span className='my-2'/>
                    <Input value={fechaF} change={e=>setFechaF(e.target.value)} type={'date'}/>
                    <span className='my-2'/>
                    <select onChange={e=>setEmpresa(e.target.value)} value={empresa}>
                        <option value="cmp">Central Mayorista de paneles</option>
                        <option value="cdc">Comercial Domos Copernico</option>
                        <option value="corp">Ambas</option>
                    </select>
                </div>
            </div>
            <span className='my-2'/>
            <BlueBotton text={'Buscar'} fn={()=>setBuscado(true)}/>
            <span className='my-2'/>
            <Table  theme='bg-blue-950 text-white' colsHeads={Heads} list={objetos} manage={setObjetos} handdleExport={handdleExport} icon={<PiMicrosoftExcelLogoFill size={45} className="green"/>}/>
        </div>
    )
}

export default VentasPeriodo