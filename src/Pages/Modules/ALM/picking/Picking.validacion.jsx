import { useEffect, useState, useRef } from 'react';
import * as fns from '../../../../Functions';
import BlueButton from '../../../../Components/BlueBotton'
import ButtonEmpresa from '../../../../Components/button.empresa';
import Table from '../../../../Components/Table V2';
import Input from '../../../../Components/Input';
import Div from '../../../../Components/Div';
import Predictive from '../../../../Components/Predictive'

function PickingDocumento() {
    const devHeads = [
        {text:'Expedicion', type:'string'},
        {text:'Documento', type:'string'},
        {text:'Razon Social', type:'string'},
        {text:'Total', type:'pesos'},
        {text:'Costo ', type:'pesos'},
        {text:'Estado', type:'string'},
    ]
    const pickedHeads = [...devHeads, {text:'Pendientes', type:'string'}]
    const divRef = useRef(null);

    const [fechaI, setFechaI] = useState('');
    const [fechaF, setFechaF] = useState('');
    const [empresa, setEmpresa] = useState('-1')
    const [doc, setDoc] = useState('-1');
    const [objetosPik, setObjetosPik] = useState([]);
    const [objetosDev, setObjetosDev] = useState([]);
    const [total, setTotal] = useState(0)
    const [totalCosto, setTotalCosto] = useState(0);
    const [folioI, setFolioI] = useState('');
    const [folioF, setFolioF] = useState('');
    const [costoI, setCostoI] = useState('');
    const [costoF, setCostoF] = useState('');
    const [rs, setRs] = useState('');
    const [pendienteI, setpendienteI] = useState('');
    const [pendienteF, setpendienteF] = useState('');
    const [estado, setEstado] = useState('');
    const [clientes, setClientes] = useState([]);
    const [submited, setSubmited] = useState([])
    useEffect(()=>{
        async function getData(){
            const result = await fns.GetData('/clientes/corp');
            setClientes(result);
        }
        getData();
    },[])
    useEffect(()=>{
        setObjetosPik([])
        setObjetosDev([])
    },[empresa, doc])
    useEffect(()=>{
        async function getData(){
            const query = fns.makeUrlQuery({folioI, folioF, costoI, costoF, pendienteI,pendienteF, razonS:rs, estado});
            const respuesta = await fns.GetData(`/almacen.inventario/validar/${empresa}/${fechaI}/${fechaF}/${doc}${query}`);
            console.log(respuesta);
            //let contTotal = 0
            //let contCosto = 0
            if(respuesta['mensaje']===undefined){
                /*setObjetosPik(respuesta.map(doc=>{
                    contTotal += doc.total;
                    contCosto += doc.costo;
                    const obj ={
                        EXPEDICION:doc.expedicion.substring(0,10),
                        DOCUEMNTO: `${doc.serie}-${doc.folio}`,
                        RS:doc.nombre,
                        TOTAL:doc.total,
                        COSTO:doc.costo,
                        ESTADO:doc.cancelado===0?'ACTIVO':'CANCELADO',
                        PENDIENTES:doc.unidadesPendientes
                    }
                    return obj
                }));
                setTotalCosto(contCosto);
                setTotal(contTotal);*/
                setList(respuesta);
            }else alert(respuesta['mensaje'])
            setSubmited([])
        }
        if(submited===null){
            setObjetosPik([])
            getData()
        }
    },[submited])
    function setList(array){
        let contTotal = 0
        let contCosto = 0
        const result = array.map(element=>{
            contTotal += element.total;
            contCosto += element.costo;
            const obj ={
                EXPEDICION:element.expedicion.substring(0,10),
                DOCUEMNTO: `${element.serie}-${element.folio}`,
                RS:element.nombre,
                TOTAL:element.total,
                COSTO:element.costo,
                ESTADO:element.cancelado===0?'ACTIVO':'CANCELADO',
            }
            if(doc ==='picking')return {...obj, PENDIENTES:element.unidadesPendientes}
            return obj
        });
        if(doc ==='picking')setObjetosPik(result);
        if(doc ==='devolucion')setObjetosDev(result);
        setTotalCosto(contCosto);
        setTotal(contTotal);
        setSubmited([])
    }
    async function handleSubmit(e){
        e.preventDefault();
        if(fechaI===''||fechaF==='')alert('Debe seleccionar ambas fechas');
        else{
            setSubmited(null);
        }
    }
    function getEncabezado(){
        let origen = 'Seleccionar empresa';
        if(empresa==='cdc')
          origen = 'COMERCIAL DOMOS COPERNICO' ;
        
        if(empresa==='cmp')
          origen = 'CENTRAL MAYORISTA DE PANELES';
        return <label className='text-cyan-600 flex flex-col justify-center items-center rounded-md text-xl'>
            {origen}
        </label>
        
    }
    return (
        <div className='flex flex-col items-center'>
            <label className='text-4xl text-cyan-800 font-extrabold'>
                Validacion de picking
            </label>
            <br />
            <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
                <br />
                <div className='flex flex-col w-full items-center'>
                    <div className={`flex flex-row`}>
                        <ButtonEmpresa text='CMP' fn={()=>setEmpresa('cmp')}/>
                        <span className='mx-1'/>
                        <ButtonEmpresa text='CDC' fn={()=>setEmpresa('cdc')}/>
                    </div>
                    <div className={`flex flex-row`}>
                        {getEncabezado()}
                    </div>
                    <span className='my-5'/>
                    <Div width='w-50 mx-1' height='text-end h-10' orientation='flex-row' parent={true}>
                        <Div>
                            <label>Fecha Inicial:</label>
                            <label>Fecha final:</label>
                            <label>Folio inicial:</label>
                        </Div>
                        <Div>
                            <Input fn = {()=>{}} id = 'FechaI' change ={e=>setFechaI(e.target.value)} value={fechaI} type='date' custom='w-full'/>
                            <Input fn = {()=>{}} id = 'FechaF' change ={e=>setFechaF(e.target.value)} value={fechaF} type='date' custom='w-full'/>
                            <Input fn = {()=>{}} id = 'FolioI' change ={e=>setFolioI(e.target.value)} value={folioI} type='number' custom='w-full'/>
                        </Div>
                        <Div>
                            <label>Folio final:</label>
                            <label>Costo a partir de:</label>
                            <label>Costo hasta:</label>
                        </Div>
                        <Div >  
                            <Input fn = {()=>{}} id = 'FolioF' change ={e=>setFolioF(e.target.value)} value={folioF} type='number' custom='w-full'/>
                            <Input fn = {()=>{}} id = 'CostoI' change ={e=>setCostoI(e.target.value)} value={costoI} type='number' custom='w-full'/>
                            <Input fn = {()=>{}} id = 'CostoF' change ={e=>setCostoF(e.target.value)} value={costoF} type='number' custom='w-full'/>
                            
                        </Div>
                        <Div>
                            <label>Pendiente a partir de:</label>
                            <label>Pendiente hasta:</label>
                            <label>Razon Social:</label>
                        </Div>
                        <Div>
                            <Input fn = {()=>{}} id = 'pendienteI' change ={e=>setpendienteI(e.target.value)} value={pendienteI} type='number' custom='w-full'/>
                            <Input fn = {()=>{}} id = 'pendienteF' change ={e=>setpendienteF(e.target.value)} value={pendienteF} type='number' custom='w-full'/>
                            <div ref={divRef}>
                                <Predictive Parameter='nombre'
                                id={'nombre'} change={setRs} value={rs} list = {clientes}
                                fn={(e)=>{
                                    divRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                                    //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                                }}
                                />
                            </div>
                        </Div>
                        <Div>                            
                            <label>Estado:</label>
                            
                        </Div>
                        <Div>                   
                            <select className='w-full' onChange={e=>setEstado(e.target.value)} value={estado}>
                                <option value="">Seleccionar Opcion</option>
                                <option value="0">ACTIVO</option>
                                <option value="1">CANCELADO</option>
                            </select>
                            <Div parent={true} orientation={'flex-row'} width={'w-20'}>
                                <Div >
                                    <label>Picking</label>
                                    <label>Devolucion</label>
                                </Div>
                                <Div >
                                    <input type="radio" name='documento' value={'picking'} onChange={e=>setDoc(e.target.value)}/>
                                    <input type="radio" name='documento' value={'devolucion'} onChange={e=>setDoc(e.target.value)}/>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                </div>
                <span className=' my-3'/>
                <br />
                <BlueButton text='Buscar' fn={handleSubmit}/>
                <br />
                <div className={`${(objetosPik.length||objetosDev.length)>0?'flex flex-col':'hidden'} items-center justify-center`}>
                    <table>
                        <thead>
                            <tr>
                                <th className='bg-blue-950 text-white'>
                                    Total de los documentos
                                </th>
                                <th className=' font-normal'>
                                    {fns.moneyFormat(total)}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='bg-blue-950 text-white font-bold'>
                                    Total de los costos
                                </td>
                                <td>
                                    {fns.moneyFormat(totalCosto)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <div className={`${(objetosPik.length>0&&doc==='picking')?'visible':'hidden'}`}>
                        <Table  theme='bg-blue-950 text-white' colsHeads={pickedHeads} list={objetosPik} manage={setObjetosPik}/>
                    </div>
                    <div className={`${(objetosDev.length>0&&doc==='devolucion')?'visible':'hidden'}`}>
                        <Table  theme='bg-blue-950 text-white' colsHeads={devHeads} list={objetosDev} manage={setObjetosDev}/>
                    </div>
                </div>
            </form>
            <br />
        </div>
    )
}
export default PickingDocumento
/*
*/