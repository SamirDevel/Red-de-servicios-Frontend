import { useEffect, useState, useRef } from 'react';
import * as fns from '../../../../Functions';
import BlueButton from '../../../../Components/BlueBotton'
import Predictive from '../../../../Components/Predictive';
import Input from '../../../../Components/Input';
import { BsFiletypePdf } from 'react-icons/bs';
import IconButton from '../../../../Components/IconButton';
import jsPDF from 'jspdf';

function ConsultaPicking() {
    const [rutas, setRutas] = useState([])
    const [ruta, setRuta] = useState('')
    const [empresa, setEmpresa] = useState('NA')
    const [fechaI, setFechaI] = useState('')
    const [fechaF, setFechaF] = useState('')
    const [picking, setPicking] = useState([]);
    const divRef = useRef(null);

    useEffect(()=>{
        async function getRutas(){
            const respuesta = await fns.GetData('/documentos/rutas/corp');
            setRutas(respuesta)
        }
        getRutas();
    }, [])

    async function handdleSubmit(e){
        e.preventDefault();
        const respuesta = await fns.GetData(`/almacen.inventario/consultar/${ruta!==''?ruta:'NA'}/${empresa}/${fechaI!==''?fechaI:'NA'}/${fechaF!==''?fechaF:'NA'}`);
            if(respuesta['mensaje']===undefined){
                setPicking(respuesta);
            }else alert(respuesta['mensaje'])
    }

    function getData(picked){
        const array = new Array();
        picked['detalles'].forEach((det, index)=>{
            array.push([(index+1), det['codigo'], det['nombre'], det['cantidad']])
        })
        return array;
    }

    function getTotal(picked){
        let cont = 0;
        picked['detalles'].forEach(det=>{
            cont+=det['cantidad'];
        })
        return cont
    }

    async function makePDF(picked){
        const doc = new jsPDF('p', 'mm', 'a4'); 
        const names = picked['rangos'].map(picked=>{
            return {nombre:picked['serie'], rango:`${picked['folioI']}-${picked['folioF']}`}
        })
        doc.setFontSize(12);
        let string = '';
        if(picked['empresa']==='cdc')string = 'COMERCIAL DOMOS COPERNICO S.A. DE C.V.'
        if(picked['empresa']==='cmp')string = 'CENTRAL MAYORISTA DE PANELES S.A. DE C.V.'
        doc.text(string, 40, 16);
        doc.text(`Compilado de picking`, 160, 16);
        let yAxis = 23;
        names.forEach(name=>{
            doc.text(`${name['nombre']}: ${name['rango']}`, 162, yAxis);
            yAxis +=7
        })
        const data = getData(picked);
        const total = getTotal(picked);
        const logo = new Image();
        logo.src = '/Public/CMP image 2.png';
        doc.addImage(logo,'JPG',5,5,35,35);
        doc.text(`Fecha ${picked['fecha'].substring(0,10)}`, 40, 22);
        doc.text(`Total de productos: ${total}`, 40, 28);
        doc.text(ruta, 40, 34);
        doc.autoTable({
            head:[['#', 'Codigo','Producto', 'Cantidad']],
            body: data,
            startY: yAxis<42?42:yAxis+7,
            styles:{
              fontSize: 8,
              width: 'fit-content',
              valign: 'middle',
              halign : 'center',
              cellWidth: 'wrap'
          }
          });
        window.open(doc.output("bloburl"), "Carta", "width=inherit, height=0");
    }

    return (
        <form className='flex flex-col items-center' onSubmit={handdleSubmit}>
            <label>Consulta de registros</label>
            <div className='flex flex-row'>
                <div className='flex flex-col items-end'>
                    <label>Ruta:</label>
                    <span className='my-1'/>
                    <label>Empresa:</label>
                    <span className='my-1'/>
                    <label>Desde el día:</label>
                    <span className='my-1'/>
                    <label>Hasta el día:</label>
                </div>
                <span className='mx-4'/>
                <div className='flex flex-col items-start'ref={divRef}>
                    <Predictive Parameter='nombre'
                    id={'ruta'} change={setRuta} value={ruta} list = {rutas}
                    fn={(e)=>{
                        divRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                        //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                    }}
                    />
                    <span className='my-1'/>
                    <select className='w-full px-2 rounded-xl border-solid border-2 border-black' value={empresa} onChange={e=>setEmpresa(e.target.value)}>
                        <option value="NA">Ambas</option>
                        <option value="cdc">CDC</option>
                        <option value="cmp">CMP</option>
                    </select>
                    <span className='my-1'/>
                    <Input fn = {()=>{}} id = 'FechaI' change ={e=>{setFechaI(e.target.value)}} value={fechaI} type='date' custom='w-full'/>
                    <span className='my-1'/>
                    <Input fn = {()=>{}} id = 'FechaF' change ={e=>{setFechaF(e.target.value)}} value={fechaF} type='date' custom='w-full'/>
                </div>
            </div>
            <br />
            <BlueButton text='Buscar' fn={handdleSubmit}/>
            <br />
            <div className='flex flex-col'>
                    {picking.map(picked=>{
                        //console.log(picked);
                        return <div className='flex flex-row my-3' key={picked['id']}>
                            <label>Empresa: {picked['empresa'].toUpperCase()}</label>
                            <span className='mx-1'/>
                            <label>Fecha: {picked['fecha'].substring(0,10)}</label>
                            <span className='mx-1'/>
                            <label>Ruta: {picked['nombre']}</label>
                            <span className='mx-1'/>
                            <IconButton icon={<BsFiletypePdf size={25} className='redHover'/>} fn={()=>makePDF(picked)}/>
                        </div>
                    })}
            </div>
        </form>
    )
}

export default ConsultaPicking