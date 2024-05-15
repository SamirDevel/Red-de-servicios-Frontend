import {useState, useEffect} from 'react'
import Input from '../../../../Components/Input'
import BlueBotton from '../../../../Components/BlueBotton'
import { fns } from '../../../../Functions'
import Table from '../../../../Components/Table V2'
import Select from '../../../../Components/Select'

function VentasPeriodo() {
    const [fechaI, setFechaI] = useState('')
    const [fechaF, setFechaF] = useState('')
    const [objetos, setObjetos] = useState([])
    const [buscado, setBuscado] = useState(false);
    const [empresa, setEmpresa] = useState('corp')

    const Heads = [
        {text:'Factura', type:'string'},
        {text:'Expedicion', type:'string'},
        {text:'Codigo cliente', type:'string'},
        {text:'Cliente', type:'string'},
        {text:'RFC', type:'string'},
        {text:'Agente', type:'string'},
        {text:'Ruta', type:'string'},
        {text:'Codigo producto', type:'string'},
        {text:'Producto', type:'string'},
        {text:'Familia', type:'string'},
        {text:'Unidades Facturadas', type:'string'},
        {text:'Costo uniario antes de IVA', type:'string'},
        {text:'Costo de adquisicion antes de IVA', type:'string'},
        {text:'Precio Unitario antes de IVA', type:'string'},
        {text:'Subtotal de venta antes de IVA', type:'string'},
        {text:'Utilidad antes de IVA', type:'string'},
    ]

    useEffect(()=>{
        async function getList(){
            const query = fns.makeUrlQuery({fechaI, fechaF})
            const respuesta = await fns.GetData(`ventas/periodo/${empresa}${query}`)
            console.log(respuesta);
            setObjetos(respuesta.map(fac=>{
                return {
                    FACTURA:`${fac.serie}-${fac.folio}`
                    ,EXPEDICION:fns.dateString(new Date(fac.expedicion))
                    ,CODIGOCLIENTE:fac.codigoCliente
                    ,CLIENTE:fac.nombreCliente
                    ,RFC:fac.rfc
                    ,AGENTE:fac.nombreAgente
                    ,RUTA:fac.ruta
                    ,CODIGOPRODUCTO:fac.codigoProducto
                    ,PRODUCTO:fac.nombreProducto
                    ,FAMILIA:fac.familia
                    ,UNIDADES:fac.unidadesCapturadas
                    ,UNITARIO:fns.moneyFormat(fac.costoUnitario)
                    ,ESPECIFICO:fns.moneyFormat(fac.costoEspecifico)
                    ,PRECIO:fns.moneyFormat(fac.precioUnitario)
                    ,SUBTOTAL:fns.moneyFormat(fac.subTotal)
                    ,UTILIDAD:fns.moneyFormat(fac.subTotal - fac.costoEspecifico)
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
            <Table  theme='bg-blue-950 text-white' colsHeads={Heads} list={objetos} manage={setObjetos}/>
        </div>
    )
}

export default VentasPeriodo